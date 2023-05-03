import {SuperHydrate} from '@/components/SuperHydrate'
import {createServerComponentHelpers} from '@/server/server-component-helpers'

import _ResourcePage from './ResourcesPage'

export default async function ResourcesPage() {
  const {ssg, getDehydratedState} = await createServerComponentHelpers()

  await Promise.all([
    ssg.listIntegrationInfos.fetch({}),
    ssg.listConnections.prefetch({}),
  ])

  // Anyway to stream the preConnect response to client so client does not
  // have to make a round-trip? We don't want to do it right away
  // because we do not want to block the initial page load on 3rd party API endpoints
  // await integrations.map(
  //   ssg.preConnect()
  // )

  return (
    <SuperHydrate dehydratedState={getDehydratedState()}>
      <_ResourcePage />
    </SuperHydrate>
  )
}
