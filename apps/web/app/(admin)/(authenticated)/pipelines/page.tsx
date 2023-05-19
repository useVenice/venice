'use client'

import {MoreHorizontal} from 'lucide-react'

import {zId} from '@usevenice/cdk-core'
import type {RouterOutput} from '@usevenice/engine-backend'
import {trpcReact} from '@usevenice/engine-frontend'
import {DataTable, SchemaSheet} from '@usevenice/ui'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@usevenice/ui/new-components'
import {z} from '@usevenice/util'

export default function PipelinesPage() {
  const res = trpcReact.listPipelines2.useQuery()

  return (
    <div className="p-6">
      <header className="flex items-center">
        <h2 className="mb-4 mr-auto text-2xl font-semibold tracking-tight">
          Pipelines
        </h2>
        <PipelineSheetButton />
      </header>
      <p>
        Pipelines connect resources together by syncing data from source
        resource to destination resoruce
      </p>
      <DataTable
        data={res.data ?? []}
        columns={[
          {
            id: 'actions',
            enableHiding: false,
            cell: ({row}) => {
              const pipeline = row.original
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
                      onClick={() =>
                        navigator.clipboard.writeText(pipeline.id)
                      }>
                      Copy pipeline ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View customer</DropdownMenuItem>
                    <DropdownMenuItem>View pipeline details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            },
          },
          {
            accessorKey: 'id',
            header: 'ID',
            cell: ({row}) => <pre>{row.getValue('id')}</pre>,
          },
          {
            accessorKey: 'sourceId',
            header: 'Source Id',
            cell: ({row}) => <pre>{row.getValue('sourceId')}</pre>,
          },
          {
            accessorKey: 'destinationId',
            header: 'Destination Id',
            cell: ({row}) => <pre>{row.getValue('destinationId')}</pre>,
          },

          // {key: 'lastSyncStartedAt'},
          // {key: 'lastSyncCompletedAt'},
        ]}
      />
      {/* <SchemaTable
        items={res.data ?? []}
        columns={[
          {
            key: '$actions',
            title: '',
            render: (pipeline) => <PipelineSheetButton pipeline={pipeline} />,
          },
          {key: 'id'},
          {key: 'sourceId'},
          {key: 'destinationId'},
          {key: 'lastSyncStartedAt'},
          {key: 'lastSyncCompletedAt'},
        ]}
      /> */}
    </div>
  )
}

type Pipeline = RouterOutput['listPipelines2'][number]

export function PipelineSheetButton(props: {pipeline?: Pipeline}) {
  const resourcesRes = trpcReact.listResources.useQuery()

  const zResoId = z.enum((resourcesRes.data ?? []).map((r) => r.id) as [string])
  // Filter for only sources vs destinations when saving...
  // This is where it would be a nice advantage to use something like an Airbyte
  // so we don't have to build the whole admin ui
  // But then that won't work if admin ui cannot be embedded
  const formSchema = z.object({
    ...(props.pipeline && ({id: zId('pipe')} as {})),
    sourceId: zResoId,
    destinationId: zResoId,
    sourceState: z.record(z.any()).optional(),
    destinationState: z.record(z.any()).optional(),
  })

  const upsertPipeline = trpcReact.adminUpsertPipeline.useMutation()
  return (
    <SchemaSheet
      title={props.pipeline ? 'Edit' : 'New Pipeline'}
      buttonProps={{variant: props.pipeline ? 'ghost' : 'default'}}
      formProps={{uiSchema: {id: {'ui:readonly': true}}}}
      schema={formSchema}
      mutation={upsertPipeline}
      initialValues={props.pipeline}
    />
  )
}
