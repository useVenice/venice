import '../__generated__/tailwind.css'

import {useAtomValue} from 'jotai'
import {NextAdapter} from 'next-query-params'
import {useRouterQuery} from 'next-router-query'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import React from 'react'
import {QueryClient, QueryClientProvider} from 'react-query'
import {createWebStoragePersistor} from 'react-query/createWebStoragePersistor-experimental'
import {persistQueryClient} from 'react-query/persistQueryClient-experimental'
import {QueryParamProvider} from 'use-query-params'

import {ledgerSyncCommonConfig} from '@ledger-sync/app-config/commonConfig'
import type {Id} from '@ledger-sync/cdk-core'
import {LSProvider} from '@ledger-sync/engine-frontend'

import {accessTokenAtom, useAccessToken} from '../contexts/PortalParamsContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 5 * 60 * 1000, // 5 mins by default, reduce refetching...
      refetchOnWindowFocus: false, // Too many requests for going between devTool and not... alternative is to change the stale time
      // refetchOnMount: false,
      // refetchOnReconnect: false,
      // How do we configure it that the only time we "refetch" is when we cmd+r reload the window?
      // We still want to stale-while-revalidate though and thus we persist the query cache.
    },
  },
})

if (
  typeof window !== 'undefined' &&
  !window.location.href.includes('localhost')
) {
  const persistor = createWebStoragePersistor({storage: window.localStorage})
  // persistor.removeClient() // Will clean up cache

  void persistQueryClient({
    queryClient,
    persistor,
    // Change this key if we change the format of the data to avoid crashes
    // also we should clear any persisted data if userId ever changes
    buster: undefined, // Should check against userId and version
  })
}

/** Need this to be a separate function so we can have hooks... */
function _LSProvider({children}: {children: React.ReactNode}) {
  const accessToken = useAtomValue(accessTokenAtom)
  const {ledgerId} = useRouterQuery() as {ledgerId: Id['ldgr'] | undefined}
  return (
    <LSProvider
      queryClient={queryClient}
      config={ledgerSyncCommonConfig}
      accessToken={accessToken}
      ledgerId={ledgerId}>
      {children}
    </LSProvider>
  )
}

export default function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>LedgerSync</title>
      </Head>
      {/*
       Interesting how the Provider is actually not even needed...
       @yenbekbay let me know if you think we should in fact add a provider...
       */}
      {/* <PortalParamsProvider> */}
      <QueryParamProvider adapter={NextAdapter}>
        <QueryClientProvider client={queryClient}>
          <_LSProvider>
            <Component {...pageProps} />
          </_LSProvider>
        </QueryClientProvider>
      </QueryParamProvider>
      {/* </PortalParamsProvider> */}
    </>
  )
}

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
