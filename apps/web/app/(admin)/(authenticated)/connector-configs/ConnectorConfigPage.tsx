'use client'

import {Loader2} from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import {zConnectorStage, zConnectorVertical, zRaw} from '@usevenice/cdk'
import type {RouterOutput} from '@usevenice/engine-backend'
import {_trpcReact} from '@usevenice/engine-frontend'
import type {SchemaFormElement} from '@usevenice/ui'
import {
  ConnectorCard as _ConnectorCard,
  ConnectorConfigCard as _ConnectorConfigCard,
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
  LoadingText,
  SchemaForm,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useToast,
} from '@usevenice/ui'
import {inPlaceSort, R, titleCase, z, zodToJsonSchema} from '@usevenice/util'
import {useCurrengOrg} from '@/components/viewer-context'
import {cn} from '@/lib-client/ui-utils'

type ConnectorConfig = RouterOutput['adminListConnectorConfigs'][number]

export default function ConnectorConfigsPage() {
  const connectorConfigsRes = _trpcReact.adminListConnectorConfigs.useQuery()
  const catalog = _trpcReact.listConnectorMetas.useQuery()
  if (!connectorConfigsRes.data || !catalog.data) {
    return <LoadingText className="block p-4" />
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Connector Configs
      </h2>
      {connectorConfigsRes.isFetching && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {connectorConfigsRes.data ? (
        <div className="flex flex-wrap">
          {connectorConfigsRes.data.map((int) => {
            const connector = catalog.data[int.connectorName]!
            return (
              <ConnectorConfigCard
                key={int.id}
                connector={connector}
                connectorConfig={int}>
                <ConnectorConfigSheet
                  connectorConfig={int}
                  connectorName={connector.name}
                />
              </ConnectorConfigCard>
            )
          })}
        </div>
      ) : (
        <div>No connectors configured</div>
      )}
      {/* Spacer */}
      <div className="mt-4" />
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        Connector Catalog
      </h2>
      {zConnectorVertical.options.map((category) => {
        const stageByIndex = R.mapToObj.indexed(
          zConnectorStage.options,
          (o, i) => [o, i],
        )
        const connectors = inPlaceSort(
          Object.values(catalog.data).filter(
            (p) => p.categories.includes(category) && p.stage !== 'hidden',
          ),
        ).desc((p) => stageByIndex[p.stage])
        if (!connectors.length) {
          return null
        }
        return (
          <div key={category}>
            <h3 className="mb-4 ml-4 text-xl font-semibold tracking-tight">
              {titleCase(category)}
            </h3>
            <div className="flex flex-wrap">
              {connectors.map((connector) => (
                <ConnectorCard
                  key={`${category}-${connector.name}`}
                  connector={connector}>
                  {connector.stage === 'alpha' ? (
                    <Button
                      className="mt-2"
                      variant="ghost"
                      onClick={() =>
                        window.open(
                          `mailto:hi@venice.is?subject=Request%20access%20to%20${connector.displayName}%20connectors&body=My%20use%20case%20is...`,
                        )
                      }>
                      Request access
                    </Button>
                  ) : (
                    <ConnectorConfigSheet connectorName={connector.name} />
                  )}
                </ConnectorCard>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// import {defConnectors } from '@usevenice/app-config/connectorss/connectorss.def'

export function ConnectorConfigSheet({
  connectorConfig: ccfg,
  connectorName,
}: {
  connectorConfig?: Omit<ConnectorConfig, 'connectorName'>
  connectorName: string
}) {
  const catalogRes = _trpcReact.listConnectorMetas.useQuery()
  const connector = catalogRes.data?.[connectorName]

  const resourcesRes = _trpcReact.listResources.useQuery({
    connectorName: 'postgres',
  })

  const zResoId = z.union(
    (resourcesRes.data ?? []).map((r) =>
      z
        .literal(r.id)
        .describe(r.displayName ? `${r.displayName} <${r.id}>` : r.id),
    ) as [z.ZodLiteral<string>, z.ZodLiteral<string>],
  )

  const ccfgSchema = (
    connector?.schemas.connectorConfig
      ? // Sometimes we have extra data inside the config due to extra data, so workaround for now
        // as we have no way of displaying such information / allow user to fix it
        {...connector?.schemas.connectorConfig, additionalProperties: true}
      : undefined
  ) as {type: 'object'; properties?: {}; additionalProperties: boolean}

  // Side effect is not ideal, figure out better pattern...
  if (ccfgSchema && ccfgSchema.type === 'object') {
    ccfgSchema.properties = {
      ...ccfgSchema.properties,
      default_destination_id: zodToJsonSchema(zResoId),
    }
  }

  // Consider calling this provider, actually seem to make more sense...
  // given that we call the code itself connector config
  const formSchema = zRaw.connector_config
    .pick({endUserAccess: true, displayName: true})
    .extend({config: z.object({})})

  const {orgId} = useCurrengOrg()

  const [open, setOpen] = React.useState(false)
  const verb = ccfg ? 'Edit' : 'Add'
  const {toast} = useToast()

  const upsertConnectorConfig =
    _trpcReact.adminUpsertConnectorConfig.useMutation({
      onSuccess: () => {
        setOpen(false)
        toast({title: 'connector config saved', variant: 'success'})
      },
      onError: (err) => {
        toast({
          title: 'Failed to save connector config',
          description: `${err}`,
          variant: 'destructive',
        })
      },
    })
  const deleteConnectorConfig =
    _trpcReact.adminDeleteConnectorConfig.useMutation({
      onSuccess: () => {
        setOpen(false)
        toast({title: 'connector config deleted', variant: 'success'})
      },
      onError: (err) => {
        toast({
          title: 'Failed to create connector config saved',
          description: `${err}`,
          variant: 'destructive',
        })
      },
    })
  const mutating =
    deleteConnectorConfig.isLoading || upsertConnectorConfig.isLoading

  const formRef = React.useRef<SchemaFormElement>(null)

  if (!connector) {
    return <LoadingText className="block p-4" />
  }

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
            {verb} {connector.displayName} connector config
          </SheetTitle>

          <div className="flex max-h-[100px] flex-row items-center justify-between">
            {connector.logoUrl ? (
              <Image
                width={100}
                height={100}
                src={connector.logoUrl}
                alt={connector.displayName}
              />
            ) : (
              <span>{connector.displayName}</span>
            )}
            <Badge
              variant="secondary"
              className={cn(
                'ml-auto',
                connector.stage === 'ga' && 'bg-green-200',
                connector.stage === 'beta' && 'bg-blue-200',
                connector.stage === 'alpha' && 'bg-pink-50',
              )}>
              {connector.stage}
            </Badge>
            {/* Add help text here */}
          </div>

          <SheetDescription>
            {ccfg && `ID: ${ccfg.id}`}
            <br />
            Supported mode(s): {connector.supportedModes.join(', ')}
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
                ...(ccfgSchema && {config: ccfgSchema}),
              },
            })}
            formData={
              ccfg
                ? {
                    endUserAccess: ccfg.endUserAccess,
                    displayName: ccfg.displayName,
                    config: ccfg.config ?? {},
                  } // {} because required
                : undefined
            }
            // formData should be non-null at this point, we should fix the typing
            loading={upsertConnectorConfig.isLoading}
            onSubmit={({formData}) => {
              console.log('formData submitted', formData)
              upsertConnectorConfig.mutate({
                ...formData,
                ...(ccfg ? {id: ccfg.id} : {connectorName}),
                orgId,
              })
            }}
            hideSubmitButton
          />
          {!ccfgSchema && <p>No configuration needed</p>}
        </div>
        <Separator orientation="horizontal" />
        <SheetFooter className="shrink-0">
          {ccfg && (
            <AlertDialog>
              <AlertDialogTrigger className="mr-auto">
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Confirm delete {connector.displayName} connector config?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    ID: {ccfg.id}
                    <br />
                    This action cannot be undone. In order to to delete an
                    connector config, you may need to first delete all the
                    resources that depend on this connector config first
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
                      onClick={() =>
                        deleteConnectorConfig.mutate({id: ccfg.id})
                      }>
                      {deleteConnectorConfig.isLoading && (
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
            {upsertConnectorConfig.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {ccfg ? 'Save' : 'Create'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const ConnectorCard = (props: React.ComponentProps<typeof _ConnectorCard>) => (
  <_ConnectorCard Image={Image as any} showStageBadge {...props} />
)

const ConnectorConfigCard = (
  props: React.ComponentProps<typeof _ConnectorConfigCard>,
) => <_ConnectorConfigCard Image={Image as any} showStageBadge {...props} />
