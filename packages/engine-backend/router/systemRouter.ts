import {zId, zWebhookInput} from '@usevenice/cdk'
import {z} from '@usevenice/util'

import {systemProcedure, trpc} from './_base'

export const systemRouter = trpc.router({
  handleWebhook: systemProcedure
    .input(z.tuple([zId('ccfg'), zWebhookInput]))
    .mutation(async ({input: [ccfgId, input], ctx}) => {
      const int = await ctx.services.getConnectorConfigOrFail(ccfgId)

      if (!int.connector.schemas.webhookInput || !int.connector.handleWebhook) {
        console.warn(`${int.connector.name} does not handle webhooks`)
        return
      }
      const res = await int.connector.handleWebhook(
        int.connector.schemas.webhookInput.parse(input),
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
