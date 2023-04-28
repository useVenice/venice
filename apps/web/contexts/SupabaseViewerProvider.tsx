/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type {Session, SupabaseClient} from '@supabase/supabase-js'

import type {Viewer} from '@usevenice/cdk-core'
import {zViewerFromUnverifiedJwtToken} from '@usevenice/cdk-core'
import React from 'react'
import {browserAnalytics} from '../lib/browser-analytics'
import type {Database} from '../supabase/supabase.gen'
import type {AsyncStatus} from './viewer-context'
import {ViewerContext} from './viewer-context'

export const SupabaseContext = React.createContext<
  | {
      session: Session | null | undefined
      supabase: SupabaseClient
    }
  | undefined
>(undefined)

export interface SupabaseProviderProps {
  supabase: SupabaseClient<Database>
  initialViewer?: Viewer & {accessToken?: string | null}
  children: React.ReactNode
}

// TODO: Maybe separate out to SupabaseProvider and ViewerProvider?
export function SupabaseViewerProvider({
  supabase,
  initialViewer = {role: 'anon'},
  children,
}: SupabaseProviderProps) {
  const [{session, error, status}, setState] = React.useState<{
    session: Session | null
    error: unknown
    status: AsyncStatus
  }>({
    status: 'initial',
    session: null,
    error: null,
  })

  React.useEffect(() => {
    supabase.auth
      .getSession()
      .then(({data, error}) => {
        setState({session: data.session, error, status: 'success'})
      })
      .catch((err) => {
        setState({session: null, error: err, status: 'error'})
      })
    const {data: authListener} = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          browserAnalytics.track({name: 'user/signin', data: {}})
        } else if (event === 'SIGNED_OUT') {
          browserAnalytics.track({name: 'user/signout', data: {}})
        }
        console.log('AuthChange event', event)
        setState({session, error: null, status: 'success'})
      },
    )
    return () => authListener?.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {id: userId, email, phone} = session?.user ?? {}

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

  const accessToken =
    status === 'initial' || status === 'loading'
      ? initialViewer.accessToken
      : session?.access_token
  const viewer =
    status === 'initial' || status === 'loading'
      ? initialViewer
      : zViewerFromUnverifiedJwtToken.parse(accessToken)
  return (
    <SupabaseContext.Provider value={{session, supabase}}>
      <ViewerContext.Provider value={{error, status, viewer, accessToken}}>
        {children}
      </ViewerContext.Provider>
    </SupabaseContext.Provider>
  )
}

export function useSupabaseContext() {
  const context = React.useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error(
      'Did you forget SupabaseProvider? useSupabase must be used within a SupabaseContext.Provder',
    )
  }
  return context
}
