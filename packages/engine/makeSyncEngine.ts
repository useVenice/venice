import {
  AnySyncProvider,
  ConnectedSource,
  KVStore,
  Link,
  LinkFactory,
  zConnectContext,
  zWebhookInput,
} from '@ledger-sync/cdk-core'
import {
  R,
  routerFromZFunctionMap,
  Rx,
  rxjs,
  z,
  zFunction,
} from '@ledger-sync/util'
import * as trpc from '@trpc/server'
import {
  IntegrationInput,
  makeSyncHelpers,
  ParsedConn,
  ParsedInt,
  ParsedPipeline,
  PipelineInput,
} from './makeSyncHelpers'
import {sync} from './sync'

export {type inferProcedureInput} from '@trpc/server'

type _inferInput<T> = T extends z.ZodTypeAny ? z.input<T> : never

export interface SyncEngineConfig<
  TProviders extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
> {
  providers: TProviders
  linkMap?: TLinks

  /** Used to store metadata */
  kvStore: KVStore<Record<string, unknown>> | undefined

  /** Base url of the router when deployed, e.g. `localhost:3000/api/ledger-sync` */
  routerUrl?: string

  // Figure out why we have to say `Link<any>` here rather than AnyEntityPayload
  getLinksForPipeline?: (pipeline: ParsedPipeline) => Array<Link<any>>

  defaultPipeline?: PipelineInput<
    TProviders[number],
    TProviders[number],
    TLinks
  >
  defaultIntegrations?:
    | Array<IntegrationInput<TProviders[number]>>
    | {
        [k in TProviders[number]['name']]?: _inferInput<
          Extract<TProviders[number], {name: k}>['def']['integrationConfig']
        >
      }
}

export const makeSyncEngine = <
  TProviders extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>({
  providers,
  kvStore,
  defaultPipeline,
  defaultIntegrations,
  getLinksForPipeline,
}: SyncEngineConfig<TProviders, TLinks>) => {
  // NEXT: Validate defaultDest and defaultIntegrations at init time rather than run time.

  const {zInt, zConn, zPipeline, metaStore, getDefaultIntegrations} =
    makeSyncHelpers({
      providers,
      kvStore,
      defaultIntegrations,
      defaultPipeline,
    })

  function fromConnectedSource(
    int: ParsedInt,
    cs: ConnectedSource<TProviders[number]['def']>,
  ): ParsedConn {
    return {
      provider: int.provider,
      integrationId: int.id,
      config: int.config,
      id: cs.connectionId,
      settings: int.provider.def.connectionSettings?.parse(cs.settings),
      _source$: cs.source$.pipe(
        // Should we actually start with _opMeta? Or let each provider control this
        // and reduce connectedSource to a mere [connectionId, Source] ?
        Rx.startWith(int.provider.def._opMeta(cs.connectionId, cs.settings)),
      ),
      _destination$$: undefined,
    }
  }

  const syncEngine = {
    providers,
    // Should we infer the input / return types if possible even without validation?
    health: zFunction([], z.string(), () => 'Ok ' + new Date().toISOString()),
    // TODO: Rename me from listIntegrations
    listIntegrations: zFunction(
      zConnectContext.extend({
        type: z.enum(['source', 'destination']).nullish(),
      }),
      // z.promise(z.array(z.object({type: z.enum(['source'])}))),
      async ({type, ...ctx}) => {
        const ints = await getDefaultIntegrations()
        return ints
          .map((int) => ({
            ...int,
            isSource: !!int.provider.sourceSync,
            isDestination: !!int.provider.destinationSync,
          }))
          .filter(
            (int) =>
              !type ||
              (type === 'source' && int.isSource) ||
              (type === 'destination' && int.isDestination),
          )
          .flatMap((int) =>
            (int.provider.getPreConnectInputs?.(ctx) ?? [{}]).map((option) => ({
              ...option,
              int: {
                id: int.id,
                provider: int.provider.name,
              },
            })),
          )
      },
    ),
    sync: zFunction(zPipeline, async function syncPipeline(pipeline) {
      const {src, links, dest, watch} = pipeline
      const source$ =
        src._source$ ??
        src.provider.sourceSync?.(
          R.pick(src, ['config', 'settings', 'options']),
        )

      const destination$$ =
        dest._destination$$ ??
        dest.provider.destinationSync?.(
          R.pick(dest, ['config', 'settings', 'options']),
        )

      if (!source$) {
        throw new Error(`${src.provider.name} is not a source`)
      }
      if (!destination$$) {
        throw new Error(`${dest.provider.name} is not a destination`)
      }

      await sync({
        // Raw Source, may come from fs, firestore or postgres
        source: source$.pipe(metaStore.postSourceLink(pipeline)),
        links: getLinksForPipeline?.(pipeline) ?? links,
        // WARNING: It is insanely unclear to me why moving `metaStore.link`
        // to after provider.destinationSync makes all the difference.
        // When syncing from firebase with a large number of docs,
        // we always seem to stop after 1600 or so documents.
        // I already checked this is because metaStore.link runs a async comment
        // even delay(100) introduces issues.
        // It's worth trying to reproduce this with say a simple counter source and see if
        // it happens...
        destination: rxjs.pipe(
          destination$$,
          metaStore.postDestinationLink(pipeline),
        ),
        watch,
      })
    }),
    syncConnection: zFunction(zConn, async function syncConnection(conn) {
      const pipelines = conn.id
        ? await metaStore
            .getPipelinesForConnection(conn.id)
            .then((res) => Promise.all(res.map((r) => zPipeline.parseAsync(r))))
        : []

      if (!pipelines.length && defaultPipeline) {
        pipelines.push(
          await zPipeline.parseAsync({
            ...defaultPipeline,
            // Could the new connection be dest as well?
            // Should make defaultPipeline a function that accepts a connection
            src: conn,
          }),
        )
      }
      await Promise.all(
        pipelines.map((pipe) =>
          syncEngine.sync.impl({
            ...pipe,
            src: {...pipe.src, _source$: conn._source$},
            dest: {...pipe.dest, _destination$$: conn._destination$$},
          }),
        ),
      )
    }),
    // getPreConnectInputs happens client side only
    preConnect: zFunction([zInt, z.unknown()], ({provider: p, config}, input) =>
      p.preConnect?.(p.def.preConnectInput?.parse(input), config),
    ),
    // useConnectHook happens client side only
    // for cli usage, can just call `postConnect` directly. Consider making the
    // flow a bit smoother with a guided cli flow
    postConnect: zFunction([zInt, z.unknown()], async (int, input) => {
      const {provider: p, config} = int
      console.log('didConnect start', p.name, input)
      if (!p.postConnect || !p.def.connectOutput) {
        return 'Noop'
      }
      const cs = await p.postConnect(p.def.connectOutput?.parse(input), config)
      await syncEngine.syncConnection.impl(fromConnectedSource(int, cs))

      console.log('didConnect finish', p.name, input)
      return 'Connection Success'
    }),
    revokeConnection: zFunction(zConn, async ({provider, settings, config}) =>
      provider.revokeConnection?.(settings, config),
    ),
    handleWebhook: zFunction([zInt, zWebhookInput], async (int, input) => {
      if (!int.provider.def.webhookInput || !int.provider.handleWebhook) {
        console.warn(`${int.provider.name} does not handle webhooks`)
        return
      }
      const css = await int.provider.handleWebhook(
        int.provider.def.webhookInput.parse(input),
        int.config,
      )
      await Promise.all(
        css.map((cs) =>
          syncEngine.syncConnection.impl(fromConnectedSource(int, cs)),
        ),
      )
    }),
  }

  const makeRouter = () => trpc.router()

  // This is a single function for now because we can't figure out how to type
  // makeLedgerSyncNextRouter separately
  const router = routerFromZFunctionMap(makeRouter(), syncEngine)
    .query('debug', {input: z.string(), resolve: ({input}) => input})
    .merge('meta/', routerFromZFunctionMap(makeRouter(), metaStore))
  // router.createCaller().query('connectionsget')
  return [syncEngine, router, metaStore] as const
}

/** Only purpose of this is to support type inference */
makeSyncEngine.config = <
  TProviders extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>(
  config: SyncEngineConfig<TProviders, TLinks>,
) => config
