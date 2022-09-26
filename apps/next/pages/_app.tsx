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

import {veniceCommonConfig} from '@ledger-sync/app-config/commonConfig'
import type {Id} from '@ledger-sync/cdk-core'
import {VeniceProvider} from '@ledger-sync/engine-frontend'
import {UIProvider} from '@ledger-sync/ui'

import {accessTokenAtom, developerModeAtom} from '../contexts/atoms'

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
function _VeniceProvider({children}: {children: React.ReactNode}) {
  const accessToken = useAtomValue(accessTokenAtom)
  const {ledgerId} = useRouterQuery() as {ledgerId: Id['ldgr'] | undefined}
  return (
    <VeniceProvider
      queryClient={queryClient}
      config={veniceCommonConfig}
      accessToken={accessToken}
      developerMode={useAtomValue(developerModeAtom)}
      ledgerId={ledgerId}>
      {children}
    </VeniceProvider>
  )
}

export default function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Venice</title>
      </Head>

      <QueryParamProvider adapter={NextAdapter}>
        <QueryClientProvider client={queryClient}>
          <UIProvider>
            <_VeniceProvider>
              <Component {...pageProps} />
            </_VeniceProvider>
          </UIProvider>
        </QueryClientProvider>
      </QueryParamProvider>
    </>
  )
}
