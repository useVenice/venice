import '@usevenice/app-config/register.node'
import {joinPath} from '@usevenice/util'

import {NextApiHandler} from 'next'

import {proxySupabase} from '../../../lib/supabase-proxy'

// Enable `externalResolver` option in Next.js
export const config = {
  api: {externalResolver: true, bodyParser: false},
}

export default (async (req, res) =>
  proxySupabase(
    {req, res},
    joinPath('rest/v1/', req.url?.replace('/api/rest', '')),
  )) satisfies NextApiHandler
