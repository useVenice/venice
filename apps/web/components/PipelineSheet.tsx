'use client'

import React from 'react'
import {zId} from '@usevenice/cdk'
import {_trpcReact} from '@usevenice/engine-frontend'
import type {SchemaSheetRef} from '@usevenice/ui'
import {SchemaSheet} from '@usevenice/ui'
import {z} from '@usevenice/util'
import type {ZClient} from '@/lib-common/schemas'

/** TODO: See if we can eliminate the need having entity specific sheets */
export const PipelineSheet = React.forwardRef(function PipelineSheet(
  props: {pipeline?: ZClient['pipeline']; triggerButton?: boolean},
  ref: SchemaSheetRef,
) {
  const resourcesRes = _trpcReact.listResources.useQuery()

  const zResoId = z.union(
    (resourcesRes.data ?? []).map((r) =>
      z
        .literal(r.id)
        .openapi({title: r.displayName ? `${r.displayName} <${r.id}>` : r.id}),
    ) as [z.ZodLiteral<string>, z.ZodLiteral<string>],
  )
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

  const upsertPipeline = _trpcReact.adminUpsertPipeline.useMutation()
  return (
    <SchemaSheet
      ref={ref}
      triggerButton={props.triggerButton}
      title={props.pipeline ? 'Edit' : 'New Pipeline'}
      buttonProps={{variant: props.pipeline ? 'ghost' : 'default'}}
      formProps={{uiSchema: {id: {'ui:readonly': true}}}}
      schema={formSchema}
      mutation={upsertPipeline}
      initialValues={props.pipeline}
    />
  )
})
