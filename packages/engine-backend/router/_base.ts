import {TRPCError, initTRPC} from '@trpc/server'
import type {RouterContext} from '../context'
import {hasRole} from '@usevenice/cdk-core'

/** TODO: Use OpenApiMeta from https://github.com/jlalmes/trpc-openapi */
interface OpenApiMeta {}

export const trpc = initTRPC
  .context<RouterContext>()
  .meta<OpenApiMeta>()
  .create()

export const publicProcedure = trpc.procedure

export const protectedProcedure = trpc.procedure.use(({next, ctx}) => {
  if (!hasRole(ctx.viewer, ['end_user', 'user', 'workspace', 'system'])) {
    throw new TRPCError({
      code: ctx.viewer.role === 'anon' ? 'UNAUTHORIZED' : 'FORBIDDEN',
    })
  }
  const asWorkspaceIfNeeded =
    ctx.viewer.role === 'end_user'
      ? ctx.as('workspace', {workspaceId: ctx.viewer.workspaceId})
      : ctx.helpers
  return next({ctx: {...ctx, viewer: ctx.viewer, asWorkspaceIfNeeded}})
})

export const endUserProcedure = trpc.procedure.use(({next, ctx, path}) => {
  if (!hasRole(ctx.viewer, ['end_user'])) {
    throw new TRPCError({
      code: ctx.viewer.role === 'anon' ? 'UNAUTHORIZED' : 'FORBIDDEN',
      message: `end_user role is required for ${path} procedure`,
    })
  }
  const asWorkspace = ctx.as('workspace', {workspaceId: ctx.viewer.workspaceId})
  return next({
    ctx: {...ctx, viewer: ctx.viewer, asWorkspace},
  })
})

export const adminProcedure = trpc.procedure.use(({next, ctx}) => {
  if (!hasRole(ctx.viewer, ['user', 'workspace', 'system'])) {
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
//   workspace: 3,
//   system: 4,
// } satisfies Record<ViewerRole, number>
