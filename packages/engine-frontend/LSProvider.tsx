import {httpLink} from '@trpc/client/links/httpLink'
import {createReactQueryHooks} from '@trpc/react'
import React from 'react'

import type {
  AnyProviderDef,
  AnySyncProvider,
  Id,
  LinkFactory,
  UseConnectHook,
} from '@ledger-sync/cdk-core'
import type {AnySyncRouter, SyncEngineConfig} from '@ledger-sync/engine-backend'
import {_zContext, kXLedgerId} from '@ledger-sync/engine-backend/auth-utils'
import {R} from '@ledger-sync/util'

import type {DialogInstance} from './components/Dialog'
import {Dialog} from './components/Dialog'

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

const trpc = createReactQueryHooks<AnySyncRouter>()

export const LSContext = React.createContext<{
  trpc: typeof trpc
  trpcClient: ReturnType<typeof trpc.createClient>
  queryClient: Parameters<typeof trpc.Provider>[0]['queryClient']
  connectFnMapRef: React.RefObject<Record<string, ConnectFn | undefined>>

  ledgerId: Id['ldgr'] | undefined
  isAdmin: boolean
  developerMode: boolean
} | null>(null)

export function LSProvider<
  T extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>({
  children,
  config,
  accessToken,
  queryClient,
  ...options
}: {
  developerMode?: boolean
  children: React.ReactNode
  config: SyncEngineCommonConfig<T, TLinks>
  /**
   * This will override the cookie values, as we cannot always expect cookie
   * to be sent (for example when we run mitmproxy debugging on a diff port.)
   */
  accessToken: string | undefined
  ledgerId: Id['ldgr'] | undefined
  queryClient: Parameters<typeof trpc.Provider>[0]['queryClient']
}) {
  // @yenbekbay what's the way way to have a global debug confi?
  const __DEBUG__ =
    typeof window !== 'undefined' && window.location.href.includes('localhost')

  const _ledgerId = options.ledgerId

  const zAuthContext = _zContext({parseJwtPayload: config.parseJwtPayload})

  const {ledgerId, isAdmin = false} = zAuthContext.parse<'typed'>({
    accessToken,
    ledgerId: options.ledgerId,
  })

  const developerMode = (isAdmin && options.developerMode) || false

  console.log('[LSProvider]', {
    ledgerId,
    isAdmin,
    accessToken,
  })

  const url = config.apiUrl
  const trpcClient = React.useMemo(
    () =>
      trpc.createClient({
        headers: () => ({
          ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
          ...(_ledgerId ? {[kXLedgerId]: _ledgerId} : {}),
        }),
        // Disable reqeuest batching in DEBUG mode for easier debugging
        ...(__DEBUG__ ? {links: [httpLink({url})]} : {url}),
      }),
    [__DEBUG__, _ledgerId, accessToken, url],
  )

  const connectFnMap = R.mapToObj(config.providers, (p) => [
    p.name,
    p.useConnectHook?.({
      ledgerId,
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
          () => ({
            trpc,
            connectFnMapRef,
            trpcClient,
            queryClient,
            ledgerId,
            isAdmin,
            developerMode,
          }),
          [trpcClient, queryClient, ledgerId, isAdmin, developerMode],
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
  TProviders extends readonly AnySyncProvider[],
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

/**
 * Used to create a callback to get the current value without re-rendering
 * whenever value changes...
 *
 * TODO: Move me to frontend utils...
 */
export function useGetter<T>(value: T) {
  const ref = React.useRef(value)
  React.useEffect(() => {
    ref.current = value
  }, [value, ref])
  return React.useCallback(() => ref.current, [ref])
}
