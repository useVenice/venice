import {zId, zWebhookInput} from '@usevenice/cdk-core'
import {z} from '@usevenice/util'

import {systemProcedure, trpc} from './_base'

export const systemRouter = trpc.router({
  handleWebhook: systemProcedure
    .input(z.tuple([zId('int'), zWebhookInput]))
    .mutation(async ({input: [intId, input], ctx}) => {
      const int = await ctx.services.getIntegrationOrFail(intId)

      if (!int.provider.schemas.webhookInput || !int.provider.handleWebhook) {
        console.warn(`${int.provider.name} does not handle webhooks`)
        return
      }
      const res = await int.provider.handleWebhook(
        int.provider.schemas.webhookInput.parse(input),
        int.config,
      )
      await Promise.all(
        res.resourceUpdates.map((resoUpdate) =>
          // Provider is responsible for providing envName / userId
          // This may be relevant for OneBrick resources for example
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          ctx.services._syncResourceUpdate(int, resoUpdate),
        ),
      )

      return res.response?.body
    }),
})
