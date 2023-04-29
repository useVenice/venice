'use client'

import {useAuth} from '@clerk/nextjs'
import type {SupabaseClient} from '@supabase/auth-helpers-nextjs'
import {QueryClientProvider} from '@tanstack/react-query'
import React, {useEffect} from 'react'

import {zViewerFromUnverifiedJwtToken} from '@usevenice/cdk-core'
import {TRPCProvider, trpcReact} from '@usevenice/engine-frontend'

import {createSupabaseClient} from '@/lib/supabase-queries'

import {createQueryClient} from '../lib/query-client'
import {usePostgresChanges} from './realtime'
import type {AsyncStatus} from './viewer-context'
import {ViewerContext} from './viewer-context'

export function ClientRoot(props: {
  children: React.ReactNode
  /** Viewer will be inferred from this... */
  initialAccessToken?: string | null
}) {
  console.log(
    '[ClientRoot] rendering initialToken?',
    props.initialAccessToken != null,
  )
  const [accessToken, setAccessToken] = React.useState(props.initialAccessToken)
  const auth = useAuth()
  const viewer = React.useMemo(
    () => zViewerFromUnverifiedJwtToken.parse(accessToken),
    [accessToken],
  )
  const status: AsyncStatus = auth.isLoaded ? 'loading' : 'success'

  useEffect(() => {
    void auth.getToken({template: 'supabase'}).then((t) => setAccessToken(t))
  }, [auth])

  const {current: supabase} = React.useRef(
    createSupabaseClient(() => accessToken),
  )
  // NOTE: Should change queryClient when authenticated identity changes to reset all trpc cache
  const {current: queryClient} = React.useRef(createQueryClient())

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).accessToken = accessToken
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).auth = auth
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).viewer = viewer
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).queryClient = queryClient
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).supabase = supabase

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} accessToken={accessToken}>
        <InvalidateQueriesOnPostgresChanges supabase={supabase} />
        <ViewerContext.Provider
          value={React.useMemo(
            () => ({accessToken, status, viewer}),
            [accessToken, status, viewer],
          )}>
          {props.children}
        </ViewerContext.Provider>
      </TRPCProvider>
    </QueryClientProvider>
  )
}

// MARK: - React
export const InvalidateQueriesOnPostgresChanges = React.memo(
  function InvalidateQueriesOnPostgresChanges(props: {
    supabase: SupabaseClient
  }) {
    const trpcUtils = trpcReact.useContext()

    const invalidateConnections = React.useCallback(() => {
      void trpcUtils.listConnections.invalidate()
      void trpcUtils.listPipelines.invalidate()
    }, [trpcUtils])
    usePostgresChanges(props.supabase, 'resource', invalidateConnections)
    usePostgresChanges(props.supabase, 'pipeline', invalidateConnections)

    // prettier-ignore
    usePostgresChanges(props.supabase, 'integration', React.useCallback(() => {
      void trpcUtils.adminGetIntegration.invalidate()
    }, [trpcUtils]))
    return null
  },
)

// browserAnalytics.track({name: 'user/signin', data: {}})
// browserAnalytics.track({name: 'user/signout', data: {}})
// browserAnalytics.identify(userId, {
//   email: email || undefined,
//   phone: phone || undefined,
// })
// browserAnalytics.reset()
