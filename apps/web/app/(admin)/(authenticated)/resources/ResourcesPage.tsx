'use client'

import {Copy, Database, Loader2, MoreHorizontal, Pencil} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import {clientIntegrations} from '@usevenice/app-config/integrations/integrations.client'
import {extractProviderName, zRaw} from '@usevenice/cdk'
import type {RouterOutput} from '@usevenice/engine-backend'
import {_trpcReact, VeniceConnectButton} from '@usevenice/engine-frontend'
import type {SchemaFormElement} from '@usevenice/ui'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  cn,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SchemaForm,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  useToast,
} from '@usevenice/ui'
import {z} from '@usevenice/util'

type Resource = RouterOutput['listConnections'][number]

// TODO: separate into sources & destinations

export default function ResourcesPage() {
  const res = _trpcReact.listConnections.useQuery({})
  return (
    <div className="p-6">
      <header className="flex items-center">
        <h2 className="mb-4 mr-auto text-2xl font-semibold tracking-tight">
          Resources
        </h2>
        <VeniceConnectButton clientIntegrations={clientIntegrations} />
      </header>
      <p>Resources are created based on integration configurations</p>
      <DataTable
        query={res}
        columns={[
          {
            id: 'actions',
            enableHiding: false,
            cell: ({row}) => <ResourceMenu resource={row.original} />,
          },
          {accessorKey: 'displayName'},
          {accessorKey: 'endUserId'},
          {accessorKey: 'id'},
          {accessorKey: 'status'},
          {accessorKey: 'integrationId'},
          {accessorKey: 'institutionId'},
        ]}
      />
    </div>
  )
}

function ResourceMenu({resource}: {resource: Resource}) {
  const [sheetOpen, setSheetOpen] = React.useState(false)
  return (
    <DropdownMenu>
      <EditResourceSheet
        resource={resource}
        open={sheetOpen}
        setOpen={setSheetOpen}
      />
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(resource.id)}>
          <Copy className="mr-2 h-4 w-4" />
          <div>
            Copy resource ID
            <br />
            <pre className="text-muted-foreground">{resource.id}</pre>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {resource.providerName === 'postgres' && (
          <DropdownMenuItem asChild>
            <Link href={`/resources/${resource.id}/sql`}>
              <Database className="mr-2 h-4 w-4" />
              Run SQL
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href={`/resources/${resource.id}/playground`}>
            <Database className="mr-2 h-4 w-4" />
            Playground
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setTimeout(() => setSheetOpen(true), 0)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit resource
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          onSelect={() => deleteresource.mutate({id: resource.id})}>
          <Trash className="mr-2 h-4 w-4" />
          Delete resource
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Should this live inside VeniceConnect actually?
// Also lots of dupe code we can refactor when we need to use the same pattern for
// integrations, connections, etc.
function EditResourceSheet({
  resource: reso,
  open,
  setOpen,
}: {
  resource: Resource
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const catalogRes = _trpcReact.getIntegrationCatalog.useQuery()
  const provider = catalogRes.data?.[extractProviderName(reso.id)]

  // Consider calling this provider, actually seem to make more sense...
  // given that we call the code itself integration
  const formSchema = zRaw.resource
    .pick({displayName: true})
    .extend({settings: z.object({})})

  const {toast} = useToast()

  // TODO: dedupe the logic here with ResourceDropdownMenu inside VeniceConnect
  // Probabliy by rendering the actual ResourceDropdownMenu here...

  const updateResource = _trpcReact.updateResource.useMutation({
    onSuccess: () => {
      setOpen(false)
      toast({title: 'Resource updated', variant: 'success'})
    },
    onError: (err) => {
      toast({
        title: 'Failed to save resource',
        description: `${err.message}`,
        variant: 'destructive',
      })
    },
  })
  const deleteResource = _trpcReact.deleteResource.useMutation({
    onSuccess: () => {
      setOpen(false)
      toast({title: 'Resource deleted', variant: 'success'})
    },
    onError: (err) => {
      toast({
        title: 'Failed to delete resource',
        description: `${err.message}`,
        variant: 'destructive',
      })
    },
  })
  const mutating = deleteResource.isLoading || updateResource.isLoading

  const formRef = React.useRef<SchemaFormElement>(null)

  if (!provider) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        position="right"
        size="lg"
        className="flex flex-col bg-background">
        <SheetHeader className="shrink-0">
          <SheetTitle>Edit {provider.displayName} resource</SheetTitle>

          <div className="flex max-h-[100px] flex-row items-center justify-between">
            {provider.logoUrl ? (
              <Image
                width={100}
                height={100}
                src={provider.logoUrl}
                alt={provider.displayName}
              />
            ) : (
              <span>{provider.displayName}</span>
            )}
            <Badge
              variant="secondary"
              className={cn(
                'ml-auto',
                provider.stage === 'ga' && 'bg-green-200',
                provider.stage === 'beta' && 'bg-blue-200',
                provider.stage === 'alpha' && 'bg-pink-50',
              )}>
              {provider.stage}
            </Badge>
            {/* Add help text here */}
          </div>

          <SheetDescription>
            {reso && `ID: ${reso.id}`}
            <br />
            Supported mode(s): {provider.supportedModes.join(', ')}
          </SheetDescription>
        </SheetHeader>
        <Separator orientation="horizontal" />
        <div className="grow overflow-scroll">
          <SchemaForm
            ref={formRef}
            schema={formSchema}
            jsonSchemaTransform={(schema) => ({
              ...schema,
              properties: {
                ...schema.properties,
                ...(provider.schemas.resourceSettings && {
                  settings: provider.schemas.resourceSettings,
                }),
              },
            })}
            formData={{settings: reso.settings, displayName: reso.displayName}}
            loading={updateResource.isLoading}
            onSubmit={({formData}) => {
              console.log('formData submitted', formData)
              updateResource.mutate({
                ...formData,
                id: reso.id,
              })
            }}
            hideSubmitButton
          />
        </div>
        <Separator orientation="horizontal" />
        <SheetFooter className="shrink-0">
          <AlertDialog>
            <AlertDialogTrigger className="mr-auto">Delete</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Confirm delete {provider.displayName} resource?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  ID: {reso.id}
                  <br />
                  This action cannot be undone. In order to to delete an
                  resource, you may need to first delete all the resources that
                  depend on this resource first
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    disabled={mutating}
                    className="mr-auto"
                    // Specifying asChild and using this variant does not appear to be
                    // working for some reason...
                    variant="destructive"
                    onClick={() => deleteResource.mutate({id: reso.id})}>
                    {deleteResource.isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            disabled={mutating}
            type="submit"
            onClick={() => formRef.current?.submit()}>
            {updateResource.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
