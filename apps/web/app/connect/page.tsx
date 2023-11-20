import {clerkClient} from '@clerk/nextjs'
import Image from 'next/image'

import {defConnectors} from '@usevenice/app-config/connectors/connectors.def'
import {kAccessToken} from '@usevenice/app-config/constants'
import {env} from '@usevenice/app-config/env'
import type {ConnectorDef} from '@usevenice/cdk'
import {
  extractConnectorName,
  getViewerId,
  makeId,
  makeNangoClient,
  zId,
} from '@usevenice/cdk'
import {zConnectPageParams} from '@usevenice/engine-backend/router/endUserRouter'
import {makeUlid, z} from '@usevenice/util'

import {ClientRoot} from '@/components/ClientRoot'
import {SuperHydrate} from '@/components/SuperHydrate'
import {createServerComponentHelpers} from '@/lib-server/server-component-helpers'

import ConnectPage from './ConnectPage'
import {SetCookieAndRedirect} from './SetCookieAndRedirect'

export const kConnectSession = 'connect-session'

type ConnectSession = z.infer<typeof zConnectSession>
export const zConnectSession = z.object({
  token: z.string(),
  resourceId: zId('reso'),
})

export const metadata = {
  title: 'Venice Connect',
}

/**
 * Workaround for searchParams being empty on production. Will ahve to check
 * @see https://github.com/vercel/next.js/issues/43077#issuecomment-1383742153
 */
export const dynamic = 'force-dynamic'

// Should we allow page to optionally load without token for performance then add token async
// Perhaps it would even be an advantage to have the page simply be static?
// Though that would result in waterfall loading of integrations

/** https://beta.nextjs.org/docs/api-reference/file-conventions/page#searchparams-optional */
export default async function ConnectPageContainer({
  searchParams,
}: {
  // Only accessible in PageComponent rather than layout component
  // @see https://github.com/vercel/next.js/issues/43704
  searchParams: Record<string, string | string[] | undefined>
}) {
  const {token, ...params} = zConnectPageParams.parse(searchParams)
  const {ssg, getDehydratedState, viewer} = await createServerComponentHelpers({
    searchParams: {[kAccessToken]: token},
  })
  if (viewer.role !== 'end_user') {
    return (
      <div>Authenticated user only. Your role is {getViewerId(viewer)}</div>
    )
  }

  // Implement shorthand for specifying only integrationId by connectorName
  let integrationId = params.integrationId
  if (!integrationId && params.connectorName) {
    const ints = await ssg.listIntegrationInfos.fetch({
      connectorName: params.connectorName,
    })
    if (ints.length === 1 && ints[0]?.id) {
      integrationId = ints[0]?.id
    } else if (ints.length < 1) {
      return <div>No integration for {params.connectorName} configured</div>
    } else if (ints.length > 1) {
      console.warn(
        `${ints.length} integrations found for ${params.connectorName}`,
      )
    }
  }

  // Special case when we are handling a single oauth integration
  if (integrationId) {
    const connectorName = extractConnectorName(integrationId)
    const intDef = defConnectors[
      connectorName as keyof typeof defConnectors
    ] as ConnectorDef

    if (intDef.metadata?.nangoProvider) {
      const nango = makeNangoClient({secretKey: env.NANGO_SECRET_KEY})
      const resourceId = makeId('reso', connectorName, makeUlid())
      const url = await nango.getOauthConnectUrl({
        public_key: env.NEXT_PUBLIC_NANGO_PUBLIC_KEY,
        connection_id: resourceId,
        provider_config_key: integrationId,
        // Consider using hookdeck so we can work with any number of urls
        // redirect_uri: joinPath(getServerUrl(null), '/connect/callback'),
      })
      return (
        <SetCookieAndRedirect
          cookies={[
            {
              key: kConnectSession,
              value: JSON.stringify({
                resourceId,
                token,
              } satisfies ConnectSession),
              // https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7%7Cthe
              // Need sameSite to be lax in order for this to work
              options: {maxAge: 3600, sameSite: 'lax'},
            },
          ]}
          redirectUrl={url}
        />
      )
    }
  }

  const [org] = await Promise.all([
    clerkClient.organizations.getOrganization({organizationId: viewer.orgId}),
    // Switch to using react suspense / server fetch for this instead of prefetch
    ssg.listIntegrationInfos.prefetch({
      id: integrationId,
      connectorName: params.connectorName,
    }),
    params.showExisting ? ssg.listConnections.prefetch({}) : Promise.resolve(),
  ])

  return (
    <div className="h-screen w-screen p-6">
      <header className="flex items-center">
        <Image
          width={50}
          height={50}
          alt={org.slug ?? ''}
          src={org.logoUrl ?? org.experimental_imageUrl}
          className="mr-4 rounded-lg"
        />
        <h2 className="text-2xl font-semibold tracking-tight">
          {params.displayName ?? `${org.name} - ${viewer.endUserId}`}
        </h2>
      </header>
      <ClientRoot accessToken={viewer.accessToken} authStatus="success">
        <SuperHydrate dehydratedState={getDehydratedState()}>
          <ConnectPage {...params} />
        </SuperHydrate>
      </ClientRoot>
    </div>
  )
}
