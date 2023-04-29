import '../../pages/global.css'
// TODO: Apply the font to this page only...
//  https://nextjs.org/docs/basic-features/font-optimization
// <link rel="preconnect" href="https://fonts.googleapis.com" />
// <link
//  rel="preconnect"
//  href="https://fonts.gstatic.com"
//  crossOrigin=""
// />
// <link
//  rel="stylesheet"
//  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap"
// />
// <link
//  href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
//  rel="stylesheet"
// />

import '@usevenice/app-config/register.node'

import {dehydrate, QueryClient} from '@tanstack/query-core'
import {createServerSideHelpers} from '@trpc/react-query/server'
import superjson from 'superjson'

import {backendEnv, contextFactory} from '@usevenice/app-config/backendConfig'
import {makeJwtClient} from '@usevenice/cdk-core'
import {flatRouter} from '@usevenice/engine-backend'
import {fromMaybeArray, z} from '@usevenice/util'

import {ensureDefaultResourceAndPipelines} from '@/server'

import {Connect} from './Connect'
import {ConnectClientRoot} from './ConnectClientRoot'

export const metadata = {
  title: 'Venice Connect',
}

/**
 * Workaround for searchParams being empty on production
 * @see https://github.com/vercel/next.js/issues/43077#issuecomment-1383742153
 */
export const dynamic = 'force-dynamic'

// TODO: Allow page to optionally load without token for performance then add token async
// Perhaps it would even be an advantage to have the page simply be static?
// Though that would result in waterfall loading of integrations

/** https://beta.nextjs.org/docs/api-reference/file-conventions/page#searchparams-optional */
export default async function ConnectPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const token = z.string().nullish().parse(searchParams['token'])
  if (!token) {
    return <div>Missing token</div>
  }

  // Need to create jwtClient in here vecause otherwise during vercel static pre-render
  // it would crash...
  // app-config/backendConfig does not work inside server components, so we will have to use this for now...
  const viewer = makeJwtClient({
    secretOrPublicKey: backendEnv.JWT_SECRET_OR_PUBLIC_KEY,
  }).verifyViewer(token)
  if (viewer.role !== 'end_user') {
    throw new Error('end user only route')
  }

  const queryClient = new QueryClient()
  const ssg = createServerSideHelpers({
    queryClient,
    router: flatRouter,
    ctx: contextFactory.fromViewer(viewer),
  })

  const [integrations] = await Promise.all([
    ssg.listIntegrationInfos.fetch({}),
    ssg.listConnections.prefetch({}),
  ])

  await ensureDefaultResourceAndPipelines(viewer.endUserId, {
    heronIntegrationId: integrations.find((i) => i.providerName === 'heron')
      ?.id,
  })

  return (
    <div className="h-screen w-screen bg-black text-offwhite" data-theme="dark">
      <ConnectClientRoot
        dehydratedState={superjson.serialize(dehydrate(queryClient))}
        accessToken={token}>
        <Connect
          integrations={integrations}
          displayName={
            fromMaybeArray(searchParams['displayName'])[0] ?? viewer.endUserId
          }
          redirectUrl={fromMaybeArray(searchParams['redirectUrl'])[0]}
        />
      </ConnectClientRoot>
    </div>
  )
}
