import type {OpenApiMeta} from '@lilyrose2798/trpc-openapi'
import {initTRPC, TRPCError} from '@trpc/server'
import {getExtEndUserId, hasRole} from '@usevenice/cdk'
import {HTTPError} from '@usevenice/util'
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
  .create({
    allowOutsideOfServer: true,
    errorFormatter(opts) {
      const {shape, error} = opts
      if (!(error.cause instanceof HTTPError)) {
        return shape
      }
      return {
        ...shape,
        data: error.cause.response
          ? {
              ...error.cause.response,
              // Renaming body to be nicer. otherwise we end up with data.data
              data: undefined,
              body: error.cause.response.data,
            }
          : shape.data,
      }
    },
  })

export const publicProcedure = trpc.procedure
// Enable me for logs
// .use(
//   ({next, ctx, input, rawInput, meta, path}) => {
//     console.log('[trpc]', {
//       input,
//       rawInput,
//       meta,
//       path,
//     })
//     return next({ctx})
//   },
// )

export const protectedProcedure = publicProcedure.use(({next, ctx}) => {
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

export const adminProcedure = publicProcedure.use(({next, ctx}) => {
  if (!hasRole(ctx.viewer, ['user', 'org', 'system'])) {
    throw new TRPCError({
      code: ctx.viewer.role === 'anon' ? 'UNAUTHORIZED' : 'FORBIDDEN',
    })
  }
  return next({ctx: {...ctx, viewer: ctx.viewer}})
})

export const systemProcedure = publicProcedure.use(({next, ctx}) => {
  if (!hasRole(ctx.viewer, ['system'])) {
    throw new TRPCError({
      code: ctx.viewer.role === 'anon' ? 'UNAUTHORIZED' : 'FORBIDDEN',
    })
  }
  return next({ctx: {...ctx, viewer: ctx.viewer}})
})

export const remoteProcedure = protectedProcedure.use(
  async ({next, ctx, path}) => {
    // TODO Should parse headers in here?
    if (!ctx.remoteResourceId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'x-resource-id header is required',
      })
    }

    // Ensure that end user can access its own resources
    if (ctx.viewer.role === 'end_user') {
      await ctx.services.getResourceOrFail(ctx.remoteResourceId)
    }

    // Elevant role to organization here
    const resource = await ctx.asOrgIfNeeded.getResourceExpandedOrFail(
      ctx.remoteResourceId,
    )

    return next({
      ctx: {
        ...ctx,
        path: path ?? ((ctx as any).path as string),
        remote: {
          id: resource.id,
          connector: resource.connectorConfig.connector,
          connectorName: resource.connectorName,
          settings: resource.settings,
          // TODO: Need to be careful this is never returned to any end user endpoints
          // and only used for making requests with remotes
          config: resource.connectorConfig.config,
          fetchLinks: ctx.services.getFetchLinks(resource),
        },
      },
    })
  },
)
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
