import {endUserProcedure, trpc} from './_base'

import {
  makeId,
  zConnectOptions,
  zId,
  zPostConnectOptions,
} from '@usevenice/cdk-core'
import {joinPath, z} from '@usevenice/util'

import {inngest} from '../events'
import {parseWebhookRequest} from '../parseWebhookRequest'

export {type inferProcedureInput} from '@trpc/server'

export const endUserRouter = trpc.router({
  // MARK: - Connect
  preConnect: endUserProcedure
    .input(z.tuple([zId('int'), zConnectOptions, z.unknown()]))
    // Consider using sessionId, so preConnect corresponds 1:1 with postConnect
    .query(
      async ({
        input: [intId, {resourceExternalId, ...connCtxInput}, preConnInput],
        ctx,
      }) => {
        const int = await ctx.helpers.getIntegrationOrFail(intId)
        if (!int.provider.preConnect) {
          return null
        }
        const reso = resourceExternalId
          ? await ctx.helpers.getResourceOrFail(
              makeId('reso', int.provider.name, resourceExternalId),
            )
          : undefined
        if (reso) {
        }
        return int.provider.preConnect?.(
          int.config,
          {
            ...connCtxInput,
            endUserId: ctx.viewer.endUserId,
            resource: reso
              ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                {externalId: resourceExternalId!, settings: reso.settings}
              : undefined,
            webhookBaseUrl: joinPath(
              ctx.apiUrl,
              parseWebhookRequest.pathOf(int.id),
            ),
            redirectUrl: ctx.getRedirectUrl?.(int, {
              endUserId: ctx.viewer.endUserId,
            }),
          },
          preConnInput,
        )
      },
    ),
  // useConnectHook happens client side only
  // for cli usage, can just call `postConnect` directly. Consider making the
  // flow a bit smoother with a guided cli flow
  postConnect: endUserProcedure
    .input(z.tuple([z.unknown(), zId('int'), zPostConnectOptions]))
    // Questionable why `zConnectContextInput` should be there. Examine whether this is actually
    // needed
    // How do we verify that the userId here is the same as the userId from preConnectOption?

    .mutation(
      async ({
        input: [input, intId, {resourceExternalId, ...connCtxInput}],
        ctx,
      }) => {
        const int = await ctx.helpers.getIntegrationOrFail(intId)
        console.log('didConnect start', int.provider.name, input, connCtxInput)
        if (!int.provider.postConnect || !int.provider.def.connectOutput) {
          return 'Noop'
        }
        const reso = resourceExternalId
          ? await ctx.helpers.getResourceOrFail(
              makeId('reso', int.provider.name, resourceExternalId),
            )
          : undefined
        if (reso) {
        }

        const resoUpdate = await int.provider.postConnect(
          int.provider.def.connectOutput.parse(input),
          int.config,
          {
            ...connCtxInput,
            endUserId: ctx.viewer.endUserId,
            resource: reso
              ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                {externalId: resourceExternalId!, settings: reso.settings}
              : undefined,
            webhookBaseUrl: joinPath(
              ctx.apiUrl,
              parseWebhookRequest.pathOf(int.id),
            ),
            redirectUrl: ctx.getRedirectUrl?.(int, {
              endUserId: ctx.viewer.endUserId,
            }),
          },
        )

        const syncInBackground =
          resoUpdate.triggerDefaultSync && !connCtxInput.syncInBand

        const resourceId = await ctx.helpers._syncResourceUpdate(int, {
          ...resoUpdate,
          // No need for each integration to worry about this, unlike in the case of handleWebhook.
          endUserId: ctx.viewer.endUserId,
          envName: connCtxInput.envName,
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
})
