import type {Session} from '@supabase/supabase-js'
import type {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'
import React from 'react'

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
  supabaseClient: ReturnType<typeof createBrowserSupabaseClient>
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
      (_event, session) => {
        console.log('AuthChange event', _event)
        setValue([session ?? null, {error: null, status: 'success'}])
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
