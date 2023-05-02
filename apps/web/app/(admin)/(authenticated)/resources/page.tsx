'use client'

import {providerByName} from '@usevenice/app-config/providers'
import {trpcReact, VeniceConnect} from '@usevenice/engine-frontend'

import {DataTable} from '@/components/DataTable'

export default function ResourcesPage() {
  const res = trpcReact.listConnections.useQuery()

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Resources</h2>
      <p>Resources are created based on integration configurations</p>
      <VeniceConnect
        endUserId={null}
        integrationIds={['int_postgres_01GZDSYE062G2CE5V4WE5Z004M']}
        providerMetaByName={providerByName}
      />
      <DataTable isFetching={res.isFetching} rows={res.data ?? []} />
    </div>
  )
}
