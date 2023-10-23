import type {OauthBaseTypes, ResourceUpdate} from '@usevenice/cdk-core'
import {
  makeId,
  makeOauthIntegrationServer,
  zConnectOptions,
  zId,
  zPostConnectOptions,
  zRaw,
} from '@usevenice/cdk-core'
import {joinPath, makeUlid, z} from '@usevenice/util'

import {inngest} from '../events'
import {parseWebhookRequest} from '../parseWebhookRequest'
import {protectedProcedure, trpc} from './_base'

export {type inferProcedureInput} from '@trpc/server'

/** TODO: Modify this so that admin user can execute it... not just endUser */
export const endUserRouter = trpc.router({
  // MARK: - Connect
  preConnect: protectedProcedure
    .input(z.tuple([zId('int'), zConnectOptions, z.unknown()]))
    // Consider using sessionId, so preConnect corresponds 1:1 with postConnect
    .query(
      async ({
        input: [intId, {resourceExternalId, ...connCtxInput}, preConnInput],
        ctx,
      }) => {
        const int = await ctx.asOrgIfNeeded.getIntegrationOrFail(intId)
        if (!int.provider.preConnect) {
          return null
        }
        const reso = resourceExternalId
          ? await ctx.helpers.getResourceOrFail(
              makeId('reso', int.provider.name, resourceExternalId),
            )
          : undefined
        return int.provider.preConnect?.(
          int.config,
          {
            ...connCtxInput,
            extEndUserId: ctx.extEndUserId,
            resource: reso
              ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                {externalId: resourceExternalId!, settings: reso.settings}
              : undefined,
            webhookBaseUrl: joinPath(
              ctx.apiUrl,
              parseWebhookRequest.pathOf(int.id),
            ),
            redirectUrl: ctx.getRedirectUrl?.(int, {
              endUserId:
                ctx.viewer.role === 'end_user' ? ctx.viewer.endUserId : null,
            }),
          },
          preConnInput,
        )
      },
    ),
  // useConnectHook happens client side only
  // for cli usage, can just call `postConnect` directly. Consider making the
  // flow a bit smoother with a guided cli flow
  postConnect: protectedProcedure
    .input(z.tuple([z.unknown(), zId('int'), zPostConnectOptions]))
    // Questionable why `zConnectContextInput` should be there. Examine whether this is actually
    // needed
    // How do we verify that the userId here is the same as the userId from preConnectOption?

    .mutation(
      async ({
        input: [input, intId, {resourceExternalId, ...connCtxInput}],
        ctx,
      }) => {
        const int = await ctx.asOrgIfNeeded.getIntegrationOrFail(intId)
        console.log('didConnect start', int.provider.name, input, connCtxInput)

        const resoUpdate = await (async () => {
          if (
            !int.provider.postConnect &&
            int.provider.metadata?.nangoProvider
          ) {
            return (await makeOauthIntegrationServer({
              nangoClient: ctx.nango,
              intId,
              nangoProvider: int.provider.metadata.nangoProvider,
            }).postConnect(input as OauthBaseTypes['connectOutput'])) as Omit<
              ResourceUpdate<any, any>,
              'endUserId'
            >
          }

          if (!int.provider.postConnect || !int.provider.def.connectOutput) {
            return null
          }

          const reso = resourceExternalId
            ? await ctx.helpers.getResourceOrFail(
                makeId('reso', int.provider.name, resourceExternalId),
              )
            : undefined
          return await int.provider.postConnect(
            int.provider.def.connectOutput.parse(input),
            int.config,
            {
              ...connCtxInput,
              extEndUserId: ctx.extEndUserId,
              resource: reso
                ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  {externalId: resourceExternalId!, settings: reso.settings}
                : undefined,
              webhookBaseUrl: joinPath(
                ctx.apiUrl,
                parseWebhookRequest.pathOf(int.id),
              ),
              redirectUrl: ctx.getRedirectUrl?.(int, {
                endUserId:
                  ctx.viewer.role === 'end_user' ? ctx.viewer.endUserId : null,
              }),
            },
          )
        })()

        if (!resoUpdate) {
          return 'Noop'
        }

        const syncInBackground =
          resoUpdate.triggerDefaultSync && !connCtxInput.syncInBand
        const resourceId = await ctx.asOrgIfNeeded._syncResourceUpdate(int, {
          ...resoUpdate,
          // No need for each integration to worry about this, unlike in the case of handleWebhook.
          endUserId:
            ctx.viewer.role === 'end_user' ? ctx.viewer.endUserId : null,
          triggerDefaultSync:
            !syncInBackground && resoUpdate.triggerDefaultSync,
        })

        await inngest.send('connect/resource-connected', {data: {resourceId}})

        if (syncInBackground) {
          await inngest.send('sync/resource-requested', {data: {resourceId}})
        }
        console.log('didConnect finish', int.provider.name, input)
        return 'Resource successfully connected'
      },
    ),
  createResource: protectedProcedure
    .meta({openapi: {method: 'POST', path: '/resources'}})
    .input(zRaw.resource.pick({integrationId: true, settings: true}))
    // Questionable why `zConnectContextInput` should be there. Examine whether this is actually
    // needed
    // How do we verify that the userId here is the same as the userId from preConnectOption?
    .output(z.string())
    .mutation(async ({input: {integrationId, settings}, ctx}) => {
      // Authorization
      await ctx.helpers.getIntegrationInfoOrFail(integrationId)

      // Escalate to now have enough pemission to sync
      const int = await ctx.asOrgIfNeeded.getIntegrationOrFail(integrationId)

      const _extId = makeUlid()
      const resoId = makeId('reso', int.provider.name, _extId)

      // Should throw if not working..
      const resoUpdate = {
        triggerDefaultSync: false,
        // TODO: Should no longer depend on external ID
        resourceExternalId: _extId,
        settings,
        ...(await int.provider.checkResource?.({
          config: int.config,
          settings,
          context: {webhookBaseUrl: ''},
          options: {},
        })),
        // TODO: Fix me up
        endUserId: ctx.viewer.role === 'end_user' ? ctx.viewer.endUserId : null,
      } satisfies ResourceUpdate
      await ctx.asOrgIfNeeded._syncResourceUpdate(int, resoUpdate)
      return resoId
    }),

  // TODO: Run server-side validation
  updateResource: protectedProcedure
    .meta({openapi: {method: 'PATCH', path: '/resources/{id}'}})
    .input(zRaw.resource.pick({id: true, settings: true, displayName: true}))
    .output(zRaw.resource)
    .mutation(async ({input: {id, ...input}, ctx}) =>
      // TODO: Run mapStandardResource after editing
      // Also we probably do not want deeply nested patch
      // shallow is sufficient more most situations
      ctx.helpers.patchReturning('resource', id, input),
    ),
  deleteResource: protectedProcedure
    .meta({openapi: {method: 'DELETE', path: '/resources/{id}'}})
    .input(z.object({id: zId('reso'), skipRevoke: z.boolean().optional()}))
    .output(z.void())
    .mutation(async ({input: {id: resoId, ...opts}, ctx}) => {
      if (ctx.viewer.role === 'end_user') {
        await ctx.helpers.getResourceOrFail(resoId)
      }
      const {settings, integration, ...reso} =
        await ctx.asOrgIfNeeded.getResourceExpandedOrFail(resoId)
      if (!opts?.skipRevoke) {
        await integration.provider.revokeResource?.(
          settings,
          integration.config,
        )
      }
      // if (opts?.todo_deleteAssociatedData) {
      // TODO: Figure out how to delete... Destination is not part of meta service
      // and we don't easily have the ability to handle a delete, it's not part of the sync protocol yet...
      // We should probably introduce a reset / delete event...
      // }
      await ctx.asOrgIfNeeded.metaService.tables.resource.delete(reso.id)
    }),
})
