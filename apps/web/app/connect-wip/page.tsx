import '@usevenice/app-config/register.node'

import {backendEnv, veniceRouter} from '@usevenice/app-config/backendConfig'
import type {UserId} from '@usevenice/cdk-core'

import {makeJwtClient} from '@usevenice/engine-backend'

import {z} from '@usevenice/util'

export const metadata = {
  title: 'Venice Connect',
}

const jwtClient = makeJwtClient({
  // app-config/backendConfig does not work inside server components, so we will have to use this for now...
  secretOrPublicKey: backendEnv.JWT_SECRET_OR_PUBLIC_KEY,
})

/** https://beta.nextjs.org/docs/api-reference/file-conventions/page#searchparams-optional */
export default async function Connect({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const token = z.string().parse(searchParams['token'])
  const payload = jwtClient.verify(token)

  const caller = veniceRouter.createCaller({userId: payload.sub as UserId})
  const integrations = await caller.listIntegrations({})
  const connections = await caller.listConnections({})

  // const caller = veniceRouter

  return (
    <div>
      <h1>Venice connect </h1>
      <pre>{JSON.stringify(payload, null, 2)}</pre>
      <pre>{JSON.stringify(integrations, null, 2)}</pre>
      <pre>{JSON.stringify(connections, null, 2)}</pre>
    </div>
  )
}
