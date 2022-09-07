import * as trpc from '@trpc/server'

import type {
  AnySyncProvider,
  ConnectedSource,
  KVStore,
  Link,
  LinkFactory} from '@ledger-sync/cdk-core';
import {
  zStandardConnection,
  zStandardInstitution,
} from '@ledger-sync/cdk-core'
import {
  handlersLink,
  makeCoreId,
  zConnectContext,
  zWebhookInput,
} from '@ledger-sync/cdk-core'
import type {LedgerSyncProvider} from '@ledger-sync/cdk-ledger'
import {zStandard} from '@ledger-sync/cdk-ledger'
import {
  R,
  routerFromZFunctionMap,
  Rx,
  rxjs,
  splitPrefixedId,
  z,
  zFunction,
} from '@ledger-sync/util'

import type {
  IntegrationInput,
  ParsedConn,
  ParsedInt,
  ParsedPipeline,
  PipelineInput,
} from './makeSyncHelpers'
import {makeSyncHelpers} from './makeSyncHelpers'
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

  /** getDefaultIntegrations will need to change to getIntegrations(forWorkspace) later  */
  const {zInt, zConn, zPipeline, metaStore, getDefaultIntegrations} =
    makeSyncHelpers({
      providers,
      kvStore,
      defaultIntegrations,
      defaultPipeline,
    })

  function parsedConn(
    int: ParsedInt,
    cs: ConnectedSource<TProviders[number]['def']>,
  ): ParsedConn {
    return {
      provider: int.provider,
      integrationId: int.id,
      config: int.config,
      id: makeCoreId(
        'conn',
        int.provider.name,
        cs.externalId,
      ) as ParsedConn['id'],
      settings: int.provider.def.connectionSettings?.parse(cs.settings),
      // ConnectionUpdates should be synced without needing a pipeline at all...
      _source$: cs.source$.pipe(
        // Should we actually start with _opMeta? Or let each provider control this
        // and reduce connectedSource to a mere [connectionId, Source] ?
        Rx.startWith(
          int.provider.def._opConn(cs.externalId, {
            integrationId: int.id,
            settings: cs.settings,
            ledgerId: cs.ledgerId,
            envName: cs.envName,
          }),
        ),
      ),
      _destination$$: undefined,
    }
  }

  const syncEngine = {
    // Should we infer the input / return types if possible even without validation?
    health: zFunction([], z.string(), () => 'Ok ' + new Date().toISOString()),
    listPreConnectOptions: zFunction(
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
    listInstitutions: zFunction(async () => {
      const records = await metaStore.list<[string, Record<string, unknown>]>()
      const ints = await getDefaultIntegrations()
      const intsByProviderName = R.groupBy(ints, (int) => int.provider.name)

      return records
        .map(([id, value]) => ({...value, id}))
        .filter((item) => item.id.startsWith('ins_'))
        .flatMap((item) => {
          const res = zStandardInstitution
            .omit({id: true})
            .safeParse((item as any).standard)
          if (!res.success) {
            console.error('Invalid institution found', item, res.error)
            return []
          }
          const [, providerName] = splitPrefixedId(item.id)
          return (intsByProviderName[providerName] ?? []).map((int) => ({
            ins: {...res.data, id: item.id},
            int: {id: int.id, provider: int.provider.name},
          }))
        })
    }),
    listConnections: zFunction(
      z.object({ledgerId: z.string().nullish()}).optional(),
      async ({ledgerId} = {}) => {
        // Add info about what it takes to `reconnect` here for connections which
        // has disconnected
        const stuff = await metaStore.list<[string, Record<string, unknown>]>()
        return stuff
          .map(([id, value]) => ({...value, id}))
          .filter((item) => item.id.startsWith('conn'))
          .filter(
            (item) =>
              !ledgerId ||
              (item as Record<string, unknown>)['ledgerId'] === ledgerId,
          )
      },
    ),

    // TODO: Test out the `describe` function in zod...

    getIntegration: zFunction(zInt, async (int) => ({
      config: int.config,
      provider: int.provider.name,
      id: int.id,
    })),

    syncMetadata: zFunction(zInt.optional(), async (int) => {
      const ints = int ? [int] : await getDefaultIntegrations()
      const stats = await sync({
        source: rxjs.merge(
          ...ints.map(
            (int) =>
              int.provider.metaSync?.({config: int.config}).pipe(
                handlersLink({
                  data: (op) =>
                    rxjs.of({
                      ...op,
                      data: {
                        ...op.data,
                        entity: {
                          external: op.data.entity,
                          standard: int.provider.standardMappers?.institution?.(
                            op.data.entity,
                            int.config,
                          ),
                        },
                      },
                    }),
                }),
              ) ?? rxjs.EMPTY,
          ),
        ),
        destination: metaStore.institutionDestLink(),
      })
      return `Synced ${stats} institutions from ${ints.length} providers`
    }),
    syncPipeline: zFunction(zPipeline, async function syncPipeline(pipeline) {
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
        source: source$.pipe(
          // logLink({prefix: 'postSource', verbose: true}),
          metaStore.postSourceLink(pipeline),
        ),
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
            // TODO: This is really not typesafe, let's fix me...
            src: {...conn, provider: conn.provider.name},
          }),
        )
      }
      await Promise.all(
        pipelines.map((pipe) =>
          syncEngine.syncPipeline.impl({
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
    postConnect: zFunction(
      // Questionable why `zConnectContext` should be there. Examine whether this is actually
      // needed
      [zInt, z.unknown(), zConnectContext],
      // How do we verify that the ledgerId here is the same as the ledgerId from preConnectOption?
      async (int, input, ctx) => {
        const {provider: p, config} = int
        console.log('didConnect start', p.name, input)
        if (!p.postConnect || !p.def.connectOutput) {
          return 'Noop'
        }
        const cs = await p.postConnect(p.def.connectOutput.parse(input), config)

        await syncEngine.syncConnection.impl(parsedConn(int, {...cs, ...ctx}))

        console.log('didConnect finish', p.name, input)
        return 'Connection Success'
      },
    ),
    revokeConnection: zFunction(zConn, async ({provider, settings, config}) =>
      provider.revokeConnection?.(settings, config),
    ),
    handleWebhook: zFunction([zInt, zWebhookInput], async (int, input) => {
      if (!int.provider.def.webhookInput || !int.provider.handleWebhook) {
        console.warn(`${int.provider.name} does not handle webhooks`)
        return
      }
      const csArray = await int.provider.handleWebhook(
        int.provider.def.webhookInput.parse(input),
        int.config,
      )
      await Promise.all(
        csArray.map((cs) =>
          syncEngine.syncConnection.impl(parsedConn(int, cs)),
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
