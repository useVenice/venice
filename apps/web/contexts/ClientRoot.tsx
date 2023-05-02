'use client'

import {useAuth} from '@clerk/nextjs'
import type {RealtimeClient} from '@supabase/realtime-js'
import {QueryClientProvider} from '@tanstack/react-query'
import React, {useEffect, useRef} from 'react'

import {getViewerId, zViewerFromUnverifiedJwtToken} from '@usevenice/cdk-core'
import {TRPCProvider, trpcReact} from '@usevenice/engine-frontend'
import {Toaster} from '@usevenice/ui/new-components'

import {createQueryClient} from '../lib/query-client'
import {createRealtimeClient, usePostgresChanges} from './realtime'
import type {AsyncStatus} from './viewer-context'
import {ViewerContext} from './viewer-context'

export function ClientRootWithClerk(props: {
  children: React.ReactNode
  /** Viewer will be inferred from this... */
  initialAccessToken?: string | null
}) {
  const [accessToken, setAccessToken] = React.useState(props.initialAccessToken)
  const auth = useAuth()
  const status: AsyncStatus = auth.isLoaded ? 'loading' : 'success'
  useEffect(() => {
    void auth.getToken({template: 'supabase'}).then((t) => setAccessToken(t))
  }, [auth])

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).auth = auth

  return <ClientRoot {...props} accessToken={accessToken} authStatus={status} />
}

export function ClientRoot({
  authStatus: status,
  accessToken,
  children,
}: {
  children: React.ReactNode
  /** Viewer will be inferred from this... */
  accessToken?: string | null
  authStatus: AsyncStatus
}) {
  console.log('[ClientRoot] rendering initialToken?', accessToken != null)

  const viewer = React.useMemo(
    () => zViewerFromUnverifiedJwtToken.parse(accessToken),
    [accessToken],
  )

  const {current: realtime} = useRef(createRealtimeClient())

  useEffect(() => {
    if (!realtime.isConnected()) {
      realtime.connect()
    }
    realtime.setAuth(accessToken ?? null)
  }, [realtime, accessToken])

  // NOTE: Recreate query client does not seem to do the trick... so we explicitly invalidate
  const {current: queryClient} = React.useRef(createQueryClient())
  useEffect(() => {
    console.log('invalidate all queries')
    void queryClient.invalidateQueries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getViewerId(viewer)])

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).accessToken = accessToken

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).viewer = viewer
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).queryClient = queryClient
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).realtime = realtime

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} accessToken={accessToken}>
        <InvalidateQueriesOnPostgresChanges client={realtime} />
        <ViewerContext.Provider
          value={React.useMemo(
            () => ({accessToken, status, viewer}),
            [accessToken, status, viewer],
          )}>
          {children}
          <Toaster />
        </ViewerContext.Provider>
      </TRPCProvider>
    </QueryClientProvider>
  )
}

// MARK: - React
export const InvalidateQueriesOnPostgresChanges = React.memo(
  function InvalidateQueriesOnPostgresChanges(props: {client: RealtimeClient}) {
    const trpcUtils = trpcReact.useContext()

    const invalidateConnections = React.useCallback(() => {
      void trpcUtils.listConnections.invalidate()
      void trpcUtils.listPipelines.invalidate()
    }, [trpcUtils])
    usePostgresChanges(props.client, 'resource', invalidateConnections)
    usePostgresChanges(props.client, 'pipeline', invalidateConnections)

    // prettier-ignore
    usePostgresChanges(props.client, 'integration', React.useCallback(() => {
      void trpcUtils.adminGetIntegration.invalidate()
      void trpcUtils.adminListIntegrations.invalidate()
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
