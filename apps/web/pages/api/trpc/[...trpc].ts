import '@usevenice/app-config/register.node'

import * as trpcNext from '@trpc/server/adapters/next'
import {getCookie} from 'cookies-next'
import type {NextApiHandler, NextApiRequest} from 'next'

import {syncEngine, veniceRouter} from '@usevenice/app-config/backendConfig'
import type {Id} from '@usevenice/cdk-core'
import {parseWebhookRequest} from '@usevenice/engine-backend'
import {kXLedgerId} from '@usevenice/engine-backend/auth-utils'
import {fromMaybeArray, R, safeJSONParse} from '@usevenice/util'

import {kAccessToken, kLedgerId} from '../../../contexts/atoms'

export function getAccessToken(req: NextApiRequest) {
  return (
    fromMaybeArray(req.query[kAccessToken] ?? [])[0] ??
    req.headers.authorization?.match(/^Bearer (.+)/)?.[1] ??
    R.pipe(
      getCookie(kAccessToken, {req}),
      (v) =>
        typeof v === 'string' ? (safeJSONParse(v) as unknown) : undefined,
      (v) => (typeof v === 'string' ? v : undefined),
    )
  )
}

const handler = trpcNext.createNextApiHandler({
  router: veniceRouter,
  createContext: ({req}) => {
    console.log('[createContext] Got ledgerId', {
      query: req.query,
      headers: req.headers,
    })
    const ctx = syncEngine.zContext.parse<'typed'>({
      accessToken: getAccessToken(req),
      ledgerId: fromMaybeArray(
        req.query[kLedgerId] ?? req.headers[kXLedgerId] ?? [],
      )[0] as Id['ldgr'] | undefined,
    })
    console.log('[createContext] Got ctx', ctx)
    return ctx
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
