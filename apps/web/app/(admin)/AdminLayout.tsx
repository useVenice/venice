'use client'

import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {QueryClientProvider} from '@tanstack/react-query'
import {zViewerFromUnverifiedJwtToken} from '@usevenice/cdk-core'
import {TRPCProvider} from '@usevenice/engine-frontend'
import React from 'react'
import {
  SupabaseProvider,
  useSupabaseContext,
} from '../../contexts/supabase-context'
import {ViewerContext} from '../../contexts/viewer-context'
import {createQueryClient} from '../../lib/query-client'
import type {Database as DB} from '../../supabase/supabase.gen'

export function AdminLayout(props: {
  children: React.ReactNode
  /** Viewer will be inferred from this... */
  initialAccessToken: string | null | undefined
}) {
  console.log('[AdminLayout] rendering', props.initialAccessToken)
  const {current: supabase} = React.useRef(createBrowserSupabaseClient<DB>({}))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).supabase = supabase

  return (
    <SupabaseProvider supabase={supabase}>
      <AdminLayoutInner {...props} />
    </SupabaseProvider>
  )
}

/** Separate Inner component is needed in order to useSupabaseContext */
function AdminLayoutInner({
  children,
  initialAccessToken,
}: React.ComponentProps<typeof AdminLayout>) {
  const {session, status, error} = useSupabaseContext()
  const accessToken =
    status === 'initial' || status === 'loading'
      ? initialAccessToken
      : session?.access_token
  const viewer = zViewerFromUnverifiedJwtToken.parse(accessToken)

  // NOTE: Should change queryClient when authenticated identity changes to reset all trpc cache
  const {current: queryClient} = React.useRef(createQueryClient())
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).queryClient = queryClient

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} accessToken={accessToken}>
        <ViewerContext.Provider value={{error, status, viewer, accessToken}}>
          {children}
        </ViewerContext.Provider>
      </TRPCProvider>
    </QueryClientProvider>
  )
}
