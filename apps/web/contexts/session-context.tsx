/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type {Session, SupabaseClient} from '@supabase/supabase-js'

import React from 'react'
import {browserAnalytics} from '../lib/browser-analytics'
import type {Database} from '../supabase/supabase.gen'
import type {Viewer, ViewerRole} from '@usevenice/cdk-core'
import {hasRole, zViewerFromUnverifiedJwtToken} from '@usevenice/cdk-core'

/** TODO This ought to be a bit more generic... */
type AsyncStatus = 'loading' | 'error' | 'success'
// TODO: Rename this to viewerContext...
type SessionContextValue = [
  session: Session | null | undefined,
  info: {status: AsyncStatus; error: unknown; supabase: SupabaseClient},
]
export const SessionContext = React.createContext<
  SessionContextValue | undefined
>(undefined)

export interface SessionContextProps {
  supabase: SupabaseClient<Database>
  [propName: string]: unknown
}

// TODO: Introduce an additional session context that takes into account accessToken in url param etc.
/** Technically the supabase session context */
// TODO: Rename this to SupabaseViewerProvider
export function SessionContextProvider({
  supabase: supabase,
  ...props
}: SessionContextProps) {
  const [value, setValue] = React.useState<SessionContextValue>([
    undefined,
    {status: 'loading', error: null, supabase},
  ])
  React.useEffect(() => {
    supabase.auth
      .getSession()
      .then(({data}) => {
        setValue([
          data.session ?? null,
          {error: null, status: 'success', supabase},
        ])
      })
      .catch((err) => {
        setValue([null, {error: err, status: 'error', supabase}])
      })

    const {data: authListener} = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          browserAnalytics.track({name: 'user/signin', data: {}})
        } else if (event === 'SIGNED_OUT') {
          browserAnalytics.track({name: 'user/signout', data: {}})
        }
        console.log('AuthChange event', event)
        setValue([session ?? null, {error: null, status: 'success', supabase}])
      },
    )
    return () => authListener?.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {id: userId, email, phone} = value[0]?.user ?? {}

  React.useEffect(() => {
    if (userId) {
      browserAnalytics.identify(userId, {
        email: email || undefined,
        phone: phone || undefined,
      })
    } else {
      browserAnalytics.reset()
    }
  }, [email, phone, userId])

  return <SessionContext.Provider {...props} value={value} />
}

export function useViewerInfo(): {
  viewer: Viewer
  status: AsyncStatus
  user?: Session['user'] | null
  accessToken?: string | null
  supabase: SupabaseClient
}
export function useViewerInfo<R extends ViewerRole>(
  allowedRoles: R[],
): {
  viewer: Viewer<R>
  status: AsyncStatus
  user?: Session['user'] | null
  accessToken?: string | null
  supabase: SupabaseClient
}
export function useViewerInfo<R extends ViewerRole>(allowedRoles?: R[]) {
  const context = React.useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useViewer must be used within a SessionContextProvider.')
  }
  const [session, {status, supabase}] = context
  const viewer = zViewerFromUnverifiedJwtToken.parse(session?.access_token)

  if (allowedRoles && !hasRole(viewer, allowedRoles)) {
    throw new Error(
      `Viewer does not have any of the required roles: ${allowedRoles.join(
        ', ',
      )}`,
    )
  }
  return {
    viewer,
    status,
    user: session?.user,
    accessToken: session?.access_token,
    supabase,
  }
}

/** Use carefully, should only be used with viewer of type `user` */
export function useSupabase() {
  const context = React.useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SessionContextProvider.')
  }
  if (!context[1].supabase) {
    throw new Error('Missing supabase in SessionContext')
  }
  return context[1].supabase
}
