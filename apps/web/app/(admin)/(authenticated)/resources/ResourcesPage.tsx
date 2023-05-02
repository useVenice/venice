'use client'

import {providerByName} from '@usevenice/app-config/providers'
import {trpcReact, VeniceConnect} from '@usevenice/engine-frontend'

import {DataTable} from '@/components/DataTable'

export default function ResourcesPage() {
  const res = trpcReact.listConnections.useQuery({})
  const infos = trpcReact.listIntegrationInfos.useQuery({})

  if (!res.data || !infos.data) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Resources</h2>
      <p>Resources are created based on integration configurations</p>
      <VeniceConnect
        endUserId={null}
        integrationIds={infos.data.map((i) => i.id)}
        providerMetaByName={providerByName}
      />
      <DataTable isFetching={res.isFetching} rows={res.data ?? []} />
    </div>
  )
}
