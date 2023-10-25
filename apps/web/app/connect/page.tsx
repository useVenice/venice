import {clerkClient} from '@clerk/nextjs'
import Image from 'next/image'
import {redirect} from 'next/navigation'

import {env} from '@usevenice/app-config/env'
import {defIntegrations} from '@usevenice/app-config/integrations/integrations.def'
import type {IntegrationDef} from '@usevenice/cdk-core'
import {
  extractProviderName,
  getViewerId,
  makeId,
  makeNangoClient,
} from '@usevenice/cdk-core'
import {zConnectPageParams} from '@usevenice/engine-backend/router/endUserRouter'
import {makeUlid} from '@usevenice/util'

import {ClientRoot} from '@/components/ClientRoot'
import {SuperHydrate} from '@/components/SuperHydrate'
import {createServerComponentHelpers} from '@/lib-server/server-component-helpers'

import ConnectPage from './ConnectPage'

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
    searchParams: {_token: token},
  })
  if (viewer.role !== 'end_user') {
    return (
      <div>Authenticated user only. Your role is {getViewerId(viewer)}</div>
    )
  }

  // Special case when we are handling a single oauth integration
  if (params.integrationId) {
    const providerName = extractProviderName(params.integrationId)
    const intDef = defIntegrations[
      providerName as keyof typeof defIntegrations
    ] as IntegrationDef

    if (intDef.metadata?.nangoProvider) {
      const nango = makeNangoClient({secretKey: env.NANGO_SECRET_KEY})
      const url = await nango.getOauthConnectUrl({
        public_key: env.NEXT_PUBLIC_NANGO_PUBLIC_KEY,
        connection_id: makeId('reso', providerName, makeUlid()),
        provider_config_key: params.integrationId,
        // Consider using hookdeck so we can work with any number of urls
        // redirect_uri: joinPath(getServerUrl(null), '/connect/callback'),
      })
      return redirect(url)
    }
  }

  const [org] = await Promise.all([
    clerkClient.organizations.getOrganization({organizationId: viewer.orgId}),
    ssg.listIntegrationInfos.prefetch({id: params.integrationId}),
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
