import {
  AnySyncProvider,
  ConnectContext,
  LinkFactory,
  PreConnOptions,
} from '@ledger-sync/cdk-core'
import {
  IntegrationInput,
  makeSyncEngine,
  SyncEngineConfig,
} from '@ledger-sync/engine'
import {NonNullableOnly, R} from '@ledger-sync/util'
import {createReactQueryHooks} from '@trpc/react'
import React from 'react'

type Router = ReturnType<typeof makeSyncEngine>[1]
const trpc = createReactQueryHooks<Router>()

export const LSContext = React.createContext<{
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
  const client = trpc.createClient({
    url: routerUrl,
  })

  const hooks = R.mapToObj(config.providers, (p) => [
    p.name,
    p.useConnectHook?.(),
  ])

  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <LSContext.Provider value={{hooks, client}}>
        {children}
      </LSContext.Provider>
    </trpc.Provider>
  )
}

/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
LSProvider.useContext = () => React.useContext(LSContext)!

export function useLedgerSync(ctx: ConnectContext) {
  const res = trpc.useQuery(['listIntegrations', [ctx]])

  const {hooks, client} = LSProvider.useContext()
  const connect = React.useCallback(
    async function (
      int: NonNullableOnly<IntegrationInput, 'provider'>,
      {key, options}: PreConnOptions,
    ) {
      const res1 = await client.mutation('preConnect', [int, options])
      console.log(`${key} res1`, res1)

      const res2 = await hooks[int.provider]?.(res1)
      console.log(`${key} res2`, res2)

      const res3 = await client.mutation('postConnect', [int, res2])
      console.log(`${key} res3`, res3)
    },
    [hooks, client],
  )
  return {connect, preConnectOptionsRes: res}
}

// TODO: Figure out how to work with NextJS SSR here
// adding typeof withTRPC<Router> breaks prettier, let's figure it out...
// const withLedgerSync = (options: Parameters<typeof withTRPC>[0]) =>
//   withTRPC({
//     ...options,
//     // Improve typing to omit options.config.url, it is a noop
//     config: (info) => ({...options.config(info), url: routerUrl}),
//   })
