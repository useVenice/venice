'use client'

import {PROVIDERS} from '@usevenice/app-config/env'
import {trpcReact} from '@usevenice/engine-frontend'
import {Button, Card} from '@usevenice/ui/new-components'

import {DataTable} from '@/components/DataTable'

export default function IntegrationsPage() {
  const integrationsRes = trpcReact.adminListIntegrations.useQuery()

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Configured integrations
      </h2>

      <DataTable
        isFetching={integrationsRes.isFetching}
        rows={integrationsRes.data ?? []}
      />
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Available integrations
      </h2>
      <div className="flex flex-wrap ">
        {PROVIDERS.map((provider) => (
          <Card
            key={provider.name}
            className="m-3 flex h-40 w-40 flex-col items-center p-2">
            <div className="grow"></div> {/* Placeholder for image */}
            <caption>{provider.name}</caption>
            <Button className="mt-2" variant="default">
              Add
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
