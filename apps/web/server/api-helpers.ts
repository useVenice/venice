import {getCookie} from 'cookies-next'
import type {NextApiRequest, NextApiResponse} from 'next'

import {fromMaybeArray, R, safeJSONParse} from '@usevenice/util'
import {kAccessToken} from '../contexts/atoms'

import {createServerSupabaseClient} from '@supabase/auth-helpers-nextjs'
import type {GetServerSidePropsContext} from 'next'
import type {Database} from '../lib/supabase.gen'

/** For serverSideProps */
export async function serverGetUser(context: GetServerSidePropsContext) {
  const supabase = createServerSupabaseClient<Database>(context)
  const {data: sessionRes} = await supabase.auth.getSession()
  return sessionRes.session?.user
}

/** For API endpoints. Consider using supabase nextjs auth helper too */
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

export function respondToCORS(req: NextApiRequest, res: NextApiResponse) {
  // https://vercel.com/support/articles/how-to-enable-cors

  res.setHeader('Access-Control-Allow-Credentials', 'true')
  // Need to use the request origin for credentials-mode "include" to work
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*')
  // prettier-ignore
  res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method'] ?? '*')
  // prettier-ignore
  res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] ?? '*')
  if (req.method === 'OPTIONS') {
    console.log('Respond to OPTIONS request', req.headers.origin)
    res.status(200).end()
    return true
  }
  return false
}
