import '@usevenice/app-config/register.node'

import * as trpcNext from '@trpc/server/adapters/next'
import type {NextApiHandler} from 'next'

import {contextFactory} from '@usevenice/app-config/backendConfig'
import {flatRouter, parseWebhookRequest} from '@usevenice/engine-backend'
import {R} from '@usevenice/util'

import {respondToCORS, serverGetViewer} from '../../../server/server-helpers'

const handler = trpcNext.createNextApiHandler({
  router: flatRouter,
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
