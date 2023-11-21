import {TRPCError} from '@trpc/server'

import type {ZRaw} from '@usevenice/cdk'
import {zEndUserId} from '@usevenice/cdk'
import {
  extractId,
  sync,
  zCheckResourceOptions,
  zId,
  zRaw,
  zStandard,
} from '@usevenice/cdk'
import type {VeniceSourceState} from '@usevenice/cdk'
import {joinPath, R, rxjs, z} from '@usevenice/util'

import {inngest, zEvent} from '../events'
import {parseWebhookRequest} from '../parseWebhookRequest'
import {zSyncOptions} from '../types'
import {protectedProcedure, trpc} from './_base'
import {zListParams} from './_schemas'

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
  listResources: protectedProcedure
    .meta({openapi: {method: 'GET', path: '/resources'}})
    .input(
      zListParams
        .extend({
          endUserId: zEndUserId.nullish(),
          connectorConfigId: zId('ccfg').nullish(),
          connectorName: z.string().nullish(),
        })
        .optional(),
    )
    .output(z.array(zRaw.resource))
    .query(async ({input = {}, ctx}) => {
      const resources = await ctx.services.metaService.tables.resource.list(
        input,
      )
      return resources as Array<ZRaw['resource']>
    }),
  listPipelines: protectedProcedure
    .meta({openapi: {method: 'GET', path: '/pipelines'}})
    .input(
      zListParams
        .extend({resourceIds: z.array(zId('reso')).optional()})
        .optional(),
    )
    .output(z.array(zRaw.pipeline))
    .query(async ({input = {}, ctx}) => {
      const pipelines = await ctx.services.metaService.findPipelines(input)
      return pipelines as Array<ZRaw['pipeline']>
    }),
  deletePipeline: protectedProcedure
    .meta({openapi: {method: 'DELETE', path: '/pipelines/{id}'}})
    .input(z.object({id: zId('pipe')}))
    .output(z.literal(true))
    .mutation(async ({ctx, input}) => {
      await ctx.services.metaService.tables.pipeline.delete(input.id)
      return true as const
    }),
  listConnections: protectedProcedure
    .input(zListParams.extend({endUserId: zEndUserId.optional()}).optional())
    .query(async ({input = {}, ctx}) => {
      // Add info about what it takes to `reconnect` here for resources which
      // has disconnected
      const resources = await ctx.services.metaService.tables.resource.list(
        input,
      )
      const [integrations, _pipelines] = await Promise.all([
        ctx.services.metaService.tables.integration.list({
          ids: R.compact(resources.map((c) => c.integrationId)),
        }),
        ctx.services.metaService.findPipelines({
          resourceIds: resources.map((c) => c.id),
        }),
      ])
      type ConnType = 'source' | 'destination'

      const intById = R.mapToObj(integrations, (ins) => [ins.id, ins])

      function parseResource(reso?: (typeof resources)[number] | null) {
        if (!reso) {
          return reso
        }
        const connectorName = extractId(reso.id)[1]
        const integrations = intById[reso.integrationId!]
        const mappers = ctx.connectorMap[connectorName]?.standardMappers
        const standardReso = zStandard.resource
          .omit({id: true})
          .nullish()
          .parse(mappers?.resource?.(reso.settings))
        const standardInt = zStandard.integration
          .omit({id: true})
          .nullish()
          .parse(integrations && mappers?.integration?.(integrations?.external))

        return {
          ...reso,
          ...standardReso,
          id: reso.id,
          displayName:
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            reso.displayName ||
            standardReso?.displayName ||
            standardInt?.name ||
            '',
          integration:
            standardInt && integrations
              ? {...standardInt, id: integrations.id}
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
  listConnectorConfigInfos: protectedProcedure
    .meta({openapi: {method: 'GET', path: '/connector_config_infos'}})
    .input(
      z.object({
        type: z.enum(['source', 'destination']).nullish(),
        id: zId('ccfg').nullish(),
        connectorName: z.string().nullish(),
      }),
    )
    .output(
      z.array(
        zRaw.connector_config
          .pick({
            id: true,
            envName: true,
            displayName: true,
            connectorName: true,
          })
          .extend({
            isSource: z.boolean(),
            isDestination: z.boolean(),
          }),
      ),
    )
    .query(async ({input: {type, id, connectorName}, ctx}) => {
      const intInfos = await ctx.services.metaService.listConnectorConfigInfos({
        id,
        connectorName,
      })

      return intInfos
        .map(({id, envName, displayName}) => {
          const connector = ctx.connectorMap[extractId(id)[1]]
          return connector
            ? {
                id,
                envName,
                displayName,
                connectorName: connector.name,
                isSource: !!connector.sourceSync,
                isDestination: !!connector.destinationSync,
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
  searchIntegrations: protectedProcedure
    .input(z.object({keywords: z.string().trim().nullish()}).optional())
    .query(async ({input: {keywords} = {}, ctx}) => {
      const ints = await ctx.services.listConnectorConfigs()
      const integrations = await ctx.services.metaService.searchIntegrations({
        keywords,
        limit: 10,
        connectorNames: R.uniq(ints.map((int) => int.connector.name)),
      })
      const intsByConnectorName = R.groupBy(ints, (int) => int.connector.name)
      return integrations.flatMap((ins) => {
        const [, connectorName, externalId] = extractId(ins.id)
        const standard = ctx.connectorMap[
          connectorName
        ]?.standardMappers?.integration?.(ins.external)
        const res = zStandard.integration.omit({id: true}).safeParse(standard)

        if (!res.success) {
          console.error('Invalid integration found', ins, res.error)
          return []
        }
        return (intsByConnectorName[connectorName] ?? []).map((int) => ({
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
      openapi: {method: 'GET', path: '/resources/{id}'},
    })
    .input(z.object({id: zId('reso')}))
    .output(zRaw.resource) // TODO: This is actually expanded...
    .query(async ({input, ctx}) => {
      const reso = await ctx.services.getResourceExpandedOrFail(input.id)
      return reso
    }),
  checkResource: protectedProcedure
    .meta({
      description: 'Not automatically called, used for debugging for now',
    })
    .input(z.tuple([zId('reso'), zCheckResourceOptions.optional()]))
    .mutation(async ({input: [resoId, opts], ctx}) => {
      if (ctx.viewer.role === 'end_user') {
        await ctx.services.getResourceOrFail(resoId)
      }
      const {
        settings,
        connectorConfig: int,
        ...reso
      } = await ctx.asOrgIfNeeded.getResourceExpandedOrFail(resoId)
      // console.log('checkResource', {settings, connectorConfig, ...conn}, opts)
      const resoUpdate = await int.connector.checkResource?.({
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
        await ctx.asOrgIfNeeded._syncResourceUpdate(int, {
          ...(opts?.import && {
            endUserId: reso.endUserId ?? undefined,
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
      if (!int.connector.checkResource) {
        return `Not implemented in ${int.connector.name}`
      }
      return 'Ok'
    }),
  // MARK: - Sync

  syncResource: protectedProcedure
    .input(z.tuple([zId('reso'), zSyncOptions.optional()]))
    .mutation(async function syncResource({input: [resoId, opts], ctx}) {
      if (ctx.viewer.role === 'end_user') {
        await ctx.services.getResourceOrFail(resoId)
      }
      const reso = await ctx.asOrgIfNeeded.getResourceExpandedOrFail(resoId)
      console.log('[syncResource]', reso, opts)
      // No need to checkResource here as sourceSync should take care of it

      if (opts?.metaOnly) {
        await sync({
          source:
            reso.connectorConfig.connector.sourceSync?.({
              config: reso.connectorConfig.config,
              settings: reso.settings,
              endUser: reso.endUserId && {id: reso.endUserId},
              // Maybe we should rename `options` to `state`?
              // Should also make the distinction between `config`, `settings` and `state` much more clear.
              // Undefined causes crash in Plaid provider due to destructuring, Think about how to fix it for reals
              state: R.identity<VeniceSourceState>({
                streams: ['resource', 'integration'],
              }),
            }) ?? rxjs.EMPTY,
          destination: ctx.asOrgIfNeeded.metaLinks.postSource({
            src: reso,
          }),
        })
        return
      }

      // TODO: Figure how to handle situations where resource does not exist yet
      // but pipeline is already being persisted properly. This current solution
      // is vulnerable to race condition and feels brittle. Though syncResource is only
      // called from the UI so we are fine for now.
      await ctx.asOrgIfNeeded._syncResourceUpdate(reso.connectorConfig, {
        endUserId: reso.endUserId,
        settings: reso.settings,
        resourceExternalId: extractId(reso.id)[2],
        integration: reso.integration && {
          externalId: extractId(reso.integration.id)[2],
          data: reso.integration.external ?? {},
        },
        triggerDefaultSync: true,
      })
    }),
  syncPipeline: protectedProcedure
    .input(z.tuple([zId('pipe'), zSyncOptions.optional()]))
    .mutation(async function syncPipeline({input: [pipeId, opts], ctx}) {
      if (ctx.viewer.role === 'end_user') {
        await ctx.services.getPipelineOrFail(pipeId) // Authorization
      }
      const pipeline = await ctx.asOrgIfNeeded.getPipelineExpandedOrFail(pipeId)
      console.log('[syncPipeline]', pipeline)
      return ctx.services._syncPipeline(pipeline, opts)
    }),
})
