import '@usevenice/app-config/register.node'

import {backendEnv, veniceRouter} from '@usevenice/app-config/backendConfig'
import type {UserId} from '@usevenice/cdk-core'

import {makeJwtClient} from '@usevenice/engine-backend'

import {dehydrate, QueryClient} from '@tanstack/query-core'
import {createProxySSGHelpers} from '@trpc/react-query/ssg'
import {z} from '@usevenice/util'
import superjson from 'superjson'
import {ClientRoot} from '../ClientRoot'
import {Connect} from './Connect'
import {ensureDefaultLedger} from '../../server'

export const metadata = {
  title: 'Venice Connect',
}

const jwtClient = makeJwtClient({
  // app-config/backendConfig does not work inside server components, so we will have to use this for now...
  secretOrPublicKey: backendEnv.JWT_SECRET_OR_PUBLIC_KEY,
})

/** https://beta.nextjs.org/docs/api-reference/file-conventions/page#searchparams-optional */
export default async function ConnectPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const token = z.string().parse(searchParams['token'])

  const payload = jwtClient.verify(token)
  const userId = payload.sub as UserId
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
        displayName={userId}
        ledgerIds={ledgerIds}
      />
    </ClientRoot>
  )
}
