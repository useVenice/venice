import {
  AnySyncProvider,
  ConnectedSource,
  IntId,
  KVStore,
  Link,
  LinkFactory,
  sync,
  WebhookInput,
  zWebhookInput,
} from '@ledger-sync/cdk-core'
import {
  NonEmptyArray,
  R,
  routerFromZFunctionMap,
  Rx,
  rxjs,
  z,
  zFunction,
} from '@ledger-sync/util'
import * as trpc from '@trpc/server'
import {inferProcedureInput} from '@trpc/server'
import {
  IntegrationInput,
  makeSyncCoreHelpers as makeSyncHelpers,
  ParsedConn,
  ParsedInt,
  ParsedPipeline,
  PipelineInput,
} from './makeSyncHelpers'

export {type inferProcedureInput} from '@trpc/server'

type _inferInput<T> = T extends z.ZodTypeAny ? z.input<T> : never

export interface SyncCoreConfig<
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

export const makeCoreSync = <
  TProviders extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>({
  providers,
  kvStore,
  defaultPipeline,
  defaultIntegrations,
  getLinksForPipeline,
}: SyncCoreConfig<TProviders, TLinks>) => {
  // NEXT: Validate defaultDest and defaultIntegrations at init time rather than run time.

  const {zInt, zConn, zPipeline, metaStore} = makeSyncHelpers({
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

  const coreSync = {
    providers,
    // Should we infer the input / return types if possible even without validation?
    health: zFunction([], z.string(), () => 'Ok ' + new Date().toISOString()),
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
          coreSync.sync.impl({
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
      await coreSync.syncConnection.impl(fromConnectedSource(int, cs))

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
          coreSync.syncConnection.impl(fromConnectedSource(int, cs)),
        ),
      )
    }),
  }

  const makeRouter = () => trpc.router()

  // This is a single function for now because we can't figure out how to type
  // makeLedgerSyncNextRouter separately
  const router = routerFromZFunctionMap(makeRouter(), coreSync)
    .query('debug', {input: z.string(), resolve: ({input}) => input})
    .merge('meta/', routerFromZFunctionMap(makeRouter(), metaStore))
  // router.createCaller().query('connectionsget')
  return [coreSync, router, metaStore] as const
}

/** Only purpose of this is to support type inference */
makeCoreSync.config = <
  TProviders extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>(
  config: SyncCoreConfig<TProviders, TLinks>,
) => config

type SyncRouter = ReturnType<typeof makeCoreSync>[1]
type HandleWebhookInput = inferProcedureInput<
  SyncRouter['_def']['mutations']['handleWebhook']
>

export function parseWebhookRequest(
  req: WebhookInput & {pathSegments: NonEmptyArray<string>; method?: string},
) {
  const [procedure, provider, localId] = req.pathSegments
  if (procedure !== 'webhook') {
    return {...req, procedure}
  }
  const id = localId ? (`int_${provider}_${localId}` as IntId) : undefined
  const input: HandleWebhookInput = [
    // Consider naming it integrationId? not sure.
    id ? {id} : {provider},
    {
      query: req.query,
      headers: req.headers,
      body: req.body,
    },
  ]
  return {
    ...req,
    procedure: 'handleWebhook',
    // Need to stringify because of getRawProcedureInputOrThrow
    ...(req.method?.toUpperCase() === 'GET'
      ? {query: {...req.query, input: JSON.stringify(input)}}
      : {body: input}),
  }
}
parseWebhookRequest.isWebhook = (pathSegments: NonEmptyArray<string>) =>
  pathSegments[0] === 'webhook'

// Make error message more understandable. But security risk... so turn me off unless debugging
if (process.env['NODE_ENV'] === 'development') {
  z.setErrorMap((_issue, ctx) => {
    // Need to get the `schema` as well.. otherwise very hard
    console.error(`[zod] Data did not pass validation`, ctx.data)
    return {message: ctx.defaultError}
  })
}
