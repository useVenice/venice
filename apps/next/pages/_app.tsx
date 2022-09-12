import '../__generated__/tailwind.css'

import {NextAdapter} from 'next-query-params'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import {QueryClient, QueryClientProvider} from 'react-query'
import {QueryParamProvider} from 'use-query-params'

import {ledgerSyncCommonConfig} from '@ledger-sync/app-config/commonConfig'
import {LSProvider} from '@ledger-sync/engine-frontend'

import {PortalParamsProvider} from '../contexts/PortalParamsContext'

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 5 * 60 * 1000, // 5 mins
      refetchOnWindowFocus: false, // Too many requests for going between devTool and not... alternative is to change the stale time
    },
  },
})

export default function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>LedgerSync</title>
      </Head>

      <QueryParamProvider adapter={NextAdapter}>
        <QueryClientProvider client={reactQueryClient}>
          <LSProvider
            queryClient={reactQueryClient}
            config={ledgerSyncCommonConfig}>
            <PortalParamsProvider>
              <Component {...pageProps} />
            </PortalParamsProvider>
          </LSProvider>
        </QueryClientProvider>
      </QueryParamProvider>
    </>
  )
}
