import {httpLink} from '@trpc/client/links/httpLink'
import {createTRPCReact, httpBatchLink} from '@trpc/react-query'
import React from 'react'

import type {
  AnyProviderDef,
  AnySyncProvider,
  EndUserId,
  LinkFactory,
  OpenDialogFn,
  UseConnectHook,
} from '@usevenice/cdk-core'
import type {ContextFactoryOptions, FlatRouter} from '@usevenice/engine-backend'
import {zViewerFromUnverifiedJwtToken} from '@usevenice/engine-backend/viewer'
import {DialogContent, DialogRoot} from '@usevenice/ui'
import {R} from '@usevenice/util'

export type {CreateTRPCReact} from '@trpc/react-query'

export type SyncEngineCommonConfig<
  TProviders extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
> = Pick<ContextFactoryOptions<TProviders, TLinks>, 'providers' | 'apiUrl'>

type UseConnectScope = Parameters<UseConnectHook<AnyProviderDef>>[0]
type ConnectFn = ReturnType<UseConnectHook<AnyProviderDef>>

interface DialogConfig {
  Component: Parameters<UseConnectScope['openDialog']>[0]
  options: Parameters<UseConnectScope['openDialog']>[1]
}

const trpc = createTRPCReact<FlatRouter>()

export const VeniceContext = React.createContext<{
  trpc: typeof trpc
  trpcClient: ReturnType<typeof trpc.createClient>
  queryClient: Parameters<typeof trpc.Provider>[0]['queryClient']
  connectFnMapRef: React.RefObject<Record<string, ConnectFn | undefined>>

  providerByName: Record<string, AnySyncProvider>
  endUserId: EndUserId | undefined
  openDialog: OpenDialogFn
} | null>(null)

export function VeniceProvider<
  T extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>({
  children,
  config,
  accessToken,
  queryClient,
  ...options
}: {
  children: React.ReactNode
  config: SyncEngineCommonConfig<T, TLinks>
  /**
   * This will override the cookie values, as we cannot always expect cookie
   * to be sent (for example when we run mitmproxy debugging on a diff port.)
   */
  accessToken: string | undefined
  queryClient: Parameters<typeof trpc.Provider>[0]['queryClient']
  developerMode?: boolean
}) {
  // For debugging 3rd party iframes, such as Plaid / Merge / Stripe
  React.useEffect(() => {
    const listener = (event: MessageEvent) => {
      console.log('[VeniceProvider] iframe window message', event.data)
    }
    console.log('[VeniceProvider] Listen for iframe window messages')
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  // @yenbekbay what's the way way to have a global debug confi?
  const __DEBUG__ =
    typeof window !== 'undefined' && window.location.href.includes('localhost')

  // TODO: Fix me up

  const viewer = zViewerFromUnverifiedJwtToken.parse(accessToken)

  const {developerMode: _developerMode} = options
  const endUserId = viewer.role === 'end_user' ? viewer.endUserId : undefined

  if (typeof window !== 'undefined') {
    console.log('[VeniceProvider]', {endUserId, accessToken})
  }

  const url = config.apiUrl
  const trpcClient = React.useMemo(
    () =>
      // Disable reqeuest batching in DEBUG mode for easier debugging
      // createTRPCProxyClient<FlatRouter>({
      trpc.createClient({
        links: [
          (__DEBUG__ ? httpLink : httpBatchLink)({
            url,
            headers: () => ({
              ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
            }),
          }),
        ],
      }),
    [__DEBUG__, accessToken, url],
  )

  const [dialogConfig, setDialogConfig] = React.useState<DialogConfig | null>(
    null,
  )

  // TODO: It would be nice if we could figure out how to have a DialogTrigger
  // for focus management and accessibility, rather than callback only
  const openDialog: OpenDialogFn = React.useCallback(
    (render, options) => {
      setDialogConfig({Component: render, options})
    },
    [setDialogConfig],
  )

  const connectFnMap = R.mapToObj(config.providers, (p) => [
    p.name,
    p.useConnectHook?.({endUserId, openDialog}),
  ])
  const connectFnMapRef = React.useRef<typeof connectFnMap>(connectFnMap)

  React.useEffect(() => {
    connectFnMapRef.current = connectFnMap
  }, [connectFnMap])

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <VeniceContext.Provider
        value={React.useMemo(
          () => ({
            trpc,
            connectFnMapRef,
            trpcClient,
            queryClient,
            endUserId,
            openDialog,
            providerByName: R.mapToObj(config.providers, (p) => [p.name, p]),
          }),
          [trpcClient, queryClient, endUserId, openDialog, config.providers],
        )}>
        {children}
        {/*
        {dialogConfig && (
          <AnimatedDialog
            ref={dialogRef}
            modal // TODO: Modal is true by default, but dialog still auto-dismiss on press outside...
            open
            onOpenChange={(newOpen) => {
              console.log('Dialog.onOpenChange', {newOpen})
              if (!newOpen) {
                dialogConfig.options?.onClose?.()
                setDialogConfig(null)
              }
            }}>
            <dialogConfig.Component close={() => dialogRef.current?.close()} />
          </AnimatedDialog>
        )} */}
        <DialogRoot
          open={!!dialogConfig}
          onOpenChange={(newOpen) => {
            if (!newOpen) {
              dialogConfig?.options?.onClose?.()
              setDialogConfig(null)
            }
          }}>
          <DialogContent
            onPointerDownOutside={
              dialogConfig?.options?.dismissOnClickOutside
                ? undefined
                : (e) => e.preventDefault()
            }>
            {dialogConfig && (
              <dialogConfig.Component
                close={() => {
                  // onOpenChange is not called when `open` prop changes from parent
                  // Thus have to call the .options.onClose ourselves
                  dialogConfig?.options?.onClose?.()
                  setDialogConfig(null)
                }}
              />
            )}
          </DialogContent>
        </DialogRoot>
      </VeniceContext.Provider>
    </trpc.Provider>
  )
}

VeniceProvider.useContext = () => {
  const ctx = React.useContext(VeniceContext)
  if (!ctx) {
    throw new Error('VeniceProvider missing while useVenice')
  }
  return ctx
}

VeniceProvider.config = <
  TProviders extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>(
  config: SyncEngineCommonConfig<TProviders, TLinks>,
) => config
