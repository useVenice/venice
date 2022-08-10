import {NonNullableOnly, R} from '@alka/util'
import {
  AnySyncProvider, IntegrationInput, LinkFactory, makeCoreSync,
  PreConnOptions,
  SyncCoreConfig
} from '@ledger-sync/core-sync'
import {withTRPC} from '@trpc/next'
import {createReactQueryHooks} from '@trpc/react'

/** TODO: Should this be useLedgerSync or useConnect or useSync? */
export function makeSyncHooks<
  T extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>(config: SyncCoreConfig<T, TLinks>) {
  const [sc, router] = makeCoreSync(config)
  // Not sure why we cannot just do typeof router , oh well
  type Router = ReturnType<typeof makeCoreSync>[1]

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

  function useConnect() {
    console.log('useConnect')

    const hooks = R.mapToObj(sc.providers, (p) => [
      p.name,
      p.useConnectHook?.(),
    ])

    // Figure out how to memo this would be ideal...
    return {
      // Validate the provider name
      async connect(
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
    }
  }

  const preConnectInputs = sc.providers.flatMap((p) =>
    R.pipe(
      p.getPreConnectInputs?.(),
      (opts) => opts?.map((o) => ({...o, label: `${p.name} ${o.label}`})),
      (opts): PreConnOptions[] =>
        opts ?? [{key: p.name, label: p.name, options: undefined}],
    ).map((opts) => ({
      ...opts,
      provider: p,
      // TODO: Retrieve list of integrations from server
      // Ideally only load the frontend code for the list of enabled integrations
      // Dynamically rather than all integrations
      // We will need to introduce a Provider component because hooks
      // cannot be run conditionally
      int: {
        provider: p.name as T[number]['name'],
        // id: `int_${p.name}_demo` as IntId<T[number]['name']>,
        config: undefined,
      },
    })),
  )

  return {
    useConnect,
    ls: sc,
    router,
    Provider,
    withLedgerSync,
    preConnectInputs,
  }
}
