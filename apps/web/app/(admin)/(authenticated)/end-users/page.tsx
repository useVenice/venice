'use client'

import {useAuth} from '@clerk/nextjs'
import {Copy, MoreHorizontal, RefreshCcw} from 'lucide-react'

import {getServerUrl} from '@usevenice/app-config/constants'
import type {RouterOutput} from '@usevenice/engine-backend'
import {trpcReact} from '@usevenice/engine-frontend'
import {DataTable} from '@usevenice/ui'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useToast,
} from '@usevenice/ui/new-components'

export default function EndUsersPage() {
  const res = trpcReact.adminSearchEndUsers.useQuery({})

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">End Users</h2>
      <DataTable
        query={res}
        columns={[
          {
            id: 'actions',
            cell: ({row}) => <EndUserMenu endUser={row.original} />,
          },
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

type EndUser = RouterOutput['adminSearchEndUsers'][number]

function EndUserMenu({endUser}: {endUser: EndUser}) {
  const {toast} = useToast()
  const createConnectToken = trpcReact.adminCreateConnectToken.useMutation({})
  const {orgId} = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(endUser.id)}>
          <Copy className="mr-2 h-4 w-4" />
          <div>
            Copy End User ID
            <br />
            <pre className="text-muted-foreground">{endUser.id}</pre>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            if (orgId) {
              void createConnectToken
                .mutateAsync({endUserId: endUser.id, orgId})
                .then((token) => {
                  // Could be a problem if this is blocked by a popup blocker
                  const url = new URL('/connect', getServerUrl(null))
                  url.searchParams.set('token', token)
                  window.open(url)
                })
            }
          }}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          View portal
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
