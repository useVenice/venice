/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type {Session, SupabaseClient} from '@supabase/supabase-js'
import {xAdminAppMetadataKey} from '@usevenice/engine-backend'

import React from 'react'
import {browserAnalytics} from '../lib/browser-analytics'
import type {Database} from '../supabase/supabase.gen'

/** TODO This ought to be a bit more generic... */
type AsyncStatus = 'loading' | 'error' | 'success'
type SessionContextValue = [
  session: Session | null | undefined,
  info: {status: AsyncStatus; error: unknown; supabase: SupabaseClient | null},
]
export const SessionContext = React.createContext<SessionContextValue>([
  undefined,
  {status: 'loading', error: null, supabase: null},
])

export interface SessionContextProps {
  supabase: SupabaseClient<Database>
  [propName: string]: unknown
}

// TODO: Introduce an additional session context that takes into account accessToken in url param etc.
/** Technically the supabase session context */
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

export function useSession() {
  const context = React.useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider.')
  }
  return context
}

export function useAuthState() {
  const [session] = useSession()
  const isAdmin = session?.user.app_metadata?.[xAdminAppMetadataKey] === true
  return {user: session?.user, isAdmin}
}

export function useSupabase() {
  const [, {supabase}] = useSession()
  if (!supabase) {
    throw new Error('Missing supabase in SessionContext')
  }
  return supabase
}
