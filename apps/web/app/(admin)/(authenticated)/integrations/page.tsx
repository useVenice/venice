'use client'

import {trpcReact} from '@usevenice/engine-frontend'

import {DataTable} from '@/components/DataTable'

export default function IntegrationsPage() {
  const integrationsRes = trpcReact.adminListIntegrations.useQuery()

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Integrations
      </h2>
      <DataTable
        isFetching={integrationsRes.isFetching}
        rows={integrationsRes.data ?? []}
      />
    </div>
  )
}
