/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type {Session, SupabaseClient} from '@supabase/supabase-js'

import React from 'react'
import {browserAnalytics} from '../lib/browser-analytics'

/** TODO This ought to be a bit more generic... */
type AsyncStatus = 'loading' | 'error' | 'success'
type SessionContextValue = [
  session: Session | null | undefined,
  info: {status: AsyncStatus; error: unknown},
]
export const SessionContext = React.createContext<SessionContextValue>([
  undefined,
  {status: 'loading', error: null},
])

export interface SessionContextProps {
  supabaseClient: SupabaseClient
  [propName: string]: unknown
}

// TODO: Introduce an additional session context that takes into account accessToken in url param etc.
/** Technically the supabase session context */
export function SessionContextProvider({
  supabaseClient,
  ...props
}: SessionContextProps) {
  const [value, setValue] = React.useState<SessionContextValue>([
    undefined,
    {status: 'loading', error: null},
  ])
  React.useEffect(() => {
    supabaseClient.auth
      .getSession()
      .then(({data}) => {
        setValue([data.session ?? null, {error: null, status: 'success'}])
      })
      .catch((err) => {
        setValue([null, {error: err, status: 'error'}])
      })

    const {data: authListener} = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          browserAnalytics.track({name: 'user/signin', data: {}})
        } else if (event === 'SIGNED_OUT') {
          browserAnalytics.track({name: 'user/signout', data: {}})
        }
        console.log('AuthChange event', event)
        setValue([session ?? null, {error: null, status: 'success'}])
      },
    )
    return () => authListener?.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const user = value[0]?.user

  React.useEffect(() => {
    if (user) {
      browserAnalytics.identify(user.id, {
        email: user.email || undefined,
        phone: user.phone || undefined,
      })
    } else {
      browserAnalytics.reset()
    }
  }, [user])

  return <SessionContext.Provider {...props} value={value} />
}

export function useSession() {
  const context = React.useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider.')
  }
  return context
}

export function useUser() {
  const [session, info] = useSession()
  return [session === undefined ? undefined : session?.user, info] as const
}
