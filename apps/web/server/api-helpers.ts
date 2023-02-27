import {getCookie} from 'cookies-next'
import type {NextApiRequest, NextApiResponse} from 'next'

import {fromMaybeArray, R, safeJSONParse} from '@usevenice/util'
import {kAccessToken} from '../contexts/atoms'

import {createServerSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {dehydrate, QueryClient} from '@tanstack/react-query'
import {createProxySSGHelpers} from '@trpc/react-query/ssg'
import type {UserId} from '@usevenice/cdk-core'
import type {GetServerSidePropsContext} from 'next'
import superjson from 'superjson'
import type {SuperJSONResult} from 'superjson/dist/types'
import type {Database} from '../supabase/supabase.gen'
import {makeJwtClient} from '@usevenice/engine-backend'
import {backendEnv} from '@usevenice/app-config/backendConfig'
export interface PageProps {
  dehydratedState?: SuperJSONResult // SuperJSONResult<import('@tanstack/react-query').DehydratedState>
}

export async function createSSRHelpers(
  context:
    | GetServerSidePropsContext
    | {req: NextApiRequest; res: NextApiResponse},
) {
  const queryClient = new QueryClient()

  const [user, supabase] = await serverGetUser(context)
  await import('@usevenice/app-config/register.node')
  const {veniceRouter} = await import('@usevenice/app-config/backendConfig')

  const ssg = createProxySSGHelpers({
    queryClient,
    router: veniceRouter,
    ctx: {userId: user?.id as UserId | undefined},
    // transformer: superjson,
  })
  return {
    user,
    supabase,
    queryClient,
    ssg,
    getPageProps: (): PageProps => ({
      dehydratedState: superjson.serialize(dehydrate(queryClient)),
    }),
  }
}

/** For serverSideProps */
export async function serverGetUser(
  context:
    | GetServerSidePropsContext
    | {req: NextApiRequest; res: NextApiResponse},
) {
  const supabase = createServerSupabaseClient<Database>(context)
  // TODO: Consider returning access token
  const {data: sessionRes} = await supabase.auth.getSession()

  console.log('[createSSRHelpers] session', {
    session: sessionRes.session,
    NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL'],
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  })
  if (!sessionRes.session) {
    return [null, supabase] as const
  }
  const {access_token, user} = sessionRes.session
  // Should we rely on supabase at all given that they don't verify against JWT token?
  try {
    makeJwtClient({
      secretOrPublicKey: backendEnv.JWT_SECRET_OR_PUBLIC_KEY!,
    }).verify(access_token)
    return [user, supabase] as const
  } catch (err) {
    console.warn(
      '[serverGetUser] Error verifying user access token, will logout',
    )
    await supabase.auth.signOut()
    throw err
    // return [null, supabase] as const
  }
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
