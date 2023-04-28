'use client'

import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {QueryClientProvider, useQueryClient} from '@tanstack/react-query'
// import {TRPCProvider} from '@usevenice/engine-frontend'
import type {Viewer} from '@usevenice/cdk-core'
import {TRPCProvider} from '@usevenice/engine-frontend'
import React from 'react'
import {
  SupabaseViewerProvider,
  useSupabaseContext,
} from '../../contexts/SupabaseViewerProvider'
import {createQueryClient} from '../../lib/query-client'
import type {Database} from '../../supabase/supabase.gen'
import {useViewerContext} from '../../contexts/viewer-context'

export function AdminLayout({
  children,
  initialViewer,
}: {
  children: React.ReactNode
  initialViewer: Viewer & {accessToken?: string | null}
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
      <SupabaseViewerProvider supabase={supabase} initialViewer={initialViewer}>
        <_TRPCProvider>{children}</_TRPCProvider>
      </SupabaseViewerProvider>
    </QueryClientProvider>
  )
}

function _TRPCProvider({children}: {children: React.ReactNode}) {
  const queryClient = useQueryClient()
  const {accessToken} = useViewerContext()

  return (
    <TRPCProvider queryClient={queryClient} accessToken={accessToken}>
      {children}
    </TRPCProvider>
  )
}
