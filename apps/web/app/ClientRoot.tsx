'use client'

import {createClient} from '@supabase/supabase-js'
import {QueryClientProvider} from '@tanstack/react-query'
import {commonEnv, veniceCommonConfig} from '@usevenice/app-config/commonConfig'
import {jwt} from '@usevenice/engine-backend/zdeprecated_safeForFrontend'
import {VeniceProvider} from '@usevenice/engine-frontend'
import React from 'react'
import type {DehydratedState} from '../components/SuperHydrate'
import {SuperHydrate} from '../components/SuperHydrate'
import {InvalidateQueriesOnPostgresChanges} from '../contexts/realtime'
import {SessionContextProvider} from '../contexts/session-context'
import {createQueryClient} from '../lib/query-client'

export function ClientRoot(props: {
  children: React.ReactNode
  accessToken?: string
  dehydratedState?: DehydratedState
}) {
  console.log('[ClientRoot] rendering')
  const {current: queryClient} = React.useRef(createQueryClient())
  const {current: supabase} = React.useRef(
    createClient(
      commonEnv.NEXT_PUBLIC_SUPABASE_URL,
      commonEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          storage: {
            getItem() {
              const jwtData = props.accessToken
                ? jwt.decode(props.accessToken, {json: true})
                : null
              return props.accessToken && jwtData?.exp
                ? JSON.stringify({
                    access_token: props.accessToken,
                    // Required fields for goTrue-js _isValidSession()
                    // @see https://share.cleanshot.com/1RCGjGrs
                    refresh_token: '',
                    expires_at: jwtData?.exp,
                  })
                : null
            },
            removeItem() {},
            setItem() {},
          },
        },
      },
    ),
  )
  ;(globalThis as any).supabase = supabase
  ;(globalThis as any).queryClient = queryClient

  return (
    <QueryClientProvider client={queryClient}>
      <SuperHydrate dehydratedState={props.dehydratedState}>
        <VeniceProvider
          queryClient={queryClient}
          config={veniceCommonConfig}
          accessToken={props.accessToken}
          developerMode={false}>
          <InvalidateQueriesOnPostgresChanges supabase={supabase} />
          <SessionContextProvider supabase={supabase}>
            {props.children}
          </SessionContextProvider>
        </VeniceProvider>
      </SuperHydrate>
    </QueryClientProvider>
  )
}
