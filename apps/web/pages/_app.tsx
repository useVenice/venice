import './global.css'

import type {QueryClient} from '@tanstack/react-query'
import {Hydrate, QueryClientProvider} from '@tanstack/react-query'
import {useAtomValue} from 'jotai'
import {NextAdapter} from 'next-query-params'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import React from 'react'
import {QueryParamProvider} from 'use-query-params'

import {commonEnv, veniceCommonConfig} from '@usevenice/app-config/commonConfig'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {Loading, UIProvider} from '@usevenice/ui'

import superjson from 'superjson'
import {accessTokenAtom, developerModeAtom} from '../contexts/atoms'
import {browserSupabase} from '../contexts/common-contexts'
import {SessionContextProvider, useSession} from '../contexts/session-context'
import {useGlobalRouteTransitionEffect} from '../hooks/useGlobalRouteTransitionEffect'

import {browserAnalytics} from '../lib/browser-analytics'
import {createQueryClient} from '../lib/query-client'
import {usePostgresChanges} from '../lib/supabase-queries'
import type {PageProps} from '../server'

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  browserAnalytics.init(commonEnv.NEXT_PUBLIC_POSTHOG_WRITEKEY!)
}

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

function InvalidateQueriesOnPostgresChanges() {
  const {trpc} = VeniceProvider.useContext()
  const trpcUtils = trpc.useContext()

  const invalidate = React.useCallback(
    () => trpcUtils.listConnections.invalidate(),
    [trpcUtils],
  )
  usePostgresChanges('resource', invalidate)
  usePostgresChanges('pipeline', invalidate)
  return null
}

export function MyApp({Component, pageProps}: AppProps<PageProps>) {
  const {current: queryClient} = React.useRef(createQueryClient())
  useGlobalRouteTransitionEffect()

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
                <InvalidateQueriesOnPostgresChanges />
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
