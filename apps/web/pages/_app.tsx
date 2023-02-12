import './global.css'

import {Hydrate, QueryClientProvider} from '@tanstack/react-query'
import {useAtomValue} from 'jotai'
import {NextAdapter} from 'next-query-params'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import React from 'react'
import {QueryParamProvider} from 'use-query-params'

import {veniceCommonConfig} from '@usevenice/app-config/commonConfig'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {Loading, UIProvider} from '@usevenice/ui'

import {accessTokenAtom, developerModeAtom} from '../contexts/atoms'
import {browserSupabase} from '../contexts/common-contexts'
import {SessionContextProvider, useSession} from '../contexts/session-context'
import {browserQueryClient} from '../lib/query-client'
import type {PageProps} from '../server'
import superjson from 'superjson'

/** Need this to be a separate function so we can have hooks... */
function _VeniceProvider({children}: {children: React.ReactNode}) {
  const accessTokenQueryParam = useAtomValue(accessTokenAtom)
  const [session, meta] = useSession()

  // console.log('session.accessToken', session?.access_token)
  const accessToken = session?.access_token ?? accessTokenQueryParam
  const developerMode = useAtomValue(developerModeAtom)

  if (meta.status === 'loading') {
    return <Loading />
  }
  // return null

  // if (!session) {
  //   console.log('Forceful early exit....')
  //   return null
  // }
  return (
    <VeniceProvider
      queryClient={browserQueryClient}
      config={veniceCommonConfig}
      accessToken={accessToken}
      developerMode={developerMode}>
      {children}
    </VeniceProvider>
  )
}

export function MyApp({Component, pageProps}: AppProps<PageProps>) {
  // console.log('MyApp re-render', pageProps)
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Venice — Financial data, fast.</title>
      </Head>

      <QueryParamProvider adapter={NextAdapter}>
        <QueryClientProvider client={browserQueryClient}>
          <Hydrate
            state={
              pageProps.dehydratedState &&
              superjson.deserialize(pageProps.dehydratedState)
            }>
            <SessionContextProvider supabaseClient={browserSupabase}>
              <_VeniceProvider>
                <UIProvider>
                  <Component {...pageProps} />
                </UIProvider>
              </_VeniceProvider>
            </SessionContextProvider>
          </Hydrate>
        </QueryClientProvider>
      </QueryParamProvider>
    </>
  )
}

// Workaround for usage of `rewrites` cause app to render twice unconditionally...
// https://github.com/vercel/next.js/discussions/27985
export default React.memo(MyApp)
