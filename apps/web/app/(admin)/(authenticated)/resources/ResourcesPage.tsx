'use client'

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from '@tremor/react'
import {Loader2, Radio} from 'lucide-react'

import {providerByName} from '@usevenice/app-config/providers'
import type {RouterOutput} from '@usevenice/engine-backend'
import {trpcReact, VeniceConnectButton} from '@usevenice/engine-frontend'

type Resource = RouterOutput['listConnections'][number]

export default function ResourcesPage() {
  const res = trpcReact.listConnections.useQuery({})
  const infos = trpcReact.listIntegrationInfos.useQuery({})

  if (!res.data || !infos.data) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <header className="flex items-center">
        <h2 className="mb-4 mr-auto text-2xl font-semibold tracking-tight">
          Resources
        </h2>
        <VeniceConnectButton
          endUserId={null}
          integrationIds={infos.data.map((i) => i.id)}
          providerMetaByName={providerByName}
        />
      </header>
      <p>Resources are created based on integration configurations</p>
      {res.isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      <ResourcesTable resources={res.data} />
    </div>
  )
}

// TODO: Abstract to introduce the definition of `column` so we don't need to manually
// sync order between header and body...
export const ResourcesTable = (props: {resources: Resource[]}) => (
  // overflow-x-scroll Didn't work. Ideally we would like to always show a table with scrollbar
  <Table className="mt-5">
    <TableHead>
      <TableRow>
        <TableHeaderCell>Status</TableHeaderCell>
        <TableHeaderCell>ID</TableHeaderCell>
        <TableHeaderCell>Integration</TableHeaderCell>
        <TableHeaderCell>Institution</TableHeaderCell>
        <TableHeaderCell>End user Id</TableHeaderCell>
        <TableHeaderCell>Settings</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {props.resources.map((reso) => (
        <TableRow key={reso.id}>
          <TableCell>
            <Badge color="emerald" icon={Radio}>
              {reso.status}
            </Badge>
          </TableCell>
          <TableCell>{reso.id}</TableCell>
          <TableCell>
            <Text>{reso.integrationId}</Text>
          </TableCell>
          <TableCell>
            <Text>{reso.institutionId}</Text>
          </TableCell>
          <TableCell>
            <Text>{reso.endUserId}</Text>
          </TableCell>
          <TableCell>
            <Text>...</Text>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
