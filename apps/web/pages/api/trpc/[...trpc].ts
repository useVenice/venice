import '@usevenice/app-config/register.node'

import * as trpcNext from '@trpc/server/adapters/next'
import {clerkClient} from '@clerk/nextjs'
import {TRPCError} from '@trpc/server'
import type {NextApiHandler} from 'next'

import {contextFactory} from '@usevenice/app-config/backendConfig'
import {flatRouter, parseWebhookRequest} from '@usevenice/engine-backend'
import {adminProcedure, trpc} from '@usevenice/engine-backend/router/_base'
import {R} from '@usevenice/util'

import {zAuth} from '@/lib-common/schemas'

import {
  respondToCORS,
  serverGetViewer,
} from '../../../lib-server/server-helpers'

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

const appRouter = trpc.mergeRouters(flatRouter, customRouter)

export type AppRouter = typeof appRouter

const handler = trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: async ({req, res}) => {
    const viewer = await serverGetViewer({req, res})
    console.log('[trpc.createContext]', {query: req.query, viewer})
    return contextFactory.fromViewer(viewer)
  },
  onError: ({error}) => {
    console.warn('error', error)
  },
})

export default R.identity<NextApiHandler>((req, res) => {
  if (respondToCORS(req, res)) {
    return
  }
  // TODO: Split out webhook into its own function...
  const segments = req.query['trpc'] as [string] | string

  if (Array.isArray(segments) && parseWebhookRequest.isWebhook(segments)) {
    // TODO: #inngestMe This is where we can call inngest.send rather than handling webhooks synchronously.
    const {procedure, ...ret} = parseWebhookRequest({
      method: req.method,
      headers: req.headers,
      pathSegments: segments,
      query: req.query,
      body: req.body,
    })
    req.query = ret.query as (typeof req)['query']
    req.query['trpc'] = procedure
    req.body = ret.body
  }
  return handler(req, res)
})
