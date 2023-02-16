import './global.css'

import type {QueryClient} from '@tanstack/react-query'
import {Hydrate, QueryClientProvider} from '@tanstack/react-query'
import {useAtomValue} from 'jotai'
import {NextAdapter} from 'next-query-params'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import React, {useRef} from 'react'
import {QueryParamProvider} from 'use-query-params'

import {veniceCommonConfig} from '@usevenice/app-config/commonConfig'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {Loading, UIProvider} from '@usevenice/ui'

import 'nprogress/nprogress.css'
import NProgress from 'nprogress'

import superjson from 'superjson'
import {accessTokenAtom, developerModeAtom} from '../contexts/atoms'
import {browserSupabase} from '../contexts/common-contexts'
import {SessionContextProvider, useSession} from '../contexts/session-context'
import {createQueryClient} from '../lib/query-client'
import type {PageProps} from '../server'

/** Need this to be a separate function so we can have hooks... */
function _VeniceProvider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
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
      queryClient={queryClient}
      config={veniceCommonConfig}
      accessToken={accessToken}
      developerMode={developerMode}>
      {children}
    </VeniceProvider>
  )
}

export function MyApp({Component, pageProps, router}: AppProps<PageProps>) {
  const {current: queryClient} = useRef(createQueryClient())

  React.useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      template:
        "<div class='bar' role='bar' style='height: 0.1rem; background: #12b886;'></div>",
    })
    const handleRouteStart = () => NProgress.start()
    const handleRouteDone = () => NProgress.done()

    router.events.on('routeChangeStart', handleRouteStart)
    router.events.on('routeChangeComplete', handleRouteDone)
    router.events.on('routeChangeError', handleRouteDone)

    return () => {
      // Make sure to remove the event handler on unmount!
      router.events.off('routeChangeStart', handleRouteStart)
      router.events.off('routeChangeComplete', handleRouteDone)
      router.events.off('routeChangeError', handleRouteDone)
    }
  })

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Venice — Financial data, fast.</title>
      </Head>

      <QueryParamProvider adapter={NextAdapter}>
        <QueryClientProvider client={queryClient}>
          <Hydrate
            state={
              pageProps.dehydratedState &&
              superjson.deserialize(pageProps.dehydratedState)
            }>
            <SessionContextProvider supabaseClient={browserSupabase}>
              <_VeniceProvider queryClient={queryClient}>
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
