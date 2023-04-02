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

import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
import superjson from 'superjson'
import {accessTokenAtom, developerModeAtom} from '../contexts/atoms'
import {SessionContextProvider, useSession} from '../contexts/session-context'
import {useGlobalRouteTransitionEffect} from '../hooks/useGlobalRouteTransitionEffect'

import {InvalidateQueriesOnPostgresChanges} from '../contexts/realtime'
import {browserAnalytics} from '../lib/browser-analytics'
import {createQueryClient} from '../lib/query-client'
import type {PageProps} from '../server'
import type {Database} from '../supabase/supabase.gen'

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

export function MyApp({Component, pageProps}: AppProps<PageProps>) {
  const {current: queryClient} = React.useRef(createQueryClient())
  const {current: supabase} = React.useRef(
    // https://app.supabase.com/project/hhnxsazpojeczkeeifli/settings/api
    createBrowserSupabaseClient<Database>({
      // supabaseUrl: commonEnv.NEXT_PUBLIC_SUPABASE_URL,
      // supabaseKey: commonEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      // @see https://github.com/supabase/auth-helpers/pull/449
      // auth: {autoRefreshToken: true}, // auth-helpers-nextjs does not allow passing options to auth: at the moment
    }),
  )
  ;(globalThis as any).supabase = supabase

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
            <SessionContextProvider supabase={supabase}>
              <_VeniceProvider queryClient={queryClient}>
                <InvalidateQueriesOnPostgresChanges supabase={supabase} />
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
