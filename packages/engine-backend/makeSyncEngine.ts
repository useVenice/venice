import type {inferRouterInputs, inferRouterOutputs} from '@trpc/server'
import {initTRPC, TRPCError} from '@trpc/server'

import type {
  AnyEntityPayload,
  AnySyncProvider,
  ConnectWith,
  Destination,
  Link,
  LinkFactory,
  MetaService,
  ResourceUpdate,
  Source,
  UserId,
} from '@usevenice/cdk-core'
import {zUserId} from '@usevenice/cdk-core'
import {
  extractId,
  handlersLink,
  makeId,
  sync,
  zCheckResourceOptions,
  zConnectOptions,
  zPostConnectOptions,
  zStandard,
  zWebhookInput,
} from '@usevenice/cdk-core'
import type {VeniceSourceState} from '@usevenice/cdk-ledger'
import {joinPath, R, rxjs, z} from '@usevenice/util'

import type {ParseJwtPayload, UserInfo} from './auth-utils'
import {makeJwtClient, _zContext} from './auth-utils'
import {inngest, zEvent} from './events'
import {makeMetaLinks} from './makeMetaLinks'
import type {
  IntegrationInput,
  ParsedInt,
  ParsedPipeline,
  PipelineInput,
  ResourceInput,
  ZInput,
} from './makeSyncParsers'
import {
  authorizeOrThrow,
  makeSyncParsers,
  zSyncOptions,
} from './makeSyncParsers'
import {parseWebhookRequest} from './parseWebhookRequest'
import {VeniceConnectJwtPayload} from './safeForFrontend'

export {type inferProcedureInput} from '@trpc/server'

/** TODO: Use OpenApiMeta from https://github.com/jlalmes/trpc-openapi */
export interface EngineMeta {}

type _inferInput<T> = T extends z.ZodTypeAny ? z.input<T> : never
export interface SyncEngineConfig<
  TProviders extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
> {
  providers: TProviders
  /**
   * Base url of the engine-backend router when deployed, e.g. `localhost:3000/api/usevenice`
   * This is needed for 1) server side rendering and 2) webhook handling
   */
  apiUrl: string

  /** Used for oauth based resources */
  getRedirectUrl?: (
    integration: ParsedInt,
    ctx: {userId?: UserId | null},
  ) => string

  parseJwtPayload?: ParseJwtPayload

  // Backend only
  linkMap?: TLinks

  /** Used for authentication */
  jwtSecretOrPublicKey?: string

  /** Used to store metadata */
  metaService: MetaService
  getLinksForPipeline?: (pipeline: ParsedPipeline) => Link[]

  getDefaultPipeline?: (
    connInput?: ResourceInput<TProviders[number]>,
    connectWith?: ConnectWith,
  ) => PipelineInput<TProviders[number], TProviders[number], TLinks>
  defaultIntegrations?:
    | Array<IntegrationInput<TProviders[number]>>
    | {
        [k in TProviders[number]['name']]?: _inferInput<
          Extract<TProviders[number], {name: k}>['def']['integrationConfig']
        >
      }
}

export type AnySyncRouter = ReturnType<typeof makeSyncEngine>['router']
export type AnySyncRouterInput = inferRouterInputs<AnySyncRouter>
export type AnySyncRouterOutput = inferRouterOutputs<AnySyncRouter>

export const trpcServer = initTRPC
  .context<UserInfo>()
  .meta<EngineMeta>()
  .create()

export const isAuthed = trpcServer.middleware(({next, ctx, path}) => {
  if (!ctx.userId && !ctx.isAdmin) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: `Auth required: ${path}`,
    })
  }
  // Figure out how we can pass the context into zod validators so that we can
  // check user has access to resource pipline etc in a single place...
  // Also we probably don't want non-admin user to be able to provider anything
  // other than the `id` for integration, resource and pipeline
  return next({ctx: {...ctx, userId: ctx.userId}})
})
export const isAdmin = trpcServer.middleware(({next, ctx, path}) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: `Admin only: ${path}`,
    })
  }
  return next({ctx: {...ctx, isAdmin: true as const}})
})
export const publicProcedure = trpcServer.procedure
export const authedProcedure = publicProcedure.use(isAuthed)
export const adminProcedure = publicProcedure.use(isAdmin)

// TODO: Figure out how to support both syncing on the command line via CLI without auth
// as well as syncing via API which has auth...
// Some methods require userId in context (preConnect / postConnect)
// while other methods (sometimes) does not require userId (syncResource)
// We should also be careful that during upserts we never change the `creatorId` and thus
// the permission structure...
const ADMIN_UID = 'admin' as UserId

export const makeSyncEngine = <
  TProviders extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>({
  metaService,
  providers,
  getDefaultPipeline,
  defaultIntegrations,
  getLinksForPipeline,
  jwtSecretOrPublicKey,
  parseJwtPayload,
  apiUrl,
  getRedirectUrl,
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
          config: config as any,
        }),
      )
  /** getDefaultIntegrations will need to change to getIntegrations(forWorkspace) later  */
  const {zInt, zReso, zPipeline} = makeSyncParsers({
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

  const getPipelinesForResource = (
    resoInput: ZInput['resource'],
    connectWith: ConnectWith | undefined,
  ) => {
    const defaultPipeline = () =>
      getDefaultPipeline?.(
        resoInput as ResourceInput<TProviders[number]>,
        connectWith,
      )

    // TODO: In the case of an existing `conn`, how do we update conn.settings too?
    // Otherwise we will result in outdated settings...
    return metaService
      .findPipelines({resourceIds: [resoInput.id]})
      .then((pipes) => (pipes.length ? pipes : R.compact([defaultPipeline()])))
      .then((pipes) => Promise.all(pipes.map((p) => zPipeline.parseAsync(p))))
  }

  const _syncResourceUpdate = async (
    int: ParsedInt,
    {
      userId,
      envName,
      settings,
      institution,
      ...resoUpdate
    }: ResourceUpdate<AnyEntityPayload, {}>,
  ) => {
    console.log('[_syncResourceUpdate]', int.id, {
      userId,
      envName,
      settings,
      institution,
      ...resoUpdate,
    })
    const id = makeId('reso', int.provider.name, resoUpdate.resourceExternalId)
    await metaLinks
      .handlers({
        resource: {id, integrationId: int.id, creatorId: userId, envName},
      })
      .resoUpdate({type: 'resoUpdate', id, settings, institution})

    // TODO: This should be happening async
    if (!resoUpdate.source$ && !resoUpdate.triggerDefaultSync) {
      console.log(
        '[_syncResourceUpdate] Returning early skip syncing pipelines',
      )
      return id
    }

    const pipelines = await getPipelinesForResource(
      {
        id,
        // Should we spread resoUpdate into it?
        settings,
        creatorId: userId,
        // institution: resoUpdate.institution,
      },
      resoUpdate.connectWith ?? undefined,
    )

    console.log('_syncResourceUpdate existingPipes.len', pipelines.length)
    await Promise.all(
      pipelines.map(async (pipe) => {
        await _syncPipeline(pipe, {
          source$: resoUpdate.source$,
          source$ConcatDefault: resoUpdate.triggerDefaultSync,
        })
      }),
    )
    return id
  }

  const _syncPipeline = async (
    pipeline: ParsedPipeline,
    opts: z.infer<typeof zSyncOptions> & {
      source$?: Source<AnyEntityPayload>
      /**
       * Trigger the default sourceSync after source$ exhausts
       * TODO: #inngestMe This is where we can fire off a request to syncPipeline so it happens async
       */
      source$ConcatDefault?: boolean
      destination$$?: Destination
    } = {},
  ) => {
    console.log('[syncPipeline]', pipeline)
    const {source: src, links, destination: dest, watch, ...pipe} = pipeline

    const defaultSource$ = () =>
      src.integration.provider.sourceSync?.({
        id: src.id,
        config: src.integration.config,
        settings: src.settings,
        // Maybe we should rename `options` to `state`?
        // Should also make the distinction between `config`, `settings` and `state` much more clear.
        // Undefined causes crash in Plaid provider due to destructuring, Think about how to fix it for reals
        state: opts.fullResync ? {} : pipe.sourceState,
      })

    const source$ = opts.source$
      ? opts.source$ConcatDefault
        ? rxjs.concat(opts.source$, defaultSource$() ?? rxjs.EMPTY)
        : opts.source$
      : defaultSource$()

    const destination$$ =
      opts.destination$$ ??
      dest.integration.provider.destinationSync?.({
        id: dest.id,
        config: dest.integration.config,
        settings: dest.settings,
        // Undefined causes crash in Plaid provider due to destructuring, Think about how to fix it for reals
        state: opts.fullResync ? {} : pipe.destinationState,
      })

    if (!source$) {
      throw new Error(`${src.integration.provider.name} missing source`)
    }
    if (!destination$$) {
      throw new Error(`${dest.integration.provider.name} missing destination`)
    }
    await metaLinks
      .handlers({pipeline})
      .stateUpdate({type: 'stateUpdate', subtype: 'init'})
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
      metaLinks
        .handlers({pipeline})
        .stateUpdate({type: 'stateUpdate', subtype: 'complete'}),
    )
  }

  const router = trpcServer.router({
    health: publicProcedure.query(() => 'Ok ' + new Date().toISOString()),
    handleWebhook: publicProcedure
      .input(z.tuple([zInt, zWebhookInput]))
      .mutation(async ({input: [int, input]}) => {
        if (!int.provider.def.webhookInput || !int.provider.handleWebhook) {
          console.warn(`${int.provider.name} does not handle webhooks`)
          return
        }
        const res = await int.provider.handleWebhook(
          int.provider.def.webhookInput.parse(input),
          int.config,
        )
        await Promise.all(
          res.resourceUpdates.map((resoUpdate) =>
            // Provider is responsible for providing envName / userId
            // TODO: Should provider be responsible for providing connectWith?
            // This may be relevant for OneBrick resources for example
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            _syncResourceUpdate(int, resoUpdate),
          ),
        )

        return res.response?.body
      }),
    dispatch: authedProcedure.input(zEvent).mutation(async ({input, ctx}) => {
      if (
        input.name !== 'sync/resource-requested' &&
        input.name !== 'sync/pipeline-requested'
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Event name not supported ${input.name}`,
        })
      }
      await inngest.send(input.name, {data: input.data, user: {id: ctx.userId}})
    }),
    listConnections: authedProcedure
      .input(z.object({}).optional())
      .query(async ({ctx}) => {
        // Add info about what it takes to `reconnect` here for resources which
        // has disconnected
        const resources = await metaService.tables.resource.list({
          creatorId: ctx.userId,
        })
        const [institutions, _pipelines] = await Promise.all([
          metaService.tables.institution.list({
            ids: R.compact(resources.map((c) => c.institutionId)),
          }),
          metaService.findPipelines({
            resourceIds: resources.map((c) => c.id),
          }),
        ])
        type ConnType = 'source' | 'destination'

        const insById = R.mapToObj(institutions, (ins) => [ins.id, ins])

        function parseResource(reso?: (typeof resources)[number] | null) {
          if (!reso) {
            return reso
          }
          const providerName = extractId(reso.id)[1]
          const institution = insById[reso.institutionId!]
          const mappers = providerMap[providerName]?.standardMappers
          const standardReso = zStandard.resource
            .omit({id: true})
            .nullish()
            .parse(mappers?.resource?.(reso.settings))
          const standardIns = zStandard.institution
            .omit({id: true})
            .nullish()
            .parse(institution && mappers?.institution?.(institution?.external))

          return {
            ...reso,
            ...standardReso,
            id: reso.id,
            displayName:
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              reso.displayName ||
              standardReso?.displayName ||
              standardIns?.name ||
              '',
            institution:
              standardIns && institution
                ? {...standardIns, id: institution.id}
                : null,
          }
        }
        const pipelines = _pipelines.map((pipe) => ({
          ...pipe,
          syncInProgress:
            (pipe.lastSyncStartedAt && !pipe.lastSyncCompletedAt) ||
            (pipe.lastSyncStartedAt &&
              pipe.lastSyncCompletedAt &&
              pipe.lastSyncStartedAt > pipe.lastSyncCompletedAt),
        }))
        return resources
          .map(parseResource)
          .filter((r): r is NonNullable<typeof r> => !!r)
          .map((r) => {
            const pipesOut = pipelines.filter((p) => p.sourceId === r.id)
            const pipesIn = pipelines.filter((p) => p.destinationId === r.id)
            const pipes = [...pipesOut, ...pipesIn]
            // TODO: Look up based on provider name
            const type: ConnType | null = r.id.startsWith('reso_postgres')
              ? 'destination'
              : 'source'
            return {
              ...r,
              syncInProgress: pipes.some((p) => p.syncInProgress),
              type,
              // TODO: Fix me
              lastSyncCompletedAt: pipes.find((p) => p.lastSyncCompletedAt)
                ?.lastSyncCompletedAt,
            }
          })
      }),
    listPipelines: authedProcedure
      .input(z.object({}).optional())
      .query(async ({ctx}) => {
        // Add info about what it takes to `reconnect` here for resources which
        // has disconnected
        const resources = await metaService.tables.resource.list({
          creatorId: ctx.userId,
        })
        const [institutions, pipelines] = await Promise.all([
          metaService.tables.institution.list({
            ids: R.compact(resources.map((c) => c.institutionId)),
          }),
          metaService.findPipelines({
            resourceIds: resources.map((c) => c.id),
          }),
        ])
        type ConnType = 'source' | 'destination'

        const insById = R.mapToObj(institutions, (ins) => [ins.id, ins])
        const resoById = R.mapToObj(resources, (ins) => [ins.id, ins])

        function parseResource(reso?: (typeof resources)[number] | null) {
          if (!reso) {
            return reso
          }
          const providerName = extractId(reso.id)[1]
          const institution = insById[reso.institutionId!]
          const mappers = providerMap[providerName]?.standardMappers
          const standardReso = zStandard.resource
            .omit({id: true})
            .nullish()
            .parse(mappers?.resource?.(reso.settings))
          const standardIns = zStandard.institution
            .omit({id: true})
            .nullish()
            .parse(institution && mappers?.institution?.(institution?.external))

          return {
            ...reso,
            ...standardReso,
            id: reso.id,
            displayName:
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              reso.displayName ||
              standardReso?.displayName ||
              standardIns?.name ||
              '',
            institution:
              standardIns && institution
                ? {...standardIns, id: institution.id}
                : null,
          }
        }

        return pipelines.map(({sourceId, destinationId, ...pipe}) => ({
          ...pipe,
          syncInProgress:
            (pipe.lastSyncStartedAt && !pipe.lastSyncCompletedAt) ||
            (pipe.lastSyncStartedAt &&
              pipe.lastSyncCompletedAt &&
              pipe.lastSyncStartedAt > pipe.lastSyncCompletedAt),

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          source: parseResource(resoById[sourceId!])!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          destination: parseResource(resoById[destinationId!])!,
        }))
      }),
    listIntegrations: authedProcedure
      .input(z.object({type: z.enum(['source', 'destination']).nullish()}))
      .query(async ({input: {type}}) => {
        const ints = await getDefaultIntegrations()
        return ints
          .map((int) => ({
            id: int.id,
            providerName: int.provider.name,
            isSource: !!int.provider.sourceSync,
            isDestination: !!int.provider.destinationSync,
          }))
          .filter(
            (int) =>
              !type ||
              (type === 'source' && int.isSource) ||
              (type === 'destination' && int.isDestination),
          )
      }),
    // Implement this directly via supabase?
    searchInstitutions: authedProcedure
      .input(z.object({keywords: z.string().trim().nullish()}).optional())
      .query(async ({input: {keywords} = {}}) => {
        const ints = await getDefaultIntegrations()
        const institutions = await metaService.searchInstitutions({
          keywords,
          limit: 10,
          providerNames: R.uniq(ints.map((int) => int.provider.name)),
        })
        const intsByProviderName = R.groupBy(ints, (int) => int.provider.name)
        return institutions.flatMap((ins) => {
          const [, providerName, externalId] = extractId(ins.id)
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
      }),
    // TODO: Do we need this method at all? Or should we simply add params to args
    // to syncResource instead? For example, skipPipelines?
    checkResource: authedProcedure
      .meta({
        description: 'Not automatically called, used for debugging for now',
      })
      .input(z.tuple([zReso, zCheckResourceOptions.optional()]))
      .mutation(
        async ({input: [{settings, integration: int, ...reso}, opts], ctx}) => {
          authorizeOrThrow(ctx, 'resource', reso)
          // console.log('checkResource', {settings, integration, ...conn}, opts)
          const resoUpdate = await int.provider.checkResource?.({
            settings,
            config: int.config,
            options: opts ?? {},
            context: {
              webhookBaseUrl: joinPath(
                apiUrl,
                parseWebhookRequest.pathOf(int.id),
              ),
            },
          })
          if (resoUpdate || opts?.import) {
            /** Do not update the `creatorId` here... */
            await _syncResourceUpdate(int, {
              ...(opts?.import && {
                userId: reso.creatorId ?? undefined,
                envName: reso.envName ?? undefined,
              }),
              ...resoUpdate,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              settings: {
                ...(opts?.import && settings),
                ...resoUpdate?.settings,
              },
              resourceExternalId:
                resoUpdate?.resourceExternalId ?? extractId(reso.id)[2],
              connectWith: opts?.connectWith,
            })
          }
          if (!int.provider.checkResource) {
            return `Not implemented in ${int.provider.name}`
          }
          return 'Ok'
        },
      ),
    // What about delete? Should this delete also? Or soft delete?
    deleteResource: authedProcedure
      .input(
        z.tuple([
          zReso,
          z
            .object({
              skipRevoke: z.boolean().nullish(),
              todo_deleteAssociatedData: z.boolean().nullish(),
            })
            .optional(),
        ]),
      )
      .mutation(
        async ({input: [{settings, integration, ...reso}, opts], ctx}) => {
          authorizeOrThrow(ctx, 'resource', reso)
          if (!opts?.skipRevoke) {
            await integration.provider.revokeResource?.(
              settings,
              integration.config,
            )
          }
          if (opts?.todo_deleteAssociatedData) {
            // TODO: Figure out how to delete... Destination is not part of meta service
            // and we don't easily have the ability to handle a delete, it's not part of the sync protocol yet...
            // We should probably introduce a reset / delete event...
          }
          await metaService.tables.resource.delete(reso.id)
        },
      ),

    // MARK: - Connect
    preConnect: authedProcedure
      .input(z.tuple([zInt, zConnectOptions, z.unknown()]))
      // Consider using sessionId, so preConnect corresponds 1:1 with postConnect
      .query(
        async ({
          input: [int, {resourceExternalId, ...connCtxInput}, preConnInput],
          ctx,
        }) => {
          const reso = resourceExternalId
            ? await metaService.tables.resource
                .get(makeId('reso', int.provider.name, resourceExternalId))
                .then((input) => zReso.parseAsync(input))
            : undefined
          authorizeOrThrow(ctx, 'resource', reso)
          return int.provider.preConnect?.(
            int.config,
            {
              ...connCtxInput,
              userId: ctx.userId ?? ADMIN_UID,
              resource: reso
                ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  {externalId: resourceExternalId!, settings: reso.settings}
                : undefined,
              webhookBaseUrl: joinPath(
                apiUrl,
                parseWebhookRequest.pathOf(int.id),
              ),
              redirectUrl: getRedirectUrl?.(int, ctx),
            },
            preConnInput,
          )
        },
      ),
    // useConnectHook happens client side only
    // for cli usage, can just call `postConnect` directly. Consider making the
    // flow a bit smoother with a guided cli flow
    postConnect: authedProcedure
      .input(z.tuple([z.unknown(), zInt, zPostConnectOptions]))
      // Questionable why `zConnectContextInput` should be there. Examine whether this is actually
      // needed
      // How do we verify that the userId here is the same as the userId from preConnectOption?

      .mutation(
        async ({
          input: [input, int, {resourceExternalId, ...connCtxInput}],
          ctx,
        }) => {
          console.log(
            'didConnect start',
            int.provider.name,
            input,
            connCtxInput,
          )
          if (!int.provider.postConnect || !int.provider.def.connectOutput) {
            return 'Noop'
          }
          const reso = resourceExternalId
            ? await metaService.tables.resource
                .get(makeId('reso', int.provider.name, resourceExternalId))
                .then((input) => zReso.parseAsync(input))
            : undefined
          authorizeOrThrow(ctx, 'resource', reso)

          const resoUpdate = await int.provider.postConnect(
            int.provider.def.connectOutput.parse(input),
            int.config,
            {
              ...connCtxInput,
              userId: ctx.userId ?? ADMIN_UID,
              resource: reso
                ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  {externalId: resourceExternalId!, settings: reso.settings}
                : undefined,
              webhookBaseUrl: joinPath(
                apiUrl,
                parseWebhookRequest.pathOf(int.id),
              ),
              redirectUrl: getRedirectUrl?.(int, ctx),
            },
          )

          const syncInBackground =
            resoUpdate.triggerDefaultSync && !connCtxInput.syncInBand

          const resourceId = await _syncResourceUpdate(int, {
            ...resoUpdate,
            // No need for each integration to worry about this, unlike in the case of handleWebhook.
            userId: ctx.userId ?? ADMIN_UID,
            envName: connCtxInput.envName,
            connectWith: connCtxInput.connectWith,
            triggerDefaultSync:
              !syncInBackground && resoUpdate.triggerDefaultSync,
          })
          if (syncInBackground) {
            await inngest.send('sync/resource-requested', {data: {resourceId}})
          }
          console.log('didConnect finish', int.provider.name, input)
          return 'Resource successfully connected'
        },
      ),
    // MARK: - Sync

    syncResource: authedProcedure
      .input(z.tuple([zReso, zSyncOptions.optional()]))
      .mutation(async function syncResource({input: [reso, opts], ctx}) {
        authorizeOrThrow(ctx, 'resource', reso)
        console.log('[syncResource]', reso, opts)
        // No need to checkResource here as sourceSync should take care of it

        if (opts?.metaOnly) {
          await sync({
            source:
              reso.integration.provider.sourceSync?.({
                id: reso.id,
                config: reso.integration.config,
                settings: reso.settings,
                // Maybe we should rename `options` to `state`?
                // Should also make the distinction between `config`, `settings` and `state` much more clear.
                // Undefined causes crash in Plaid provider due to destructuring, Think about how to fix it for reals
                state: R.identity<VeniceSourceState>({
                  streams: ['resource', 'institution'],
                }),
              }) ?? rxjs.EMPTY,
            destination: metaLinks.postSource({src: reso}),
          })
          return
        }

        // TODO: Figure how to handle situations where resource does not exist yet
        // but pipeline is already being persisted properly. This current solution
        // is vulnerable to race condition and feels brittle. Though syncResource is only
        // called from the UI so we are fine for now.
        await _syncResourceUpdate(reso.integration, {
          userId: ctx.userId,
          settings: reso.settings,
          // What about envName
          resourceExternalId: extractId(reso.id)[2],
          institution: reso.institution && {
            externalId: extractId(reso.institution.id)[2],
            data: reso.institution.external ?? {},
          },
          connectWith: opts?.connectWith,
          triggerDefaultSync: true,
        })
      }),
    syncPipeline: authedProcedure
      .input(z.tuple([zPipeline, zSyncOptions.optional()]))
      .mutation(async function syncPipeline({input: [pipeline, opts], ctx}) {
        console.log('[syncPipeline]', pipeline)
        authorizeOrThrow(ctx, 'pipeline', pipeline)
        return _syncPipeline(pipeline, opts)
      }),

    // Admin procedures...
    adminCreateConnectToken: adminProcedure
      .input(z.object({userId: zUserId}))
      .mutation(({input: {userId}}) => {
        if (!jwtClient) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'JWT secret not set',
          })
        }
        // TODO: Handle having jwtPublicKey rather than secret
        return jwtClient.sign({
          sub: userId,
          exp: Math.floor(Date.now() / 1000) + 3600,
          role: 'authenticated',
        } satisfies VeniceConnectJwtPayload)
      }),
    adminSearchCreatorIds: adminProcedure
      .input(z.object({keywords: z.string().trim().nullish()}).optional())
      .query(async ({input: {keywords} = {}}) =>
        metaService.searchCreatorIds({keywords}),
      ),
    adminGetIntegration: adminProcedure.input(zInt).query(({input: int}) => ({
      config: int.config,
      provider: int.provider.name,
      id: int.id,
    })),
    adminSyncMetadata: adminProcedure
      .input(zInt.nullish())
      .mutation(async ({input: int}) => {
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
                            external: op.data.entity as unknown,
                            standard:
                              int.provider.standardMappers?.institution?.(
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
  })

  const jwtClient = jwtSecretOrPublicKey
    ? makeJwtClient({secretOrPublicKey: jwtSecretOrPublicKey})
    : undefined

  const zContext = _zContext({
    parseJwtToken: jwtClient ? jwtClient.verify : undefined,
    parseJwtPayload,
  })

  // Improve the error generated by zod
  // TODO: Move me into a generic location...
  // for (const key of ['queries', 'mutations', 'subscriptions'] as const) {
  //   for (const [name, val] of Object.entries(router._def[key])) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     const inputParser: unknown = val.inputParser
  //     if (isZodType(inputParser)) {
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //       val.parseInputFn = zParser(
  //         inputParser.describe(`${key}.${name}.input`),
  //       ).parseAsync
  //     }
  //   }
  // }

  return {router, jwtClient, zContext}
}

/** Only purpose of this is to support type inference */
makeSyncEngine.config = <
  TProviders extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>(
  config: SyncEngineConfig<TProviders, TLinks>,
) => config
