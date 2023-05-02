import {useMutation} from '@tanstack/react-query'
import {Loader2} from 'lucide-react'
import React from 'react'

import type {
  AnyProviderDef,
  EndUserId,
  Id,
  OpenDialogFn,
  ProviderMeta,
  UseConnectHook,
} from '@usevenice/cdk-core'
import {extractProviderName, zIntegrationCategory} from '@usevenice/cdk-core'
import type {RouterInput} from '@usevenice/engine-backend'
import {ProviderCard} from '@usevenice/ui/domain-components'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useToast,
} from '@usevenice/ui/new-components'
import type {SchemaFormElement} from '@usevenice/ui/SchemaForm'
import {SchemaForm} from '@usevenice/ui/SchemaForm'
import {R, titleCase, z} from '@usevenice/util'

import {trpcReact} from './TRPCProvider'

type ConnectEventType = 'open' | 'close' | 'error'

export interface VeniceConnectProps {
  endUserId?: EndUserId | null
  integrationIds: Array<Id['int']>
  providerMetaByName: Record<string, ProviderMeta>
  onEvent?: (event: {type: ConnectEventType; intId: Id['int']}) => void
}

type UseConnectScope = Parameters<UseConnectHook<AnyProviderDef>>[0]
interface DialogConfig {
  Component: Parameters<UseConnectScope['openDialog']>[0]
  options: Parameters<UseConnectScope['openDialog']>[1]
}

/**
 * TODO: Figure out if we can reuse the same dialog such that when a provider is selected
 * we can replace the dialog content.
 * Alternatively if there's something like a mobile app navigation where it's part of a
 * "back" stack...
 */
export function VeniceConnectButton({
  children,
  className,
  ...props
}: VeniceConnectProps & {className?: string; children?: React.ReactNode, }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className={className} variant="default">
            Connect
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New connection</DialogTitle>
          <DialogDescription>Choose an integration to start</DialogDescription>
        </DialogHeader>
        <VeniceConnect
          {...props}
          onEvent={(event) => {
            // How do we close the dialog when an integration has been chosen?
            // This is problematic because if VeniceConnect itself gets removed from dom
            // then any dialog it presents goes away also
            // Tested forceMount though and it doesn't quite work... So we might want something like a hidden
            props.onEvent?.(event)
          }}
        />
        {/* Children here */}
        <DialogFooter>{/* Cancel here */}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// TODO: Wrap this in memo so it does not re-render as much as possible.
export function VeniceConnect({
  endUserId,
  integrationIds,
  providerMetaByName,
  onEvent,
}: VeniceConnectProps) {
  const [_dialogConfig, setDialogConfig] = React.useState<DialogConfig | null>(
    null,
  )
  // TODO: Fix me by actually implementing it...
  const openDialog: OpenDialogFn = React.useCallback(
    (render, options) => {
      setDialogConfig({Component: render, options})
    },
    [setDialogConfig],
  )
  const integrations = integrationIds
    .map((id) => {
      const provider = providerMetaByName[extractProviderName(id)]
      return provider ? {id, provider} : null
    })
    .filter((i): i is NonNullable<typeof i> => !!i)

  const connectFnMap = R.pipe(
    integrationIds,
    R.map(extractProviderName),
    R.uniq,
    R.mapToObj((name: string) => [
      name,
      providerMetaByName[name]?.useConnectHook?.({endUserId, openDialog}),
    ]),
  )

  const categories = zIntegrationCategory.options
    .map((category) => ({
      key: category,
      name: titleCase(category),
      integrations: integrations.filter((integration) =>
        integration.provider?.categories.includes(category),
      ),
    }))
    .filter((item) => item.integrations.length > 0)

  return (
    <div className="flex flex-wrap">
      {false &&
        categories.map((category) => (
          <div key={category.key}>
            <h3 className="mb-4 ml-4 text-xl font-semibold tracking-tight">
              {category.name}
            </h3>
            {category.integrations.map((int) => (
              <div key={int.id}>Connect with {int.id}</div>
            ))}
          </div>
        ))}

      {integrations.map((int) => (
        <ConnectCard
          key={int.id}
          int={int}
          connectFn={connectFnMap[int.provider.name]}
          onEvent={(e) => {
            onEvent?.({type: e.type, intId: int.id})
          }}
        />
      ))}
    </div>
  )
}

export const ConnectCard = ({
  int,
  connectFn,
  onEvent,
}: {
  int: {id: Id['int']; provider: ProviderMeta}
  // connectFnMap:
  connectFn?: ReturnType<UseConnectHook<AnyProviderDef>>
  onEvent?: (event: {type: ConnectEventType}) => void
}) => {
  // console.log('ConnectCard', int.id, int.provider)
  const envName = 'sandbox' as const

  // TODO: Handle preConnectInput schema and such... for example for Plaid
  const preConnect = trpcReact.preConnect.useQuery([int.id, {envName}, {}], {
    enabled: int.provider.hasPreConnect,
  })
  const postConnect = trpcReact.postConnect.useMutation()
  const createResource = trpcReact.createResource.useMutation()

  const {toast} = useToast()

  const connect = useMutation(
    async (input?: RouterInput['createResource']) => {
      // For postgres and various integrations that does not require client side JS
      if (input) {
        return createResource.mutateAsync(input)
      }
      // For plaid and other integrations that requires client side JS
      // TODO: Test this...
      // How to make sure does not actually refetch we if we already have data?
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const connInput = int.provider.hasPreConnect
        ? (await preConnect.refetch()).data
        : {}
      console.log(`[VeniceConnect] ${int.id} connInput`, connInput)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const connOutput = connectFn
        ? await connectFn?.(connInput, {envName})
        : connInput
      console.log(`[VeniceConnect] ${int.id} connOutput`, connOutput)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const postConnOutput = int.provider.hasPostConnect
        ? await postConnect.mutateAsync([connOutput, int.id, {envName}])
        : connOutput
      console.log(`[VeniceConnect] ${int.id} postConnOutput`, postConnOutput)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return postConnOutput
    },
    {
      onSuccess(msg) {
        if (msg) {
          toast({
            title: `Success (${int.provider.displayName})`,
            description: `${msg}`,
            variant: 'success',
          })
        }
      },
      onError: (err) => {
        toast({
          title: `Failed to connect to ${int.provider.displayName}`,
          description: `${err}`,
          variant: 'destructive',
        })
      },
    },
  )

  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef<SchemaFormElement>(null)
  const formSchema = int.provider.def.resourceSettings ?? z.object({})

  return (
    <ProviderCard provider={int.provider}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="mt-2"
            disabled={connect.isLoading}
            variant="ghost"
            onClick={(e) => {
              onEvent?.({type: 'open'})
              if (!connectFn) {
                // Allow the default behavior of opening the dialog
                return
              }
              // Prevent dialog from automatically opening
              // as we invoke provider client side JS
              e.preventDefault()
              connect.mutate(undefined)
            }}>
            Connect
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to {int.provider.name}</DialogTitle>
            <DialogDescription>
              Using integration ID: {int.id}
            </DialogDescription>
          </DialogHeader>
          <SchemaForm
            ref={formRef}
            schema={formSchema}
            formData={{}}
            // formData should be non-null at this point, we should fix the typing
            onSubmit={({formData}) => {
              console.log('resource form submitted', formData)
              connect.mutate({integrationId: int.id, settings: formData})
            }}
            hideSubmitButton
          />
          {/* Children here */}
          <DialogFooter>
            <Button
              disabled={createResource.isLoading}
              onClick={() => formRef.current?.submit()}
              type="submit">
              {createResource.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProviderCard>
  )
}
