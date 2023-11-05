import {TRPCError} from '@trpc/server'

import {intHelpers, zId} from '@usevenice/cdk-core'
import {Rx, rxjs, z} from '@usevenice/util'

import {protectedProcedure, trpc} from './_base'

export {type inferProcedureInput} from '@trpc/server'

export const resourceRouter = trpc.router({
  sourceSync: protectedProcedure
    .meta({openapi: {method: 'POST', path: '/resources/{id}/source_sync'}})
    .input(z.object({id: zId('reso'), state: z.record(z.unknown()).optional()}))
    .output(z.array(z.record(z.any())))
    .mutation(async ({input, ctx}) => {
      const reso = await ctx.helpers.getResourceExpandedOrFail(input.id)
      const provider = reso.integration.provider
      const instance = provider.newInstance?.({
        config: reso.integration.config,
        settings: reso.settings,
      })
      if (!provider.sourceSync) {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          message: `Source sync not implemented for ${reso.providerName}`,
        })
      }
      if (provider.verticals?.accounting?.listAccounts) {
        const accounts = await provider.verticals?.accounting?.listAccounts({
          instance,
        })
        const helpers = intHelpers(provider.def)
        return accounts.items.map((a) =>
          helpers._opData('accounting_account', (a as any).id, a),
        )
      }
      // NOTE: Gotta make sure this is not an infinite sourceSync somehow such as
      // in the case of firestore...

      return rxjs.firstValueFrom(
        provider
          .sourceSync({
            config: reso.integration.config,
            settings: reso.settings,
            endUser:
              ctx.viewer.role === 'end_user'
                ? {id: ctx.viewer.endUserId}
                : null,
            state: input.state,
          })
          .pipe(Rx.toArray()),
      )
    }),
})
