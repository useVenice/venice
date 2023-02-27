import '@usevenice/app-config/register.node'
import {joinPath} from '@usevenice/util'

import {NextApiHandler} from 'next'

import {proxySupabase} from '../../../lib/supabase-proxy.server'

// Enable `externalResolver` option in Next.js
export const config = {
  api: {externalResolver: true, bodyParser: false},
}

export default (async (req, res) =>
  proxySupabase(
    {req, res},
    joinPath('graphql/v1', req.url?.replace('/api/graphql', '')),
  )) satisfies NextApiHandler
