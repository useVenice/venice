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
})
