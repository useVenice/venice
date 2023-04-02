'use client'

import {createClient} from '@supabase/supabase-js'
import {QueryClientProvider} from '@tanstack/react-query'
import {commonEnv, veniceCommonConfig} from '@usevenice/app-config/commonConfig'
import {jwt} from '@usevenice/engine-backend/safeForFrontend'
import {VeniceProvider} from '@usevenice/engine-frontend'
import React from 'react'
import type {DehydratedState} from '../components/SuperHydrate'
import {SuperHydrate} from '../components/SuperHydrate'
import {createQueryClient} from '../lib/query-client'

export function ClientRoot(props: {
  children: React.ReactNode
  accessToken?: string
  dehydratedState?: DehydratedState
}) {
  const {current: queryClient} = React.useRef(createQueryClient())
  const jwtData = props.accessToken
    ? jwt.decode(props.accessToken, {json: true})
    : null

  // Global supabase
  const supabase = createClient(
    commonEnv.NEXT_PUBLIC_SUPABASE_URL,
    commonEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        storage: {
          getItem() {
            // @see required fields https://share.cleanshot.com/1RCGjGrs
            return props.accessToken && jwtData?.exp
              ? JSON.stringify({
                  access_token: props.accessToken,
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
  )
  ;(globalThis as any).supabase = supabase

  return (
    <QueryClientProvider client={queryClient}>
      <SuperHydrate dehydratedState={props.dehydratedState}>
        <VeniceProvider
          queryClient={queryClient}
          config={veniceCommonConfig}
          accessToken={props.accessToken}
          developerMode={false}>
          {props.children}
        </VeniceProvider>
      </SuperHydrate>
    </QueryClientProvider>
  )
}
