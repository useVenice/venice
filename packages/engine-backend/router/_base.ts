import {initTRPC, TRPCError} from '@trpc/server'
import type {OpenApiMeta} from 'trpc-openapi'

import {getExtEndUserId, hasRole} from '@usevenice/cdk'

import type {RouterContext} from '../context'

export interface RouterMeta extends OpenApiMeta {
  response?: {
    vertical: 'accounting' | 'investment'
    entity:
      | 'account'
      | 'expense'
      | 'vendor'
      | 'security'
      | 'holding'
      | 'transaction'
    type: 'list' // | 'get'
  }
}

export const trpc = initTRPC
  .context<RouterContext>()
  .meta<RouterMeta>()
  // For client side to be able to import runtime schema from server side also
  .create({allowOutsideOfServer: true})

export const publicProcedure = trpc.procedure

export const protectedProcedure = trpc.procedure.use(({next, ctx}) => {
  if (!hasRole(ctx.viewer, ['end_user', 'user', 'org', 'system'])) {
    throw new TRPCError({
      code: ctx.viewer.role === 'anon' ? 'UNAUTHORIZED' : 'FORBIDDEN',
    })
  }
  const asOrgIfNeeded =
    ctx.viewer.role === 'end_user'
      ? ctx.as('org', {orgId: ctx.viewer.orgId})
      : ctx.services
  const extEndUserId = getExtEndUserId(ctx.viewer)
  return next({ctx: {...ctx, viewer: ctx.viewer, asOrgIfNeeded, extEndUserId}})
})

export const adminProcedure = trpc.procedure.use(({next, ctx}) => {
  if (!hasRole(ctx.viewer, ['user', 'org', 'system'])) {
    throw new TRPCError({
      code: ctx.viewer.role === 'anon' ? 'UNAUTHORIZED' : 'FORBIDDEN',
    })
  }
  return next({ctx: {...ctx, viewer: ctx.viewer}})
})

export const systemProcedure = trpc.procedure.use(({next, ctx}) => {
  if (!hasRole(ctx.viewer, ['system'])) {
    throw new TRPCError({
      code: ctx.viewer.role === 'anon' ? 'UNAUTHORIZED' : 'FORBIDDEN',
    })
  }
  return next({ctx: {...ctx, viewer: ctx.viewer}})
})

export const remoteProcedure = protectedProcedure.use(async ({next, ctx}) => {
  // TODO Should parse headers in here?
  if (!ctx.remoteResourceId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'x-resource-id header is required',
    })
  }
  const resource = await ctx.services.getResourceExpandedOrFail(
    ctx.remoteResourceId,
  )

  return next({
    ctx: {
      ...ctx,
      path: (ctx as any).path as string,
      remote: {
        id: resource.id,
        provider: resource.integration.provider,
        providerName: resource.providerName,
        settings: resource.settings,
        config: resource.integration.config,
      },
    },
  })
})
export type RemoteProcedureContext = ReturnType<
  (typeof remoteProcedure)['query']
>['_def']['_ctx_out']

// Not used atm
// const levelByRole = {
//   anon: 0,
//   end_user: 1,
//   user: 2,
//   org: 3,
//   system: 4,
// } satisfies Record<ViewerRole, number>
