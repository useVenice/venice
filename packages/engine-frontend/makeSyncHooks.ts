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
import {withTRPC} from '@trpc/next'
import {createReactQueryHooks} from '@trpc/react'
import React from 'react'

/** TODO: Should this be useLedgerSync or useConnect or useSync? */
export function makeSyncHooks<
  T extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>(config: SyncEngineConfig<T, TLinks>) {
  console.log('makeSyncHooks', config)
  const [sc, router] = makeSyncEngine(config)
  // Not sure why we cannot just do typeof router , oh well
  type Router = ReturnType<typeof makeSyncEngine>[1]

  // https://stackoverflow.com/questions/44342226/next-js-error-only-absolute-urls-are-supported
  // This relative url will not work in server-side-rendering.
  const routerUrl = config.routerUrl ?? '/api/ledger-sync'
  const trpc = createReactQueryHooks<Router>()
  const client = trpc.createClient({
    url: routerUrl,
  })

  function Provider(
    props: Omit<Parameters<typeof trpc['Provider']>[0], 'client'>,
  ) {
    return trpc.Provider({...props, client})
  }

  // adding typeof withTRPC<Router> breaks prettier, let's figure it out...
  const withLedgerSync = (options: Parameters<typeof withTRPC>[0]) =>
    withTRPC({
      ...options,
      // Improve typing to omit options.config.url, it is a noop
      config: (info) => ({...options.config(info), url: routerUrl}),
    })

  function useConnect(ctx: ConnectContext) {
    console.log('useConnect')

    // This is rather annoying... needing to have two array wrappers. How do we fix it?
    const res = trpc.useQuery(['listIntegrations', [ctx]])

    const hooks = R.mapToObj(sc.providers, (p) => [
      p.name,
      p.useConnectHook?.(),
    ])

    const connect = React.useCallback(
      async function (
        int: NonNullableOnly<IntegrationInput<T[number]>, 'provider'>,
        {key, options}: PreConnOptions,
      ) {
        const res1 = await client.mutation('preConnect', [int, options])
        console.log(`${key} res1`, res1)

        const res2 = await hooks[int.provider]?.(res1)
        console.log(`${key} res2`, res2)

        const res3 = await client.mutation('postConnect', [int, res2])
        console.log(`${key} res3`, res3)
      },
      [hooks],
    )

    // Figure out how to memo this would be ideal...
    return {connect, listIntegrationsRes: res}
  }

  return {
    useConnect,
    ls: sc,
    router,
    Provider,
    withLedgerSync,
  }
}
