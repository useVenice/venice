import {getViewerId} from '@usevenice/cdk-core'

import {SuperHydrate} from '@/components/SuperHydrate'
import {ClientRoot} from '@/contexts/ClientRoot'
import {createServerComponentHelpers} from '@/server/server-component-helpers'

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
  const {ssg, getDehydratedState, viewer} = await createServerComponentHelpers({
    params: {_token: searchParams['token']},
  })
  if (viewer.role !== 'end_user') {
    return (
      <div>Authenticated user only. Your role is {getViewerId(viewer)}</div>
    )
  }

  await Promise.all([
    ssg.listIntegrationInfos.prefetch({}),
    ssg.listConnections.prefetch({}),
  ])

  return (
    <div className="h-screen w-screen p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Venice Connect
      </h2>
      <ClientRoot accessToken={viewer.accessToken} authStatus="success">
        <SuperHydrate dehydratedState={getDehydratedState()}>
          <ConnectPage />
        </SuperHydrate>
      </ClientRoot>
    </div>
  )
}
