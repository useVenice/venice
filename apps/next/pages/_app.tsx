import '../__generated__/tailwind.css'

import {NextAdapter} from 'next-query-params'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import {QueryClient, QueryClientProvider} from 'react-query'
import {createWebStoragePersistor} from 'react-query/createWebStoragePersistor-experimental'
import {persistQueryClient} from 'react-query/persistQueryClient-experimental'
import {QueryParamProvider} from 'use-query-params'

import {ledgerSyncCommonConfig} from '@ledger-sync/app-config/commonConfig'
import {LSProvider} from '@ledger-sync/engine-frontend'

import {PortalParamsProvider} from '../contexts/PortalParamsContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 mins by default, reduce refetching...
      refetchOnWindowFocus: false, // Too many requests for going between devTool and not... alternative is to change the stale time
      refetchOnMount: false,
      refetchOnReconnect: false,
      // How do we configure it that the only time we "refetch" is when we cmd+r reload the window?
      // We still want to stale-while-revalidate though and thus we persist the query cache.
    },
  },
})

if (typeof window !== 'undefined') {
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

export default function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>LedgerSync</title>
      </Head>

      <QueryParamProvider adapter={NextAdapter}>
        <QueryClientProvider client={queryClient}>
          <LSProvider queryClient={queryClient} config={ledgerSyncCommonConfig}>
            <PortalParamsProvider>
              <Component {...pageProps} />
            </PortalParamsProvider>
          </LSProvider>
        </QueryClientProvider>
      </QueryParamProvider>
    </>
  )
}
