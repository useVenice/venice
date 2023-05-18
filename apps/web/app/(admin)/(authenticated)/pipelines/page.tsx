'use client'

import type {UseMutationResult} from '@tanstack/react-query'
import {Loader2} from 'lucide-react'
import React from 'react'

import {trpcReact} from '@usevenice/engine-frontend'
import {SchemaForm} from '@usevenice/ui'
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useToast,
} from '@usevenice/ui/new-components'
import {z} from '@usevenice/util'

import {DataTable} from '@/components/DataTable'

export default function PipelinesPage() {
  const res = trpcReact.listPipelines.useQuery()

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
      <DataTable isFetching={res.isFetching} rows={res.data ?? []} />
    </div>
  )
}

export function NewPipelineButton() {
  const resourcesRes = trpcReact.listResources.useQuery()

  const zResoId = z.enum((resourcesRes.data ?? []).map((r) => r.id) as [string])
  // Filter for only sources vs destinations when saving...
  // This is where it would be a nice advantage to use something like an Airbyte
  // so we don't have to build the whole admin ui
  // But then that won't work if admin ui cannot be embedded
  const formSchema = z.object({
    sourceId: zResoId,
    destinationId: zResoId,
    sourceState: z.record(z.any()).optional(),
    destinationState: z.record(z.any()).optional(),
  })

  const upsertPipeline = trpcReact.adminUpsertPipeline.useMutation()
  return (
    <SchemaSheet
      title="New pipeline"
      schema={formSchema}
      mutation={upsertPipeline}
    />
  )
}

export function SchemaSheet<T extends z.ZodTypeAny>({
  schema,
  mutation,
  title,
}: {
  schema: T
  // TODO: Fix the typing here. Schema needs to conform to mutation typing, but
  // mutation does not need to conform to schema typing here...
  mutation: UseMutationResult<any, any, z.infer<T>, any>
  title?: string
}) {
  const [open, setOpen] = React.useState(false)

  const {toast} = useToast()
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default">
          {mutation.isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {title ?? 'Open'}
        </Button>
      </SheetTrigger>
      <SheetContent
        position="right"
        size="xl"
        className="flex flex-col bg-background">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <SchemaForm
          schema={schema}
          onSubmit={({formData}) => {
            console.log('formData', formData)
            mutation.mutate(formData, {
              onSuccess: () => {
                setOpen(false)
                toast({title: 'Success', variant: 'success'})
              },
              onError: (err) => {
                toast({
                  title: 'Failed to save',
                  description: `${err.message}`,
                  variant: 'destructive',
                })
              },
            })
          }}
        />
        <SheetFooter>{/* Cancel here */}</SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
