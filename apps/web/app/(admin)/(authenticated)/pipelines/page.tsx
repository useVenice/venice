'use client'

import {trpcReact} from '@usevenice/engine-frontend'
import {SchemaSheet, SchemaTable} from '@usevenice/ui'
import {z} from '@usevenice/util'

import {zId, ZRaw} from '@/../../packages/cdk-core'
import {RouterOutput} from '@/../../packages/engine-backend'

export default function PipelinesPage() {
  const res = trpcReact.listPipelines2.useQuery()

  return (
    <div className="p-6">
      <header className="flex items-center">
        <h2 className="mb-4 mr-auto text-2xl font-semibold tracking-tight">
          Pipelines
        </h2>
        <NewPipelineButton />
      </header>
      <p>
        Pipelines connect resources together by syncing data from source
        resource to destination resoruce
      </p>
      <SchemaTable
        items={res.data ?? []}
        columns={[
          {
            key: '$actions',
            title: '',
            render: (pipeline) => <NewPipelineButton pipeline={pipeline} />,
          },
          {key: 'id'},
          {key: 'sourceId'},
          {key: 'destinationId'},
          {key: 'lastSyncStartedAt'},
          {key: 'lastSyncCompletedAt'},
        ]}
      />
    </div>
  )
}

type Pipeline = RouterOutput['listPipelines2'][number]

export function NewPipelineButton(props: {pipeline?: Pipeline}) {
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
