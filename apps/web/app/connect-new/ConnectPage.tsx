'use client'

import {providerByName} from '@usevenice/app-config/providers'
import type {Viewer} from '@usevenice/cdk-core'
import {trpcReact, VeniceConnect} from '@usevenice/engine-frontend'

export default function ConnectPage({viewer}: {viewer: Viewer}) {
  const intsRes = trpcReact.listIntegrationInfos.useQuery({})

  // Should never happen because of pre-fetching
  if (!intsRes.data) {
    return <div>Loading...</div>
  }

  console.log('[ConnectPage] intsRes.data', intsRes.data)
  return (
    <VeniceConnect
      integrationIds={intsRes.data.map((int) => int.id)}
      endUserId={viewer.role === 'end_user' ? viewer.endUserId : null}
      providerMetaByName={providerByName}
    />
  )
}
