import '@usevenice/app-config/register.node'
import {joinPath} from '@usevenice/util'

import {NextApiHandler} from 'next'
import {serverAnalytics} from '../../../lib/server-analytics'

import {proxySupabase} from '../../../lib/supabase-proxy.server'

// Enable `externalResolver` option in Next.js
export const config = {
  api: {externalResolver: true, bodyParser: false},
}

export default (async (req, res) =>
  proxySupabase({
    req,
    res,
    targetPath: joinPath('graphql/v1', req.url?.replace('/api/graphql', '')),
    onUserId: (userId) => {
      if (userId) {
        serverAnalytics.track(userId, {name: 'api/graphql-request', data: {}})
      }
      return serverAnalytics.flush({ignoreErrors: true})
    },
  })) satisfies NextApiHandler
