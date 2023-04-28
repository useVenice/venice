import {zEvent} from '../events'
import {protectedProcedure, trpc} from './_base'

import {TRPCError} from '@trpc/server'

import {
  extractId,
  sync,
  zCheckResourceOptions,
  zId,
  zStandard,
} from '@usevenice/cdk-core'
import type {VeniceSourceState} from '@usevenice/cdk-ledger'
import {R, joinPath, rxjs, z} from '@usevenice/util'

import {inngest} from '../events'
import {parseWebhookRequest} from '../parseWebhookRequest'
import {zSyncOptions} from '../types'

export {type inferProcedureInput} from '@trpc/server'

export const protectedRouter = trpc.router({
  dispatch: protectedProcedure.input(zEvent).mutation(async ({input, ctx}) => {
    if (
      input.name !== 'sync/resource-requested' &&
      input.name !== 'sync/pipeline-requested'
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Event name not supported ${input.name}`,
      })
    }
    // not sure what `viewer` is quite for here...
    await inngest.send(input.name, {data: input.data, user: ctx.viewer})
  }),
  listConnections: protectedProcedure
    .input(z.object({}).optional())
    .query(async ({ctx}) => {
      // Add info about what it takes to `reconnect` here for resources which
      // has disconnected
      const resources = await ctx.helpers.metaService.tables.resource.list({})
      const [institutions, _pipelines] = await Promise.all([
        ctx.helpers.metaService.tables.institution.list({
          ids: R.compact(resources.map((c) => c.institutionId)),
        }),
        ctx.helpers.metaService.findPipelines({
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
        const mappers = ctx.providerMap[providerName]?.standardMappers
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
  listPipelines: protectedProcedure
    .input(z.object({}).optional())
    .query(async ({ctx}) => {
      // Add info about what it takes to `reconnect` here for resources which
      // has disconnected
      const resources = await ctx.helpers.metaService.tables.resource.list({})
      const [institutions, pipelines] = await Promise.all([
        ctx.helpers.metaService.tables.institution.list({
          ids: R.compact(resources.map((c) => c.institutionId)),
        }),
        ctx.helpers.metaService.findPipelines({
          resourceIds: resources.map((c) => c.id),
        }),
      ])

      const insById = R.mapToObj(institutions, (ins) => [ins.id, ins])
      const resoById = R.mapToObj(resources, (ins) => [ins.id, ins])

      function parseResource(reso?: (typeof resources)[number] | null) {
        if (!reso) {
          return reso
        }
        const providerName = extractId(reso.id)[1]
        const institution = insById[reso.institutionId!]
        const mappers = ctx.providerMap[providerName]?.standardMappers
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
          providerName,
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

      return R.sortBy(pipelines, [
        (p) => p.lastSyncCompletedAt ?? '',
        'desc',
      ]).map(({sourceId, destinationId, ...pipe}) => ({
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
  listIntegrationInfos: protectedProcedure
    .input(z.object({type: z.enum(['source', 'destination']).nullish()}))
    .query(async ({input: {type}, ctx}) => {
      const intIds = await ctx.helpers.metaService.listIntegrationIds()
      return intIds
        .map((id) => {
          const provider = ctx.providerMap[extractId(id)[1]]
          return provider
            ? {
                id,
                providerName: provider.name,
                isSource: !!provider.sourceSync,
                isDestination: !!provider.destinationSync,
              }
            : null
        })
        .filter((int): int is NonNullable<typeof int> =>
          Boolean(
            int &&
              (!type ||
                (type === 'source' && int.isSource) ||
                (type === 'destination' && int.isDestination)),
          ),
        )
    }),
  searchInstitutions: protectedProcedure
    .input(z.object({keywords: z.string().trim().nullish()}).optional())
    .query(async ({input: {keywords} = {}, ctx}) => {
      const ints = await ctx.helpers.listIntegrations()
      const institutions = await ctx.helpers.metaService.searchInstitutions({
        keywords,
        limit: 10,
        providerNames: R.uniq(ints.map((int) => int.provider.name)),
      })
      const intsByProviderName = R.groupBy(ints, (int) => int.provider.name)
      return institutions.flatMap((ins) => {
        const [, providerName, externalId] = extractId(ins.id)
        const standard = ctx.providerMap[
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
  getResource: protectedProcedure
    .meta({
      description: 'Not automatically called, used for debugging for now',
    })
    .input(z.object({id: zId('reso')}))
    .query(async ({input, ctx}) => {
      const reso = await ctx.helpers.getResourceExpandedOrFail(input.id)
      return reso
    }),
  checkResource: protectedProcedure
    .meta({
      description: 'Not automatically called, used for debugging for now',
    })
    .input(z.tuple([zId('reso'), zCheckResourceOptions.optional()]))
    .mutation(async ({input: [resoId, opts], ctx}) => {
      if (ctx.viewer.role === 'end_user') {
        await ctx.helpers.getResourceOrFail(resoId)
      }
      const {
        settings,
        integration: int,
        ...reso
      } = await ctx.asWorkspaceIfNeeded.getResourceExpandedOrFail(resoId)
      // console.log('checkResource', {settings, integration, ...conn}, opts)
      const resoUpdate = await int.provider.checkResource?.({
        settings,
        config: int.config,
        options: opts ?? {},
        context: {
          webhookBaseUrl: joinPath(
            ctx.apiUrl,
            parseWebhookRequest.pathOf(int.id),
          ),
        },
      })
      if (resoUpdate || opts?.import) {
        /** Do not update the `endUserId` here... */
        await ctx.asWorkspaceIfNeeded._syncResourceUpdate(int, {
          ...(opts?.import && {
            endUserId: reso.endUserId ?? undefined,
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
        })
      }
      if (!int.provider.checkResource) {
        return `Not implemented in ${int.provider.name}`
      }
      return 'Ok'
    }),
  // What about delete? Should this delete also? Or soft delete?
  deleteResource: protectedProcedure
    .input(
      z.tuple([
        zId('reso'),
        z
          .object({
            skipRevoke: z.boolean().nullish(),
            todo_deleteAssociatedData: z.boolean().nullish(),
          })
          .optional(),
      ]),
    )
    .mutation(async ({input: [resoId, opts], ctx}) => {
      if (ctx.viewer.role === 'end_user') {
        await ctx.helpers.getResourceOrFail(resoId)
      }
      const {settings, integration, ...reso} =
        await ctx.asWorkspaceIfNeeded.getResourceExpandedOrFail(resoId)
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
      await ctx.asWorkspaceIfNeeded.metaService.tables.resource.delete(reso.id)
    }),

  // MARK: - Sync

  syncResource: protectedProcedure
    .input(z.tuple([zId('reso'), zSyncOptions.optional()]))
    .mutation(async function syncResource({input: [resoId, opts], ctx}) {
      if (ctx.viewer.role === 'end_user') {
        await ctx.helpers.getResourceOrFail(resoId)
      }
      const reso = await ctx.asWorkspaceIfNeeded.getResourceExpandedOrFail(
        resoId,
      )
      console.log('[syncResource]', reso, opts)
      // No need to checkResource here as sourceSync should take care of it

      if (opts?.metaOnly) {
        await sync({
          source:
            reso.integration.provider.sourceSync?.({
              config: reso.integration.config,
              settings: reso.settings,
              endUser: reso.endUserId && {id: reso.endUserId},
              // Maybe we should rename `options` to `state`?
              // Should also make the distinction between `config`, `settings` and `state` much more clear.
              // Undefined causes crash in Plaid provider due to destructuring, Think about how to fix it for reals
              state: R.identity<VeniceSourceState>({
                streams: ['resource', 'institution'],
              }),
            }) ?? rxjs.EMPTY,
          destination: ctx.asWorkspaceIfNeeded.metaLinks.postSource({
            src: reso,
          }),
        })
        return
      }

      // TODO: Figure how to handle situations where resource does not exist yet
      // but pipeline is already being persisted properly. This current solution
      // is vulnerable to race condition and feels brittle. Though syncResource is only
      // called from the UI so we are fine for now.
      await ctx.asWorkspaceIfNeeded._syncResourceUpdate(reso.integration, {
        endUserId: reso.endUserId,
        settings: reso.settings,
        // What about envName
        resourceExternalId: extractId(reso.id)[2],
        institution: reso.institution && {
          externalId: extractId(reso.institution.id)[2],
          data: reso.institution.external ?? {},
        },
        triggerDefaultSync: true,
      })
    }),
  syncPipeline: protectedProcedure
    .input(z.tuple([zId('pipe'), zSyncOptions.optional()]))
    .mutation(async function syncPipeline({input: [pipeId, opts], ctx}) {
      if (ctx.viewer.role === 'end_user') {
        await ctx.helpers.getPipelineOrFail(pipeId) // Authorization
      }
      const pipeline = await ctx.asWorkspaceIfNeeded.getPipelineExpandedOrFail(
        pipeId,
      )
      console.log('[syncPipeline]', pipeline)
      return ctx.helpers._syncPipeline(pipeline, opts)
    }),
})
