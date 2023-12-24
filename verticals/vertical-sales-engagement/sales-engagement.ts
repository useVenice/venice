import type {RouterMap, RouterMeta, VerticalRouterOpts} from '@usevenice/vdk'
import {proxyCallRemote, z, zPaginationParams} from '@usevenice/vdk'
import * as zSalesEngagement from './schemas'

export {zSalesEngagement}

export type ZSalesEngagement = {
  [k in keyof typeof zSalesEngagement]: z.infer<(typeof zSalesEngagement)[k]>
}

function oapi(meta: NonNullable<RouterMeta['openapi']>): RouterMeta {
  const vertical = 'sales-engagement'
  return {openapi: {...meta, path: `/verticals/${vertical}${meta.path}`}}
}

export function createSalesEngagementRouter(opts: VerticalRouterOpts) {
  const router = opts.trpc.router({
    listContacts: opts.remoteProcedure
      .meta(oapi({method: 'GET', path: '/contacts'}))
      .input(zPaginationParams.nullish())
      .output(
        z.object({
          hasNextPage: z.boolean(),
          items: z.array(zSalesEngagement.contact),
        }),
      )
      .query(async ({input, ctx}) => proxyCallRemote({input, ctx, opts})),
  })

  return router
}

export type SalesEngagementRouter = ReturnType<
  typeof createSalesEngagementRouter
>
export type VerticalSalesEngagement<TOpts> = RouterMap<
  SalesEngagementRouter,
  TOpts
>
