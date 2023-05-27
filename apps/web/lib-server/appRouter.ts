import {clerkClient} from '@clerk/nextjs'
import {TRPCError} from '@trpc/server'

import {flatRouter} from '@usevenice/engine-backend'
import {adminProcedure, trpc} from '@usevenice/engine-backend/router/_base'

import {zAuth} from '@/lib-common/schemas'

const customRouter = trpc.router({
  updateOrganization: adminProcedure
    .input(zAuth.organization.pick({id: true, publicMetadata: true}))
    .mutation(async ({ctx, input: {id, ...update}}) => {
      if (ctx.viewer.role !== 'system' && ctx.viewer.orgId !== id) {
        throw new TRPCError({code: 'UNAUTHORIZED'})
      }
      const org = await clerkClient.organizations.updateOrganization(id, update)
      return org
    }),
})

export const appRouter = trpc.mergeRouters(flatRouter, customRouter)

export type AppRouter = typeof appRouter
