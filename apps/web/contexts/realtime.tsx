'use client'

import type {
  RealtimePostgresChangesPayload,
  SupabaseClient,
} from '@supabase/supabase-js'
import React from 'react'
import type {Database} from '../supabase/supabase.gen'

import {VeniceProvider} from '@usevenice/engine-frontend'

// MARK: - React
export function InvalidateQueriesOnPostgresChanges(props: {
  supabase: SupabaseClient
}) {
  const {trpc} = VeniceProvider.useContext()
  const trpcUtils = trpc.useContext()

  const invalidate = React.useCallback(() => {
    void trpcUtils.listConnections.invalidate()
    void trpcUtils.listPipelines.invalidate()
  }, [trpcUtils])
  usePostgresChanges(props.supabase, 'resource', invalidate)
  usePostgresChanges(props.supabase, 'pipeline', invalidate)
  return null
}

/** Ties to component lifecycle. Prefer global ones for subscription */
export function usePostgresChanges(
  supabase: SupabaseClient,
  tableName: keyof Database['public']['Tables'],
  fn: (change: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  React.useEffect(() => subscribePostgresChanges(supabase, tableName, fn).unsub)
}

// MARK: - Utils

export function subscribePostgresChanges(
  supabase: SupabaseClient,
  tableName: keyof Database['public']['Tables'],
  fn: (change: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  const sub = supabase
    // Unique channel name otherwise multiple calls to subscribe would overwrite each other
    .channel(`pg/public.${tableName}.${Date.now()}`)
    .on(
      'postgres_changes',
      {event: '*', schema: 'public', table: tableName},
      (change) => {
        console.log(`[postgres_changes] public.${tableName}`, change)
        fn(change)
      },
    )
    .subscribe()
  console.log(`[postgres_changes] Sub public.${tableName}`)
  return {
    ...sub,
    unsub: () => {
      console.log(`[postgres_changes] Unsub public.${tableName}`)
      void sub.unsubscribe()
    },
  }
}
