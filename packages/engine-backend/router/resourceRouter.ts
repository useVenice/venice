import {TRPCError} from '@trpc/server'

import {zId} from '@usevenice/cdk-core'
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

      if (!reso.integration.provider.sourceSync) {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          message: `Source sync not implemented for ${reso.providerName}`,
        })
      }
      // NOTE: Gotta make sure this is not an infinite sourceSync somehow such as
      // in the case of firestore...

      return rxjs.firstValueFrom(
        reso.integration.provider
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
