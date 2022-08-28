import '@ledger-sync/app-config/register.node'

import {ledgerSyncRouter} from '@ledger-sync/app-config'
import {parseWebhookRequest} from '@ledger-sync/engine'
import {identity} from '@ledger-sync/util'
import * as trpcNext from '@trpc/server/adapters/next'
import {NextApiHandler} from 'next'

const handler = trpcNext.createNextApiHandler({
  router: ledgerSyncRouter,
  onError: ({error}) => {
    console.warn('error', error)
  },
})

// This probably needs to be refactored into sync-backend package together with
// perhaps the cli package
// - [ ] Remove RouterContext no longer needed
// - [ ] Do the same logic for ledgerSyncCli httpServer that does not use next
export default identity<NextApiHandler>((req, res) => {
  // https://vercel.com/support/articles/how-to-enable-cors
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    console.log('Respond to OPTIONS request')
    res.status(200).end()
    return
  }

  const segments = req.query['trpc'] as [string] | string
  if (Array.isArray(segments) && parseWebhookRequest.isWebhook(segments)) {
    const {procedure, ...ret} = parseWebhookRequest({
      method: req.method,
      headers: req.headers,
      pathSegments: segments,
      query: req.query,
      body: req.body,
    })
    req.query = ret.query as typeof req['query']
    req.query['trpc'] = procedure
    req.body = ret.body
  }
  return handler(req, res)
})
