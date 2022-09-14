import {httpLink} from '@trpc/client/links/httpLink'
import {createReactQueryHooks} from '@trpc/react'
import React from 'react'

import type {
  AnySyncProvider,
  DialogConfig,
  LinkFactory,
} from '@ledger-sync/cdk-core'
import type {AnySyncRouter, SyncEngineConfig} from '@ledger-sync/engine-backend'
import {R} from '@ledger-sync/util'

import type {DialogInstance} from './components/Dialog'
import {Dialog} from './components/Dialog'

export type SyncEngineCommonConfig<
  TProviders extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
> = Pick<SyncEngineConfig<TProviders, TLinks>, 'providers' | 'apiUrl'>

const trpc = createReactQueryHooks<AnySyncRouter>()

export const LSContext = React.createContext<{
  trpc: typeof trpc
  trpcClient: ReturnType<typeof trpc.createClient>
  queryClient: Parameters<typeof trpc.Provider>[0]['queryClient']
  // TODO: get the proper types from cdk-core
  connectFnMapRef: React.RefObject<
    Record<string, ((input: any, ctx: any) => Promise<any>) | undefined>
  >
} | null>(null)

export function LSProvider<
  T extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>({
  children,
  config,
  getAccessToken,
  queryClient,
}: {
  children: React.ReactNode
  config: SyncEngineCommonConfig<T, TLinks>
  /**
   * This will override the cookie values, as we cannot always expect cookie
   * to be sent (for example when we run mitmproxy debugging on a diff port.)
   */
  getAccessToken?: () => string | undefined
  queryClient: Parameters<typeof trpc.Provider>[0]['queryClient']
}) {
  // @yenbekbay what's the way way to have a global debug confi?
  const __DEBUG__ =
    typeof window !== 'undefined' && window.location.href.includes('localhost')

  const url = config.apiUrl ?? '/api'

  const trpcClient = React.useMemo(
    () =>
      trpc.createClient({
        headers: () =>
          R.pipe(
            getAccessToken?.(),
            (token) => (token ? {Authorization: `Bearer ${token}`} : {}),
            // (res) => {
            //   console.log('headers', res)
            //   return res
            // },
          ),
        // Disable reqeuest batching in DEBUG mode for easier debugging
        ...(__DEBUG__ ? {links: [httpLink({url})]} : {url}),
      }),
    [__DEBUG__, getAccessToken, url],
  )

  const connectFnMap = R.mapToObj(config.providers, (p) => [
    p.name,
    p.useConnectHook?.({
      openDialog: (render, options) => {
        setDialogConfig({Component: render, options})
        dialogRef.current?.open()
      },
    }),
  ])
  const connectFnMapRef = React.useRef<typeof connectFnMap>(connectFnMap)
  React.useEffect(() => {
    connectFnMapRef.current = connectFnMap
  }, [connectFnMap])

  const dialogRef = React.useRef<DialogInstance>(null)
  const [dialogConfig, setDialogConfig] = React.useState<DialogConfig | null>(
    null,
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <LSContext.Provider
        value={React.useMemo(
          () => ({trpc, connectFnMapRef, trpcClient, queryClient}),
          [connectFnMapRef, queryClient, trpcClient],
        )}>
        {children}

        {dialogConfig && (
          <Dialog
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
          </Dialog>
        )}
      </LSContext.Provider>
    </trpc.Provider>
  )
}

/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
LSProvider.useContext = () => React.useContext(LSContext)!

LSProvider.config = <
  TProviders extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>(
  config: SyncEngineCommonConfig<TProviders, TLinks>,
) => config

// TODO: Figure out how to work with NextJS SSR here
// adding typeof withTRPC<Router> breaks prettier, let's figure it out...
// const withLedgerSync = (options: Parameters<typeof withTRPC>[0]) =>
//   withTRPC({
//     ...options,
//     // Improve typing to omit options.config.url, it is a noop
//     config: (info) => ({...options.config(info), url: routerUrl}),
//   })
