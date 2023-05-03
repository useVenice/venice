'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Badge as TremorBadge,
} from '@tremor/react'
import {Loader2, Radio} from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import {providerByName} from '@usevenice/app-config/providers'
import {extractProviderName, zRaw} from '@usevenice/cdk-core'
import type {RouterOutput} from '@usevenice/engine-backend'
import {trpcReact, VeniceConnectButton} from '@usevenice/engine-frontend'
import type {SchemaFormElement} from '@usevenice/ui'
import {cn, SchemaForm} from '@usevenice/ui'
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
  Separator,
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

import '@usevenice/ui'

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
            <TremorBadge color="emerald" icon={Radio}>
              {reso.status}
            </TremorBadge>
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
            <EditResourceSheet resource={reso} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

// Should this live inside VeniceConnect actually?
// Also lots of dupe code we can refactor when we need to use the same pattern for
// integrations, connections, etc.
export function EditResourceSheet({resource: reso}: {resource: Resource}) {
  const provider = providerByName[extractProviderName(reso.id)]!

  // Consider calling this provider, actually seem to make more sense...
  // given that we call the code itself integration
  const formSchema = zRaw.resource
    .pick({endUserAccess: true, displayName: true})
    .extend({config: provider.def.resourceSettings ?? z.object({})})

  const [open, setOpen] = React.useState(false)

  const {toast} = useToast()

  const updateResource = trpcReact.updateResource.useMutation({
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
  const deleteResource = trpcReact.deleteResoruce.useMutation({
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="mt-2" variant="ghost">
          Edit
        </Button>
      </SheetTrigger>
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
              <caption>{provider.displayName}</caption>
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
            formData={reso}
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
          {!provider.def.integrationConfig && <p>No configuration needed</p>}
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
