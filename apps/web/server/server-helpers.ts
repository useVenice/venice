import {auth as serverComponentGetAuth} from '@clerk/nextjs'
import {getAuth} from '@clerk/nextjs/server'
import {dehydrate, QueryClient} from '@tanstack/react-query'
import {createServerSideHelpers} from '@trpc/react-query/server'
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import type {ReadonlyHeaders} from 'next/dist/server/web/spec-extension/adapters/headers'
import type {ReadonlyRequestCookies} from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import superjson from 'superjson'
import type {SuperJSONResult} from 'superjson/dist/types'

import {backendEnv, contextFactory} from '@usevenice/app-config/backendConfig'
import {
  xPatAppMetadataKey,
  xPatHeaderKey,
  xPatUrlParamKey,
} from '@usevenice/app-config/constants'
import type {Id, UserId, Viewer} from '@usevenice/cdk-core'
import {makeJwtClient} from '@usevenice/cdk-core'
import {flatRouter} from '@usevenice/engine-backend'
import {fromMaybeArray} from '@usevenice/util'

import {kAccessToken} from '../lib/constants'
import {runAsAdmin, sql} from './procedures'

export interface PageProps {
  dehydratedState?: SuperJSONResult // SuperJSONResult<import('@tanstack/react-query').DehydratedState>
}

type NextContext =
  | {req: NextApiRequest; res: NextApiResponse} // Next.js 12 api routes
  | GetServerSidePropsContext // Next.js 12 pages/
  // Next.js 13 server components
  | {
      headers?: () => ReadonlyHeaders
      cookies?: () => ReadonlyRequestCookies
      /** Query Params */
      searchParams?:
        | Record<string, string[] | string | undefined>
        | URLSearchParams
    }

export async function createSSRHelpers(context: NextContext) {
  // TODO: Remove this once we fully migrate off next.js 12 routing
  await import('@usevenice/app-config/register.node')

  const queryClient = new QueryClient()
  const viewer = await serverGetViewer(context)

  const ctx = contextFactory.fromViewer(viewer)

  const ssg = createServerSideHelpers({
    queryClient,
    router: flatRouter,
    ctx,
    // transformer: superjson,
  })
  return {
    viewer,
    ssg,
    ctx,
    getDehydratedState: () => superjson.serialize(dehydrate(queryClient)),
    /** @deprecated */
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
 * TODO: Figure out how to have the result of this function cached for the duration of the request
 * much like we cache
 */
export async function serverGetViewer(
  context: NextContext,
  // This is a hack for not knowing how else to return accessToken...
  // and not wanting it to add it to the super simple viewer interface just yet
  // Fwiw this is only used for the /connect experience and not generally otherwise
): Promise<Viewer & {accessToken?: string | null}> {
  const jwt = makeJwtClient({
    secretOrPublicKey: backendEnv.JWT_SECRET_OR_PUBLIC_KEY,
  })
  const headers =
    'req' in context
      ? context.req.headers
      : Object.fromEntries(context.headers?.().entries() ?? [])
  const searchParams =
    ('query' in context
      ? context.query
      : 'req' in context
      ? context.req.query
      : context.searchParams instanceof URLSearchParams
      ? Object.fromEntries(context.searchParams.entries())
      : context.searchParams) ?? {}

  // access token via query param
  let accessToken = fromMaybeArray(searchParams[kAccessToken])[0]
  let viewer = jwt.verifyViewer(accessToken)
  if (viewer.role !== 'anon') {
    return {...viewer, accessToken}
  }
  // access token via header
  accessToken = headers.authorization?.match(/^Bearer (.+)/)?.[1]
  viewer = jwt.verifyViewer(accessToken)
  if (viewer.role !== 'anon') {
    return {...viewer, accessToken}
  }

  // personal access token via query param or header
  const apiKey =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    fromMaybeArray(searchParams[xPatUrlParamKey])[0] || headers[xPatHeaderKey]

  // No more api keys, gotta fix me here.
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

  const auth =
    'req' in context ? getAuth(context.req) : serverComponentGetAuth()
  if (auth.userId) {
    return {
      role: 'user',
      userId: auth.userId as UserId,
      orgId: auth.orgId as Id['org'],
    }
  }

  return {role: 'anon'}
}

/** @deprecated For serverSideProps */
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
