import * as trpc from '@trpc/server'
import type {JwtPayload} from 'jsonwebtoken'

import type {
  AnyEntityPayload,
  AnySyncProvider,
  ConnectionUpdate,
  Destination,
  Link,
  LinkFactory,
  MetaService,
  Source,
} from '@ledger-sync/cdk-core'
import {
  extractId,
  handlersLink,
  makeId,
  makeSyncProvider,
  sync,
  zId,
  zStandard,
  zWebhookInput,
} from '@ledger-sync/cdk-core'
import {
  compact,
  R,
  routerFromZFunctionMap,
  rxjs,
  splitPrefixedId,
  z,
  zFunction,
  zTrimedString,
} from '@ledger-sync/util'

import type {UserInfo} from './createEngineContext'
import {makeMetaLinks} from './makeMetaLinks'
import type {
  ConnectionInput,
  IntegrationInput,
  ParsedInt,
  ParsedPipeline,
  PipelineInput,
  ZInput,
} from './makeSyncParsers'
import {makeSyncParsers, zSyncOptions} from './makeSyncParsers'

export {type inferProcedureInput} from '@trpc/server'

type _inferInput<T> = T extends z.ZodTypeAny ? z.input<T> : never
export interface SyncEngineConfig<
  TProviders extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
> {
  providers: TProviders
  /**
   * Base url of the engine-backend router when deployed, e.g. `localhost:3000/api/ledger-sync`
   * This is needed for 1) server side rendering and 2) webhook handling
   */
  apiUrl?: string
  // Backend only
  linkMap?: TLinks

  /** Used for authentication */
  jwtSecretOrPublicKey?: string
  userInfoFromJwt?: (jwtPayload: JwtPayload) => UserInfo

  /** Used to store metadata */
  metaService: MetaService
  // Figure out why we have to say `Link<any>` here rather than AnyEntityPayload
  getLinksForPipeline?: (pipeline: ParsedPipeline) => Array<Link<any>>

  getDefaultPipeline?: (
    connInput?: ConnectionInput<TProviders[number]>,
  ) => PipelineInput<TProviders[number], TProviders[number], TLinks>
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
  metaService,
  providers,
  getDefaultPipeline,
  defaultIntegrations,
  getLinksForPipeline,
}: SyncEngineConfig<TProviders, TLinks>) => {
  // NEXT: Validate defaultDest and defaultIntegrations at init time rather than run time.
  const providerMap = R.mapToObj(providers, (p) => [p.name, p])
  const metaLinks = makeMetaLinks(metaService)

  // TODO: Re-enable me when providers are no longer being constructed client side...
  // Perhaps validating the default pipeline also
  const defaultIntegrationInputs = Array.isArray(defaultIntegrations)
    ? defaultIntegrations
    : R.toPairs(defaultIntegrations ?? {}).map(
        ([name, config]): IntegrationInput => ({
          id: makeId('int', name, ''), // This will end up with an ending `_` is it an issue?
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config: config as any,
        }),
      )
  /** getDefaultIntegrations will need to change to getIntegrations(forWorkspace) later  */
  const {zInt, zConn, zPipeline, zConnectContext} = makeSyncParsers({
    providers,
    getDefaultPipeline,
    getDefaultConfig: (name, id) =>
      defaultIntegrationInputs.find(
        (i) => (id && i.id === id) || (i.id && extractId(i.id)[1] === name),
      )?.config,
    metaService,
  })

  const getDefaultIntegrations = async () =>
    Promise.all(
      defaultIntegrationInputs.map((input) =>
        zInt.parseAsync(input).catch((err) => {
          console.error('Error initialzing', input, err)
          throw new Error(`Error initializing integration ${input.id} `)
        }),
      ),
    )

  const getPipelinesForConnection = (connInput: ZInput['connection']) => {
    const defaultPipeline = () =>
      getDefaultPipeline?.(connInput as ConnectionInput<TProviders[number]>)

    // TODO: In the case of an existing `conn`, how do we update conn.settings too?
    // Otherwise we will result in outdated settings...
    return metaService
      .findPipelines({connectionIds: [connInput.id]})
      .then((pipes) => (pipes.length ? pipes : compact([defaultPipeline()])))
      .then((pipes) => Promise.all(pipes.map((p) => zPipeline.parseAsync(p))))
  }

  const _syncConnectionUpdate = async (
    int: ParsedInt,
    connUpdate: ConnectionUpdate<AnyEntityPayload, {}>,
  ) => {
    console.log('[_syncConnectionUpdate]', connUpdate)
    const connId = makeId(
      'conn',
      int.provider.name,
      connUpdate.connectionExternalId,
    )
    const pipelines = await getPipelinesForConnection({
      id: connId,
      // Should we spread connUpdate into it?
      settings: connUpdate.settings,
      ledgerId: connUpdate.ledgerId,
      // institution: connUpdate.institution,
    })
    console.log('_syncConnectionUpdate', pipelines)

    const helpers = makeSyncProvider.def.helpers(int.provider.def)

    await Promise.all(
      pipelines.map(async (pipe) => {
        // TODO(p2)
        // FIXME: Combine the two calls to _syncPipeline so it is only one...
        await _syncPipeline(pipe, {
          source$: rxjs.concat(
            rxjs.of(
              helpers._opConn(`${connUpdate.connectionExternalId}`, {
                settings: connUpdate.settings,
                institution: connUpdate.institution,
              }),
            ),
            connUpdate.source$ ?? rxjs.EMPTY,
          ),
        })
        if (connUpdate.triggerDefaultSync) {
          await _syncPipeline(pipe, {})
        }
      }),
    )
  }

  const _syncPipeline = async (
    pipeline: ParsedPipeline,
    opts: z.infer<typeof zSyncOptions> & {
      source$?: Source<AnyEntityPayload>
      destination$$?: Destination
    } = {},
  ) => {
    console.log('[syncPipeline]', pipeline)
    const {source: src, links, destination: dest, watch, ...rest} = pipeline
    const source$ =
      opts.source$ ??
      src.integration.provider.sourceSync?.({
        config: src.integration.config,
        settings: src.settings,
        // Maybe we should rename `options` to `state`?
        // Should also make the distinction between `config`, `settings` and `state` much more clear.
        state: opts.fullResync ? undefined : rest.sourceState,
      })

    const destination$$ =
      opts.destination$$ ??
      dest.integration.provider.destinationSync?.({
        config: dest.integration.config,
        settings: dest.settings,
        state: opts.fullResync ? undefined : rest.destinationState,
      })

    if (!source$) {
      throw new Error(`${src.integration.provider.name} missing source`)
    }
    if (!destination$$) {
      throw new Error(`${dest.integration.provider.name} missing destination`)
    }

    await metaLinks.patch('pipeline', pipeline.id, {
      // TODO(p2)
      sourceId: pipeline.sourceId, // FIXME: This needs to be consistently used... Let metaLinks handle it
      lastSyncStartedAt: new Date(),
    })

    await sync({
      // Raw Source, may come from fs, firestore or postgres
      source: source$.pipe(
        // logLink({prefix: 'postSource', verbose: true}),
        metaLinks.postSource({src}),
      ),
      links: getLinksForPipeline?.(pipeline) ?? links,
      // WARNING: It is insanely unclear to me why moving `metaLinks.link`
      // to after provider.destinationSync makes all the difference.
      // When syncing from firebase with a large number of docs,
      // we always seem to stop after 1600 or so documents.
      // I already checked this is because metaLinks.link runs a async comment
      // even delay(100) introduces issues.
      // It's worth trying to reproduce this with say a simple counter source and see if
      // it happens...
      destination: rxjs.pipe(
        destination$$,
        metaLinks.postDestination({pipeline, dest}),
      ),
      watch,
    }).finally(() =>
      metaLinks.patch('pipeline', pipeline.id, {
        lastSyncCompletedAt: new Date(),
      }),
    )
  }

  const syncEngine = {
    // Should we infer the input / return types if possible even without validation?
    health: zFunction([], z.string(), () => 'Ok ' + new Date().toISOString()),

    // MARK: - Metadata  etc

    adminSearchLedgerIds: zFunction(
      z.object({keywords: zTrimedString.nullish()}).optional(),
      async ({keywords} = {}) => metaService.searchLedgerIds({keywords}),
    ),
    adminGetIntegration: zFunction(zInt, async (int) => ({
      config: int.config,
      provider: int.provider.name,
      id: int.id,
    })),

    listIntegrations: zFunction(
      z.object({type: z.enum(['source', 'destination']).nullish()}),
      // z.promise(z.array(z.object({type: z.enum(['source'])}))),
      async ({type}) => {
        const ints = await getDefaultIntegrations()
        return ints
          .map((int) => ({
            // ...int,
            id: int.id,
            provider: int.provider.name,
            isSource: !!int.provider.sourceSync,
            isDestination: !!int.provider.destinationSync,
          }))
          .filter(
            (int) =>
              !type ||
              (type === 'source' && int.isSource) ||
              (type === 'destination' && int.isDestination),
          )
      },
    ),
    searchInstitutions: zFunction(
      z.object({keywords: zTrimedString.nullish()}).optional(),
      async ({keywords} = {}) => {
        const ints = await getDefaultIntegrations()
        const institutions = await metaService.searchInstitutions({
          keywords,
          limit: 10,
          providerNames: R.uniq(ints.map((int) => int.provider.name)),
        })
        const intsByProviderName = R.groupBy(ints, (int) => int.provider.name)
        return institutions.flatMap((ins) => {
          const [, providerName, externalId] = splitPrefixedId(ins.id)
          const standard = providerMap[
            providerName
          ]?.standardMappers?.institution?.(ins.external)
          const res = zStandard.institution.omit({id: true}).safeParse(standard)

          if (!res.success) {
            console.error('Invalid institution found', ins, res.error)
            return []
          }
          return (intsByProviderName[providerName] ?? []).map((int) => ({
            ins: {...res.data, id: ins.id, externalId},
            int: {id: int.id},
          }))
        })
      },
    ),
    listConnections: zFunction(
      z.object({ledgerId: zId('ldgr').nullish()}).optional(),
      async ({ledgerId} = {}) => {
        // Add info about what it takes to `reconnect` here for connections which
        // has disconnected
        const connections = await metaService.tables.connection.list({
          ledgerId,
        })
        const insById = R.pipe(
          await metaService.tables.institution.list({
            ids: compact(connections.map((c) => c.institutionId)),
          }),
          (insList) => R.mapToObj(insList, (ins) => [ins.id, ins]),
        )
        const pipelinesByConnId = R.pipe(
          await metaService.findPipelines({
            connectionIds: connections.map((c) => c.id),
          }),
          R.map((pipe) => ({
            ...pipe,
            syncInProgress:
              (pipe.lastSyncStartedAt && !pipe.lastSyncCompletedAt) ||
              (pipe.lastSyncStartedAt &&
                pipe.lastSyncCompletedAt &&
                pipe.lastSyncStartedAt > pipe.lastSyncCompletedAt),
          })),
          (pipes) =>
            R.mapToObj(connections, (c) => [
              c.id,
              pipes.filter(
                (p) => p.sourceId === c.id || p.destinationId === c.id,
              ),
            ]),
        )
        return connections.map((conn) => {
          const [, providerName, externalId] = splitPrefixedId(conn.id)
          const mappers = providerMap[providerName]?.standardMappers
          const standardConn = mappers?.connection(conn.settings)
          const standardIns = conn.institutionId
            ? mappers?.institution?.(insById[conn.institutionId]?.external)
            : undefined

          const pipes = pipelinesByConnId[conn.id] ?? []
          const syncInProgress = pipes.some((p) => p.syncInProgress)
          const lastSyncCompletedAt = R.maxBy(
            pipes,
            (p) => p.lastSyncCompletedAt?.getTime() ?? 0,
          )?.lastSyncCompletedAt

          console.log('map connection', {
            conn,
            standardConn,
            standardIns,
            syncInProgress,
            'pipelinesByConnId[conn.id]': pipelinesByConnId[conn.id],
          })

          return {
            ...zStandard.connection.omit({id: true}).parse(standardConn),
            id: conn.id,
            externalId,
            syncInProgress,
            lastSyncCompletedAt,
            institution: conn.institutionId
              ? {
                  ...zStandard.institution.omit({id: true}).parse(standardIns),
                  id: conn.institutionId,
                }
              : undefined,
          }
        })
      },
    ),

    // What about delete? Should this delete also? Or soft delete?

    /** Used for testing */
    // adminFireWebhook: zFunction(
    //   zConn,
    //   async ({settings, integration: {provider, config}}) => {

    //   },
    // ),

    deleteConnection: zFunction(
      [zConn, z.object({revokeOnly: z.boolean().nullish()}).optional()],
      async ({id, settings, integration: {provider, config}}, opts) => {
        await provider.revokeConnection?.(settings, config)
        if (opts?.revokeOnly) {
          return
        }
        await metaService.tables.connection.delete(id)
      },
    ),

    // MARK: - Sync

    adminSyncMetadata: zFunction(zInt.nullish(), async (int) => {
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
                          ),
                        },
                      },
                    }),
                }),
              ) ?? rxjs.EMPTY,
          ),
        ),
        // This single destination is a bottleneck to us removing
        // prefixed ids from protocol itself
        destination: metaLinks.persistInstitution(),
      })
      return `Synced ${stats} institutions from ${ints.length} providers`
    }),
    syncConnection: zFunction(
      [zConn, zSyncOptions.optional()],
      async function syncConnection(conn, opts) {
        console.log('[syncConnection]', conn, opts)
        /** Every ParsedConn also conforms to connectionInput  */
        const pipelines = await getPipelinesForConnection(conn)
        await Promise.all(pipelines.map((pipe) => _syncPipeline(pipe, opts)))
      },
    ),
    syncPipeline: zFunction(
      [zPipeline, zSyncOptions.optional()],
      async function syncPipeline(pipeline, opts) {
        console.log('[syncPipeline]', pipeline)
        return _syncPipeline(pipeline, opts)
      },
    ),
    // MARK: - Connect

    // SessionID would be awfully handy here...
    preConnect: zFunction(
      [zInt, zConnectContext],
      ({provider: p, config}, ctx) => p.preConnect?.(config, ctx),
    ),
    // useConnectHook happens client side only
    // for cli usage, can just call `postConnect` directly. Consider making the
    // flow a bit smoother with a guided cli flow
    postConnect: zFunction(
      // Questionable why `zConnectContext` should be there. Examine whether this is actually
      // needed
      [z.unknown(), zInt, zConnectContext],
      // How do we verify that the ledgerId here is the same as the ledgerId from preConnectOption?
      async (input, int, ctx) => {
        const {provider: p, config} = int
        console.log('didConnect start', p.name, input)
        if (!p.postConnect || !p.def.connectOutput) {
          return 'Noop'
        }
        const connUpdate = await p.postConnect(
          p.def.connectOutput.parse(input),
          config,
          ctx,
        )
        await _syncConnectionUpdate(int, {
          ...connUpdate,
          // No need for each integration to worry about this, unlike in the case of handleWebhook.
          ledgerId: ctx.ledgerId,
        })
        console.log('didConnect finish', p.name, input)
        return 'Connection Success'
      },
    ),
    handleWebhook: zFunction([zInt, zWebhookInput], async (int, input) => {
      if (!int.provider.def.webhookInput || !int.provider.handleWebhook) {
        console.warn(`${int.provider.name} does not handle webhooks`)
        return
      }
      const res = await int.provider.handleWebhook(
        int.provider.def.webhookInput.parse(input),
        int.config,
      )
      await Promise.all(
        res.connectionUpdates.map((connUpdate) =>
          _syncConnectionUpdate(int, connUpdate),
        ),
      )

      return res.response?.body
    }),
  }

  // TODO: Figure out how to decouple makeRouter from here once we can figure
  // out how the types work...
  const makeRouter = () => trpc.router()

  // This is a single function for now because we can't figure out how to type
  // makeLedgerSyncNextRouter separately
  const router = routerFromZFunctionMap(makeRouter(), syncEngine)

  // router.createCaller().query('connectionsget')
  return [syncEngine, router, metaService] as const
}

/** Only purpose of this is to support type inference */
makeSyncEngine.config = <
  TProviders extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>(
  config: SyncEngineConfig<TProviders, TLinks>,
) => config
