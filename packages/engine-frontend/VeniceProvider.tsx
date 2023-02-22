import {httpLink} from '@trpc/client/links/httpLink'
import {createTRPCReact, httpBatchLink} from '@trpc/react-query'
import React from 'react'

import type {
  AnyProviderDef,
  AnySyncProvider,
  LinkFactory,
  OpenDialogFn,
  UseConnectHook,
  UserId,
} from '@usevenice/cdk-core'
import type {AnySyncRouter, SyncEngineConfig} from '@usevenice/engine-backend'
import {_zContext} from '@usevenice/engine-backend/auth-utils'
import type {AnimatedDialogInstance} from '@usevenice/ui'
import {AnimatedDialog} from '@usevenice/ui'
import {R} from '@usevenice/util'

export type {CreateTRPCReact} from '@trpc/react-query'

export type SyncEngineCommonConfig<
  TProviders extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
> = Pick<
  SyncEngineConfig<TProviders, TLinks>,
  'providers' | 'apiUrl' | 'parseJwtPayload'
>

type UseConnectScope = Parameters<UseConnectHook<AnyProviderDef>>[0]
type ConnectFn = ReturnType<UseConnectHook<AnyProviderDef>>

interface DialogConfig {
  Component: Parameters<UseConnectScope['openDialog']>[0]
  options: Parameters<UseConnectScope['openDialog']>[1]
}

const trpc = createTRPCReact<AnySyncRouter>()

export const VeniceContext = React.createContext<{
  trpc: typeof trpc
  trpcClient: ReturnType<typeof trpc.createClient>
  queryClient: Parameters<typeof trpc.Provider>[0]['queryClient']
  connectFnMapRef: React.RefObject<Record<string, ConnectFn | undefined>>

  providerByName: Record<string, AnySyncProvider>

  userId: UserId | undefined
  isAdmin: boolean
  developerMode: boolean
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
  // @yenbekbay what's the way way to have a global debug confi?
  const __DEBUG__ =
    typeof window !== 'undefined' && window.location.href.includes('localhost')

  const zAuthContext = _zContext({parseJwtPayload: config.parseJwtPayload})

  const {developerMode: _developerMode} = options
  const {userId, isAdmin = false} = zAuthContext.parse<'typed'>({
    accessToken,
  })
  const developerMode = (isAdmin && _developerMode) || false

  if (typeof window !== 'undefined') {
    console.log('[VeniceProvider]', {userId, isAdmin, accessToken})
  }

  const url = config.apiUrl
  const trpcClient = React.useMemo(
    () =>
      // Disable reqeuest batching in DEBUG mode for easier debugging
      // createTRPCProxyClient<AnySyncRouter>({
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

  const dialogRef = React.useRef<AnimatedDialogInstance>(null)
  const [dialogConfig, setDialogConfig] = React.useState<DialogConfig | null>(
    null,
  )

  const openDialog: OpenDialogFn = React.useCallback(
    (render, options) => {
      setDialogConfig({Component: render, options})
      dialogRef.current?.open()
    },
    [dialogRef, setDialogConfig],
  )

  const connectFnMap = R.mapToObj(config.providers, (p) => [
    p.name,
    p.useConnectHook?.({userId, openDialog}),
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
            userId,
            isAdmin,
            developerMode,
            openDialog,
            providerByName: R.mapToObj(config.providers, (p) => [p.name, p]),
          }),
          [
            trpcClient,
            queryClient,
            userId,
            isAdmin,
            developerMode,
            openDialog,
            config.providers,
          ],
        )}>
        {children}

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
        )}
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
