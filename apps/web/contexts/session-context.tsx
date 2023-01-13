import type {Session, SupabaseClient} from '@supabase/supabase-js'
import React from 'react'

/** TODO This ought to be a bit more generic... */
type AsyncStatus = 'initial' | 'loading' | 'success' | 'error'
export const SessionContext = React.createContext<
  [session: Session | null | undefined, info: {status: AsyncStatus}]
>([undefined, {status: 'initial'}])

export interface Props {
  supabaseClient: SupabaseClient
  [propName: string]: unknown
}

// TODO: Introduce an additional session context that takes into account accessToken in url param etc.
/** Technically the supabase session context */
export function SessionContextProvider({supabaseClient, ...props}: Props) {
  const [session, setSession] = React.useState<Session | null | undefined>(
    undefined,
  )
  const [status, setStatus] = React.useState<AsyncStatus>('initial')

  React.useEffect(() => {
    supabaseClient.auth
      .getSession()
      .then(({data}) => {
        setSession(data.session)
        setStatus('success')
      })
      .catch(() => {
        setSession(null)
        setStatus('error')
      })

    const {data: authListener} = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      },
    )
    return () => authListener?.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SessionContext.Provider
      {...props}
      value={React.useMemo(() => [session, {status}], [session, status])}
    />
  )
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
