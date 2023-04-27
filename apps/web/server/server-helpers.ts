import type {NextApiRequest, NextApiResponse} from 'next'

import {fromMaybeArray} from '@usevenice/util'
import {kAccessToken} from '../contexts/atoms'

import {createServerSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {dehydrate, QueryClient} from '@tanstack/react-query'
import {createServerSideHelpers} from '@trpc/react-query/server'
import {backendEnv} from '@usevenice/app-config/backendConfig'
import {
  xPatAppMetadataKey,
  xPatHeaderKey,
  xPatUrlParamKey,
} from '@usevenice/app-config/constants'
import {makeJwtClient} from '@usevenice/cdk-core'
import type {UserId, Viewer} from '@usevenice/cdk-core'
import {flatRouter} from '@usevenice/engine-backend'
import type {GetServerSidePropsContext} from 'next'
import superjson from 'superjson'
import type {SuperJSONResult} from 'superjson/dist/types'
import type {Database} from '../supabase/supabase.gen'
import {runAsAdmin, sql} from './procedures'

export interface PageProps {
  dehydratedState?: SuperJSONResult // SuperJSONResult<import('@tanstack/react-query').DehydratedState>
}

export async function createSSRHelpers(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient()
  const supabase = createServerSupabaseClient<Database>(context)

  const viewer = await serverGetViewer(context)
  await import('@usevenice/app-config/register.node')
  const {contextFactory} = await import('@usevenice/app-config/backendConfig')

  // TODO: figure out
  const ssg = createServerSideHelpers({
    queryClient,
    router: flatRouter,
    ctx: contextFactory.fromViewer(viewer),
    // transformer: superjson,
  })
  return {
    viewer,
    supabase,
    queryClient,
    ssg,
    getPageProps: (): PageProps => ({
      dehydratedState: superjson.serialize(dehydrate(queryClient)),
    }),
  }
}

/** Determine the current viewer in this order
 * access token via query param
 * access token via header
 * apiKey via query param
 * api key via header
 * next.js cookie
 * fall back to anon viewer
 */
export async function serverGetViewer(
  context:
    | GetServerSidePropsContext
    | {req: NextApiRequest; res: NextApiResponse},
): Promise<Viewer> {
  const jwt = makeJwtClient({
    secretOrPublicKey: backendEnv.JWT_SECRET_OR_PUBLIC_KEY,
  })
  // access token via query param
  let viewer = jwt.verifyViewer(
    fromMaybeArray(
      'query' in context
        ? context.query[kAccessToken]
        : context.req.query[kAccessToken],
    )[0],
  )
  if (viewer.role !== 'anon') {
    return viewer
  }
  // access token via header
  viewer = jwt.verifyViewer(
    context.req.headers.authorization?.match(/^Bearer (.+)/)?.[1],
  )
  if (viewer.role !== 'anon') {
    return viewer
  }

  // personal access token via query param or header
  const apiKey =
    fromMaybeArray(
      'query' in context
        ? context.query[xPatUrlParamKey]
        : context.req.query[xPatUrlParamKey],
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    )[0] || context.req.headers[xPatHeaderKey]

  if (apiKey) {
    const row = await runAsAdmin((pool) =>
      pool.maybeOne<{
        id: string
        raw_app_metadata: Record<string, unknown>
      }>(sql`
        SELECT id, raw_app_meta_data FROM auth.users
        WHERE raw_app_meta_data ->> ${xPatAppMetadataKey} = ${apiKey}
      `),
    )
    if (row) {
      return {role: 'user', userId: row.id as UserId}
    }
  }

  // access token via cookie
  const supabase = createServerSupabaseClient<Database>(context)

  const {data: sessionRes} = await supabase.auth.getSession()

  try {
    viewer = jwt.verifyViewer(sessionRes.session?.access_token)
    if (viewer.role !== 'anon') {
      return viewer
    }
  } catch (err) {
    console.warn(
      '[serverGetViewer] Error verifying cookie access token, will logout',
    )
    await supabase.auth.signOut()
    throw err
  }
  return {role: 'anon'}
}

/** For serverSideProps */
export async function serverGetUser(
  context:
    | GetServerSidePropsContext
    | {req: NextApiRequest; res: NextApiResponse},
) {
  const viewer = await serverGetViewer(context)
  if (viewer.role !== 'user') {
    return [null] as const
  }
  return [{id: viewer.userId}] as const
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
