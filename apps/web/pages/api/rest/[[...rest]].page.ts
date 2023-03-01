import '@usevenice/app-config/register.node'
import {joinPath, R} from '@usevenice/util'

import {NextApiHandler} from 'next'
import modifyResponse from 'node-http-proxy-json'
import {serverAnalytics} from '../../../lib/server-analytics'

import {getRestEndpoint} from '@usevenice/app-config/constants'
import type {Spec as Swagger2Spec} from 'swagger-schema-official'
import {proxySupabase} from '../../../lib/supabase-proxy.server'

// Enable `externalResolver` option in Next.js
export const config = {
  api: {externalResolver: true, bodyParser: false},
}

export default (async (req, res) => {
  const path = req.url?.replace('/api/rest', '')
  const restEndpoint = getRestEndpoint(req)

  return proxySupabase({
    req,
    res,
    targetPath: joinPath('rest/v1/', path),
    onUserId: (userId) => {
      if (userId) {
        serverAnalytics.track(userId, {name: 'api/rest-request', data: {}})
      }
      return serverAnalytics.flush()
    },
    onProxyRes: (proxyRes) => {
      // Only modify the open API response document, let others pass through
      if (path !== '') {
        return
      }
      modifyResponse<Swagger2Spec>(res, proxyRes, (data) => ({
        ...data,
        host: restEndpoint.host,
        basePath: restEndpoint.pathname,
        info: {
          description:
            'Venice: open source infrastructure to enable the frictionless movement of financial data.',
          title: 'Venice REST API',
          version: '2023-02-26',
        },
        schemes: [restEndpoint.protocol.replace(':', '')],
        // Remove RPC calls to be less confusing for users
        paths: R.pipe(
          data.paths,
          R.toPairs,
          R.filter(([path]) => !path.startsWith('/rpc')),
          R.sortBy(([path]) => path),
          R.fromPairs,
        ) as Record<string, any>,
        definitions: R.pipe(
          data.definitions ?? {},
          R.toPairs,
          R.sortBy(([name]) => name),
          R.fromPairs,
        ) as Record<string, any>,
      }))
    },
  })
}) satisfies NextApiHandler
