import {initTRPC, TRPCError} from '@trpc/server'

import {hasRole} from '@usevenice/cdk-core'

import type {RouterContext} from '../context'

/** TODO: Use OpenApiMeta from https://github.com/jlalmes/trpc-openapi */
interface OpenApiMeta {}

export const trpc = initTRPC
  .context<RouterContext>()
  .meta<OpenApiMeta>()
  .create()

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
      : ctx.helpers
  return next({ctx: {...ctx, viewer: ctx.viewer, asOrgIfNeeded}})
})

export const endUserProcedure = trpc.procedure.use(({next, ctx, path}) => {
  if (!hasRole(ctx.viewer, ['end_user'])) {
    throw new TRPCError({
      code: ctx.viewer.role === 'anon' ? 'UNAUTHORIZED' : 'FORBIDDEN',
      message: `end_user role is required for ${path} procedure`,
    })
  }
  const asOrg = ctx.as('org', {orgId: ctx.viewer.orgId})
  return next({ctx: {...ctx, viewer: ctx.viewer, asOrg}})
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

// Not used atm
// const levelByRole = {
//   anon: 0,
//   end_user: 1,
//   user: 2,
//   org: 3,
//   system: 4,
// } satisfies Record<ViewerRole, number>
