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
    console.log('[createContext]', {
      query: req.query,
      headers: req.headers,
    })
    return contextFactory.fromViewer(await serverGetViewer({req, res}))
  },
  onError: ({error}) => {
    console.warn('error', error)
  },
})

// This probably needs to be refactored into sync-backend package together with
// perhaps the cli package
// - [ ] Remove RouterContext no longer needed
// - [ ] Do the same logic for veniceCli httpServer that does not use next
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
