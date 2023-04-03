import '@usevenice/app-config/register.node'

import {backendEnv, veniceRouter} from '@usevenice/app-config/backendConfig'

import {
  makeJwtClient,
  zVeniceConnectJwtPayload,
} from '@usevenice/engine-backend'

import {dehydrate, QueryClient} from '@tanstack/query-core'
import {createProxySSGHelpers} from '@trpc/react-query/ssg'
import {fromMaybeArray, z} from '@usevenice/util'
import superjson from 'superjson'
import {ensureDefaultLedger} from '../../server'
import {ClientRoot} from '../ClientRoot'
import {Connect} from './Connect'

export const metadata = {
  title: 'Venice Connect',
}

/**
 * Workaround for searchParams being empty on production
 * @see https://github.com/vercel/next.js/issues/43077#issuecomment-1383742153
 */
export const dynamic = 'force-dynamic'

/** https://beta.nextjs.org/docs/api-reference/file-conventions/page#searchparams-optional */
export default async function ConnectPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  if (!searchParams['token']) {
    return <div>Missing token</div>
  }
  const token = z.string().parse(searchParams['token'])

  // Need to create jwtClient in here vecause otherwise during vercel static pre-render
  // it would crash...
  const jwtClient = makeJwtClient({
    // app-config/backendConfig does not work inside server components, so we will have to use this for now...
    secretOrPublicKey: backendEnv.JWT_SECRET_OR_PUBLIC_KEY,
  })
  const payload = zVeniceConnectJwtPayload.parse(jwtClient.verify(token))
  const userId = payload.sub
  const queryClient = new QueryClient()
  const ssg = createProxySSGHelpers({
    queryClient,
    router: veniceRouter,
    ctx: {userId},
  })

  const [integrations] = await Promise.all([
    ssg.listIntegrations.fetch({}),
    ssg.listConnections.prefetch({}),
  ])

  const ledgerIds = await ensureDefaultLedger(userId)

  return (
    <ClientRoot
      dehydratedState={superjson.serialize(dehydrate(queryClient))}
      accessToken={token}>
      <Connect
        integrations={integrations}
        displayName={fromMaybeArray(searchParams['displayName'])[0] ?? userId}
        redirectUrl={fromMaybeArray(searchParams['redirectUrl'])[0]}
        ledgerIds={ledgerIds}
      />
    </ClientRoot>
  )
}
