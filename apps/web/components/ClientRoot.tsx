'use client'

import {useAuth} from '@clerk/nextjs'
import {QueryClientProvider} from '@tanstack/react-query'
import React, {useEffect, useRef} from 'react'

import {commonEnv} from '@usevenice/app-config/commonConfig'
import {getViewerId, zViewerFromUnverifiedJwtToken} from '@usevenice/cdk-core'
import {TRPCProvider} from '@usevenice/engine-frontend'
import {Toaster} from '@usevenice/ui/new-components'

import {createQueryClient} from '../lib-client/react-query-client'
import {
  createRealtimeClient,
  InvalidateQueriesOnPostgresChanges,
} from '../lib-client/supabase-realtime'
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
    // TODO: Are we better off signing ourselves server side and avoid needing a round-trip to Clerk?
    // Access token is needed because we need to connect to supabase-realtime
    const template = commonEnv.NEXT_PUBLIC_CLERK_SUPABASE_JWT_TEMPLATE_NAME
    void auth.getToken({template}).then((t) => setAccessToken(t))
  }, [auth])

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  ;(globalThis as any).auth = auth

  return (
    <ClientRoot
      {...props}
      accessToken={accessToken}
      trpcAccessToken={null} // Workaround for token expired error
      authStatus={status}
    />
  )
}

export function ClientRoot({
  authStatus: status,
  accessToken,
  children,
  trpcAccessToken,
}: {
  children: React.ReactNode
  /** Viewer will be inferred from this... */
  accessToken?: string | null
  /**
   * temporary solution to token expired error.. As authorization header
   * prevents clerk from using cookie auth
   * @see https://clerk.com/docs/request-authentication/cross-origin
   */
  trpcAccessToken?: string | null
  authStatus: AsyncStatus
}) {
  console.log('[ClientRoot] rendering initialToken?', accessToken != null)

  const viewer = React.useMemo(
    () => zViewerFromUnverifiedJwtToken.parse(accessToken),
    [accessToken],
  )

  const {current: realtime} = useRef(createRealtimeClient())

  // TODO: Gotta maintain real time connection over time...
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
      <TRPCProvider
        queryClient={queryClient}
        accessToken={
          trpcAccessToken !== undefined ? trpcAccessToken : accessToken
        }>
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

// browserAnalytics.track({name: 'user/signin', data: {}})
// browserAnalytics.track({name: 'user/signout', data: {}})
// browserAnalytics.identify(userId, {
//   email: email || undefined,
//   phone: phone || undefined,
// })
// browserAnalytics.reset()
