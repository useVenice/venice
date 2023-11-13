import '@usevenice/app-config/register.node'

import * as trpcNext from '@trpc/server/adapters/next'
import type {NextApiHandler} from 'next'

import {contextFactory} from '@usevenice/app-config/backendConfig'
import type {Id} from '@usevenice/cdk'
import type {RouterContext} from '@usevenice/engine-backend'
import {parseWebhookRequest} from '@usevenice/engine-backend'
import {fromMaybeArray} from '@usevenice/util'

import {appRouter} from '@/lib-server/appRouter'
import {respondToCORS, serverGetViewer} from '@/lib-server/server-helpers'

export const createContext: Parameters<
  typeof trpcNext.createNextApiHandler
>[0]['createContext'] = async ({req, res}): Promise<RouterContext> => {
  const viewer = await serverGetViewer({req, res})
  console.log('[trpc.createContext]', {query: req.query, viewer})
  return {
    ...contextFactory.fromViewer(viewer),
    remoteResourceId:
      (fromMaybeArray(req.headers['x-resource-id'])[0] as Id['reso']) ?? null,
  }
}

export const onError: Parameters<
  typeof trpcNext.createNextApiHandler
>[0]['onError'] = ({error}) => {
  console.warn('error', error)
}

const handler = trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError,
})

export default (function trpcHandler(req, res) {
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
} satisfies NextApiHandler)
