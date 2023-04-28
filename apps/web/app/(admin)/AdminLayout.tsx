'use client'

import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {QueryClientProvider} from '@tanstack/react-query'
// import {TRPCProvider} from '@usevenice/engine-frontend'
import type {Viewer} from '@usevenice/cdk-core'
import React from 'react'
import {SupabaseProvider} from '../../contexts/SupabaseProvider'
import {createQueryClient} from '../../lib/query-client'
import type {Database} from '../../supabase/supabase.gen'

export function AdminLayout({
  children,
  initialViewer,
}: {
  children: React.ReactNode
  initialViewer: Viewer
}) {
  console.log('[AdminLayout] rendering', initialViewer)
  const {current: queryClient} = React.useRef(createQueryClient())
  const {current: supabase} = React.useRef(
    createBrowserSupabaseClient<Database>({}),
  )
  ;(globalThis as any).supabase = supabase
  ;(globalThis as any).queryClient = queryClient

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider supabase={supabase} initialViewer={initialViewer}>
        {/* <TRPCProvider queryClient={queryClient} accessToken={undefined}> */}
        {children}
        {/* </TRPCProvider> */}
      </SupabaseProvider>
    </QueryClientProvider>
  )
}
