import type {AnySyncProvider, LinkFactory} from '@ledger-sync/cdk-core'
import type {makeSyncEngine, SyncEngineConfig} from '@ledger-sync/engine'
import {R} from '@ledger-sync/util'
import {createReactQueryHooks} from '@trpc/react'
import React from 'react'

type Router = ReturnType<typeof makeSyncEngine>[1]
const trpc = createReactQueryHooks<Router>()

export const LSContext = React.createContext<{
  trpc: typeof trpc
  client: ReturnType<typeof trpc.createClient>
  hooks: Record<string, ((connectInput: any) => Promise<any>) | undefined>
} | null>(null)

export function LSProvider<
  T extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>({
  children,
  config,
  queryClient,
}: {
  children: React.ReactNode
  config: SyncEngineConfig<T, TLinks>
  queryClient: Parameters<typeof trpc.Provider>[0]['queryClient']
}) {
  const routerUrl = config.routerUrl ?? '/api/ledger-sync'
  const client = trpc.createClient({url: routerUrl})

  const hooks = R.mapToObj(config.providers, (p) => [
    p.name,
    p.useConnectHook?.(),
  ])

  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <LSContext.Provider value={{trpc, hooks, client}}>
        {children}
      </LSContext.Provider>
    </trpc.Provider>
  )
}

/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
LSProvider.useContext = () => React.useContext(LSContext)!

// TODO: Figure out how to work with NextJS SSR here
// adding typeof withTRPC<Router> breaks prettier, let's figure it out...
// const withLedgerSync = (options: Parameters<typeof withTRPC>[0]) =>
//   withTRPC({
//     ...options,
//     // Improve typing to omit options.config.url, it is a noop
//     config: (info) => ({...options.config(info), url: routerUrl}),
//   })
