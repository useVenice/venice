'use client'

import {trpcReact} from '@usevenice/engine-frontend'

import {DataTable} from '@/components/DataTable'

export default function PipelinesPage() {
  const res = trpcReact.listPipelines.useQuery()

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Pipelines</h2>
      <DataTable isFetching={res.isFetching} rows={res.data ?? []} />
    </div>
  )
}