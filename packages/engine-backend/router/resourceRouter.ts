import {TRPCError} from '@trpc/server'

import {zId, zPassthroughInput} from '@usevenice/cdk'
import {Rx, rxjs, z} from '@usevenice/util'

import {protectedProcedure, remoteProcedure, trpc} from './_base'

export {type inferProcedureInput} from '@trpc/server'

export const resourceRouter = trpc.router({
  // TODO: maybe we should allow resourceId to be part of the path rather than only in the headers
  passthrough: remoteProcedure
    .meta({openapi: {method: 'POST', path: '/passthrough', tags: ['resource']}})
    .input(zPassthroughInput)
    .output(z.any())
    .mutation(async ({input, ctx}) => {
      if (!ctx.remote.provider.passthrough) {
        throw new TRPCError({
          code: 'NOT_IMPLEMENTED',
          message: `${ctx.remote.providerName} does not implement passthrough`,
        })
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const instance = ctx.remote.provider.newInstance?.({
        config: ctx.remote.config,
        settings: ctx.remote.settings,
        onSettingsChange: () => {}, // not implemented
      })
      return await ctx.remote.provider.passthrough(instance, input)
    }),

  sourceSync: protectedProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/resources/{id}/source_sync',
        tags: ['resource'],
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
})
