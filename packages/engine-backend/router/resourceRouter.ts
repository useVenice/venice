import {TRPCError} from '@trpc/server'
import type {ResourceUpdate, ZRaw} from '@usevenice/cdk'
import {
  extractId,
  makeId,
  sync,
  zCheckResourceOptions,
  zEndUserId,
  zId,
  zPassthroughInput,
  zRaw,
} from '@usevenice/cdk'
import {joinPath, makeUlid, Rx, rxjs, z} from '@usevenice/util'
import {parseWebhookRequest} from '../parseWebhookRequest'
import {zSyncOptions} from '../types'
import {protectedProcedure, remoteProcedure, trpc} from './_base'
import {zListParams} from './_schemas'

export {type inferProcedureInput} from '@trpc/server'

const tags = ['Core']

export const resourceRouter = trpc.router({
  // TODO: maybe we should allow resourceId to be part of the path rather than only in the headers

  // Should this really be part of the resource router? or left elsewhere?
  passthrough: remoteProcedure
    .meta({openapi: {method: 'POST', path: '/passthrough', tags: ['Internal']}}) // Where do we put this?
    .input(zPassthroughInput)
    .output(z.any())
    .mutation(async ({input, ctx}) => {
      if (!ctx.remote.connector.passthrough) {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          message: `${ctx.remote.connectorName} does not implement passthrough`,
        })
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const instance = ctx.remote.connector.newInstance?.({
        config: ctx.remote.config,
        settings: ctx.remote.settings,
        fetchLinks: ctx.remote.fetchLinks,
        onSettingsChange: () => {}, // not implemented
      })
      return await ctx.remote.connector.passthrough(instance, input)
    }),

  sourceSync: protectedProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/core/resource/{id}/source_sync',
        tags,
      },
    })
    .input(z.object({id: zId('reso'), state: z.record(z.unknown()).optional()}))
    .output(z.array(z.record(z.any())))
    .mutation(async ({input, ctx}) => {
      const reso = await ctx.services.getResourceExpandedOrFail(input.id)

      // NOTE: Gotta make sure this is not an infinite sourceSync somehow such as
      // in the case of firestore...

      const res = ctx.services.sourceSync({
        opts: {},
        state: {},
        src: reso,
        endUser:
          ctx.viewer.role === 'end_user' ? {id: ctx.viewer.endUserId} : null,
      })

      return rxjs.firstValueFrom(res.pipe(Rx.toArray()))
    }),
  createResource: protectedProcedure
    .meta({openapi: {method: 'POST', path: '/core/resource', tags}})
    .input(
      zRaw.resource.pick({
        connectorConfigId: true,
        settings: true,
        displayName: true,
        endUserId: true,
        disabled: true,
        metadata: true,
        integrationId: true,
      }),
    )
    // Questionable why `zConnectContextInput` should be there. Examine whether this is actually
    // needed
    // How do we verify that the userId here is the same as the userId from preConnectOption?
    .output(z.string())
    .mutation(async ({input: {connectorConfigId, settings, ...input}, ctx}) => {
      // Authorization
      await ctx.services.getConnectorConfigInfoOrFail(connectorConfigId)

      // Escalate to now have enough pemission to sync
      const int =
        await ctx.asOrgIfNeeded.getConnectorConfigOrFail(connectorConfigId)

      const _extId = makeUlid()
      const resoId = makeId('reso', int.connector.name, _extId)

      // Should throw if not working..
      const resoUpdate = {
        triggerDefaultSync: false,
        // TODO: Should no longer depend on external ID
        resourceExternalId: _extId,
        settings,
        ...(await int.connector.checkResource?.({
          config: int.config,
          settings,
          context: {webhookBaseUrl: ''},
          options: {},
        })),
        // TODO: Fix me up
        endUserId: ctx.viewer.role === 'end_user' ? ctx.viewer.endUserId : null,
      } satisfies ResourceUpdate
      await ctx.asOrgIfNeeded._syncResourceUpdate(int, resoUpdate)

      // TODO: Do this in one go not two
      if (input.displayName) {
        await ctx.services.patchReturning('resource', resoId, input)
      }
      // TODO: return the entire resource object...
      return resoId
    }),

  // TODO: Run server-side validation
  updateResource: protectedProcedure
    .meta({openapi: {method: 'PATCH', path: '/core/resource/{id}', tags}})
    .input(
      zRaw.resource.pick({
        id: true,
        settings: true,
        displayName: true,
        metadata: true,
        disabled: true,
        // Not sure if we should allow these two?
        endUserId: true,
        integrationId: true,
      }),
    )
    .output(zRaw.resource)
    .mutation(async ({input: {id, ...input}, ctx}) =>
      // TODO: Run mapStandardResource after editing
      // Also we probably do not want deeply nested patch
      // shallow is sufficient more most situations
      ctx.services.patchReturning('resource', id, input),
    ),
  deleteResource: protectedProcedure
    .meta({openapi: {method: 'DELETE', path: '/core/resource/{id}', tags}})
    .input(z.object({id: zId('reso'), skipRevoke: z.boolean().optional()}))
    .output(z.void())
    .mutation(async ({input: {id: resoId, ...opts}, ctx}) => {
      if (ctx.viewer.role === 'end_user') {
        await ctx.services.getResourceOrFail(resoId)
      }
      const {
        settings,
        connectorConfig: ccfg,
        ...reso
      } = await ctx.asOrgIfNeeded.getResourceExpandedOrFail(resoId)
      if (!opts?.skipRevoke) {
        await ccfg.connector.revokeResource?.(settings, ccfg.config)
      }
      // if (opts?.todo_deleteAssociatedData) {
      // TODO: Figure out how to delete... Destination is not part of meta service
      // and we don't easily have the ability to handle a delete, it's not part of the sync protocol yet...
      // We should probably introduce a reset / delete event...
      // }
      await ctx.asOrgIfNeeded.metaService.tables.resource.delete(reso.id)
    }),
  listResources: protectedProcedure
    .meta({openapi: {method: 'GET', path: '/core/resource', tags}})
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
      const resources =
        await ctx.services.metaService.tables.resource.list(input)
      return resources as Array<ZRaw['resource']>
    }),
  getResource: protectedProcedure
    .meta({
      description: 'Not automatically called, used for debugging for now',
      openapi: {method: 'GET', path: '/core/resource/{id}', tags},
    })
    .input(z.object({id: zId('reso')}))
    .output(zRaw.resource) // TODO: This is actually expanded...
    .query(async ({input, ctx}) => {
      // do not expand for now otherwise permission issues..
      const reso = await ctx.services.getResourceOrFail(input.id)
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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              instance: reso.connectorConfig.connector.newInstance?.({
                config: reso.connectorConfig.config,
                settings: reso.settings,
                fetchLinks: ctx.services.getFetchLinks(reso),
                onSettingsChange: () => {},
              }),
              config: reso.connectorConfig.config,
              settings: reso.settings,
              endUser: reso.endUserId && {id: reso.endUserId},
              state: {},
              streams: {},
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
})
