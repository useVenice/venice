'use client'

import {Loader2} from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import {
  availableProviders,
  providerByName,
} from '@usevenice/app-config/providers'
import {
  zIntegrationCategory,
  zRaw,
  type ProviderMeta,
} from '@usevenice/cdk-core'
import type {RouterOutput} from '@usevenice/engine-backend'
import {trpcReact} from '@usevenice/engine-frontend'
import {ProviderCard as _ProviderCard} from '@usevenice/ui/domain-components'
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
import type {SchemaFormElement} from '@usevenice/ui/SchemaForm'
import {SchemaForm} from '@usevenice/ui/SchemaForm'
import {titleCase, z} from '@usevenice/util'

import {useCurrengOrg} from '@/contexts/viewer-context'
import {cn} from '@/lib/utils'

type Integration = RouterOutput['adminListIntegrations'][number]

export default function IntegrationsPage() {
  const integrationsRes = trpcReact.adminListIntegrations.useQuery()

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Configured integrations
      </h2>
      {integrationsRes.isFetching && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {integrationsRes.data ? (
        <div className="flex flex-wrap">
          {integrationsRes.data.map((int) => {
            const provider = providerByName[int.providerName]!
            return (
              <ProviderCard
                key={int.id}
                provider={provider}
                labels={
                  // TODO: Fix this hack soon. We should have some kind of mapStandardIntegration method
                  int.providerName === 'plaid' && int.config?.['envName']
                    ? // eslint-disable-next-line @typescript-eslint/no-base-to-string
                      [`${int.config?.['envName']}`]
                    : []
                }>
                <IntegrationSheet
                  integration={int}
                  providerName={provider.name}
                />
              </ProviderCard>
            )
          })}
        </div>
      ) : (
        <div>No integrations configured</div>
      )}
      {/* Spacer */}
      <div className="mt-4" />
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Available integrations
      </h2>
      {zIntegrationCategory.options.map((category) => {
        const providers = availableProviders.filter((p) =>
          p.categories.includes(category),
        )
        if (!providers.length) {
          return null
        }
        return (
          <div key={category}>
            <h3 className="mb-4 ml-4 text-xl font-semibold tracking-tight">
              {titleCase(category)}
            </h3>
            <div className="flex flex-wrap">
              {providers.map((provider) => (
                <ProviderCard
                  key={`${category}-${provider.name}`}
                  provider={provider}>
                  {provider.stage === 'alpha' ? (
                    <Button
                      className="mt-2"
                      variant="ghost"
                      onClick={() =>
                        window.open(
                          `mailto:hi@venice.is?subject=Request%20access%20to%20${provider.displayName}%20integration&body=My%20use%20case%20is...`,
                        )
                      }>
                      Request access
                    </Button>
                  ) : (
                    <IntegrationSheet providerName={provider.name} />
                  )}
                </ProviderCard>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function IntegrationSheet({
  integration: int,
  providerName,
}: {
  integration?: Omit<Integration, 'providerName'>
  providerName: string
}) {
  const provider = providerByName[providerName]!

  // Consider calling this provider, actually seem to make more sense...
  // given that we call the code itself integration
  const formSchema = zRaw.integration
    .pick({endUserAccess: true})
    .extend({config: provider.def.integrationConfig ?? z.object({})})

  const {orgId} = useCurrengOrg()

  const [open, setOpen] = React.useState(false)
  const verb = int ? 'Edit' : 'Add'
  const {toast} = useToast()

  const upsertIntegration = trpcReact.adminUpsertIntegration.useMutation({
    onSuccess: () => {
      setOpen(false)
      toast({title: 'Integration created', variant: 'success'})
    },
    onError: (err) => {
      toast({
        title: 'Failed to save integration',
        description: `${err}`,
        variant: 'destructive',
      })
    },
  })
  const deleteIntegration = trpcReact.adminDeleteIntegration.useMutation({
    onSuccess: () => {
      setOpen(false)
      toast({title: 'Integration deleted', variant: 'success'})
    },
    onError: (err) => {
      toast({
        title: 'Failed to create integration saved',
        description: `${err}`,
        variant: 'destructive',
      })
    },
  })
  const mutating = deleteIntegration.isLoading || upsertIntegration.isLoading

  const formRef = React.useRef<SchemaFormElement>(null)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="mt-2" variant="ghost">
          {verb}
        </Button>
      </SheetTrigger>
      <SheetContent
        position="right"
        size="lg"
        className="flex flex-col bg-background">
        <SheetHeader className="shrink-0">
          <SheetTitle>
            {verb} {provider.displayName} integration
          </SheetTitle>

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
            {int && `ID: ${int.id}`}
            <br />
            Supported mode(s): {provider.supportedModes.join(', ')}
          </SheetDescription>
        </SheetHeader>
        <Separator orientation="horizontal" />
        <div className="grow overflow-scroll">
          <SchemaForm
            ref={formRef}
            schema={formSchema}
            formData={{
              endUserAccess: int?.endUserAccess,
              config: int?.config ?? {}, // {} because required
            }}
            // formData should be non-null at this point, we should fix the typing
            loading={upsertIntegration.isLoading}
            onSubmit={({formData}) => {
              console.log('formData submitted', formData)
              upsertIntegration.mutate({
                ...formData,
                ...(int ? {id: int.id} : {providerName}),
                orgId,
              })
            }}
            hideSubmitButton
          />
          {!provider.def.integrationConfig && <p>No configuration needed</p>}
        </div>
        <Separator orientation="horizontal" />
        <SheetFooter className="shrink-0">
          {int && (
            <AlertDialog>
              <AlertDialogTrigger className="mr-auto">
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Confirm delete {provider.displayName} integration?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    ID: {int.id}
                    <br />
                    This action cannot be undone. In order to to delete an
                    integration, you may need to first delete all the resources
                    that depend on this integration first
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
                      onClick={() => deleteIntegration.mutate([int.id])}>
                      {deleteIntegration.isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            disabled={mutating}
            type="submit"
            onClick={() => formRef.current?.submit()}>
            {upsertIntegration.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {int ? 'Save' : 'Create'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const ProviderCard = (props: React.ComponentProps<typeof _ProviderCard>) => (
  <_ProviderCard Image={Image as any} showStageBadge {...props} />
)
