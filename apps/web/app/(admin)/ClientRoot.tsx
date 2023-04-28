'use client'

import '../global.css'

import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {QueryClientProvider} from '@tanstack/react-query'
import {TRPCProvider} from '@usevenice/engine-frontend'
import React from 'react'
import type {DehydratedState} from '../../components/SuperHydrate'
import {SuperHydrate} from '../../components/SuperHydrate'
import {InvalidateQueriesOnPostgresChanges} from '../../contexts/realtime'
import {SessionContextProvider} from '../../contexts/session-context'
import {createQueryClient} from '../../lib/query-client'
import type {Database} from '../../supabase/supabase.gen'

export function ClientRoot({
  children,
  ...props
}: {
  children: React.ReactNode
  accessToken?: string
  dehydratedState?: DehydratedState
}) {
  console.log('[ClientRoot] rendering')
  const {current: queryClient} = React.useRef(createQueryClient())
  const {current: supabase} = React.useRef(
    createBrowserSupabaseClient<Database>({}),
  )
  ;(globalThis as any).supabase = supabase
  ;(globalThis as any).queryClient = queryClient

  return (
    <QueryClientProvider client={queryClient}>
      <SuperHydrate dehydratedState={props.dehydratedState}>
        <TRPCProvider queryClient={queryClient} accessToken={undefined}>
          <InvalidateQueriesOnPostgresChanges supabase={supabase} />
          <SessionContextProvider supabase={supabase}>
            {children}
          </SessionContextProvider>
        </TRPCProvider>
      </SuperHydrate>
    </QueryClientProvider>
  )
}
