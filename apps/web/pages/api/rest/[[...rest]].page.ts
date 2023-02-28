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
  proxySupabase(
    {
      req,
      res,
      onUserId: (userId) => {
        if (userId) {
          serverAnalytics.track(userId, {name: 'api/rest-request', data: {}})
        }
        return serverAnalytics.flush()
      },
    },
    joinPath('rest/v1/', req.url?.replace('/api/rest', '')),
  )) satisfies NextApiHandler
