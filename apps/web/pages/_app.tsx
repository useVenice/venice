import './global.css'

import {useAtomValue} from 'jotai'
import {NextAdapter} from 'next-query-params'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import React from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister'
import {persistQueryClient} from '@tanstack/react-query-persist-client'
import {QueryParamProvider} from 'use-query-params'

import {veniceCommonConfig} from '@usevenice/app-config/commonConfig'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {UIProvider} from '@usevenice/ui'

import {accessTokenAtom, developerModeAtom} from '../contexts/atoms'
import {supabase} from '../contexts/common-contexts'
import {SessionContextProvider, useSession} from '../contexts/session-context'

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
  const persister = createSyncStoragePersister({storage: window.localStorage})
  // persistor.removeClient() // Will clean up cache

  void persistQueryClient({
    queryClient,
    persister,
    // Change this key if we change the format of the data to avoid crashes
    // also we should clear any persisted data if userId ever changes
    buster: undefined, // Should check against userId and version
  })
}

/** Need this to be a separate function so we can have hooks... */
function _VeniceProvider({children}: {children: React.ReactNode}) {
  const accessTokenQueryParam = useAtomValue(accessTokenAtom)
  const [session] = useSession()
  // console.log('session.accessToken', session?.access_token)
  const accessToken = session?.access_token ?? accessTokenQueryParam
  const developerMode = useAtomValue(developerModeAtom)

  // if (!session) {
  //   console.log('Forceful early exit....')
  //   return null
  // }
  return (
    <VeniceProvider
      queryClient={queryClient}
      config={veniceCommonConfig}
      accessToken={accessToken}
      developerMode={developerMode}>
      {children}
    </VeniceProvider>
  )
}

export function MyApp({Component, pageProps}: AppProps) {
  // console.log('MyApp re-render', pageProps)
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Venice — Financial data, fast.</title>
      </Head>

      <QueryParamProvider adapter={NextAdapter}>
        <QueryClientProvider client={queryClient}>
          <UIProvider>
            <SessionContextProvider supabaseClient={supabase}>
              <_VeniceProvider>
                <Component {...pageProps} />
              </_VeniceProvider>
            </SessionContextProvider>
          </UIProvider>
        </QueryClientProvider>
      </QueryParamProvider>
    </>
  )
}

// Workaround for usage of `rewrites` cause app to render twice unconditionally...
// https://github.com/vercel/next.js/discussions/27985
export default React.memo(MyApp)
