import type {Session, SupabaseClient} from '@supabase/supabase-js'
import React from 'react'

/** TODO This ought to be a bit more generic... */
type AsyncStatus = 'initial' | 'loading' | 'success' | 'error'
type SessionContextValue = [
  session: Session | null | undefined,
  info: {status: AsyncStatus; error: unknown; loading: boolean},
]
export const SessionContext = React.createContext<SessionContextValue>([
  undefined,
  {status: 'initial', error: null, loading: true},
])

export interface Props {
  supabaseClient: SupabaseClient
  [propName: string]: unknown
}

// TODO: Introduce an additional session context that takes into account accessToken in url param etc.
/** Technically the supabase session context */
export function SessionContextProvider({supabaseClient, ...props}: Props) {
  const [value, setValue] = React.useState<SessionContextValue>([
    undefined,
    {status: 'initial', error: null, loading: true},
  ])
  React.useEffect(() => {
    supabaseClient.auth
      .getSession()
      .then(({data}) => {
        setValue([
          data.session ?? null,
          {error: null, status: 'success', loading: false},
        ])
      })
      .catch((err) => {
        setValue([null, {error: err, status: 'error', loading: false}])
      })

    const {data: authListener} = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setValue([
          session ?? null,
          {error: null, status: 'success', loading: false},
        ])
      },
    )
    return () => authListener?.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
