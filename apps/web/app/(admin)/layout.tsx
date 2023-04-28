'use client'

import '../global.css'

import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {QueryClientProvider} from '@tanstack/react-query'
// import {TRPCProvider} from '@usevenice/engine-frontend'
import React from 'react'
import {SessionContextProvider} from '../../contexts/session-context'
import {createQueryClient} from '../../lib/query-client'
import type {Database} from '../../supabase/supabase.gen'

export default function AdminLayout({children}: {children: React.ReactNode}) {
  console.log('[ClientRoot] rendering')
  const {current: queryClient} = React.useRef(createQueryClient())
  const {current: supabase} = React.useRef(
    createBrowserSupabaseClient<Database>({}),
  )
  ;(globalThis as any).supabase = supabase
  ;(globalThis as any).queryClient = queryClient

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabase={supabase}>
        {/* <TRPCProvider queryClient={queryClient} accessToken={undefined}> */}
          {children}
        {/* </TRPCProvider> */}
      </SessionContextProvider>
    </QueryClientProvider>
  )
}
