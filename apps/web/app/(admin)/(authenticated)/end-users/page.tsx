'use client'

import {trpcReact} from '@usevenice/engine-frontend'
import {DataTable} from '@usevenice/ui'

export default function EndUsersPage() {
  const res = trpcReact.adminSearchEndUsers.useQuery(
    {},
    // Cannot have null for id, otherwise globalFilter gets broken...
    {select: (rows) => rows.map((row) => ({...row, id: row.id || ''}))},
  )

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">End Users</h2>
      <DataTable
        query={res}
        columns={[
          {
            accessorKey: 'id',
            header: 'ID',
            // cell: ({row}) => <pre>{row.getValue('id')}</pre>,
          },
          {
            accessorKey: 'resourceCount',
            header: '# Resources',
            // cell: ({row}) => <pre>{row.getValue('resourceCount')}</pre>,
          },
          {
            accessorKey: 'firstCreatedAt',
            header: 'First created',
            // cell: ({row}) => <pre>{row.getValue('firstCreatedAt')}</pre>,
          },
          {
            accessorKey: 'lastUpdatedAt',
            header: 'Last updated',
            // cell: ({row}) => <pre>{row.getValue('lastUpdatedAt')}</pre>,
          },
        ]}
      />
    </div>
  )
}
