'use client'

import type {RealtimePostgresChangesPayload} from '@supabase/realtime-js'
import {RealtimeClient} from '@supabase/realtime-js'
import type {SupabaseClient} from '@supabase/supabase-js'
import React from 'react'

import {commonEnv} from '@usevenice/app-config/commonConfig'
import {trpcReact} from '@usevenice/engine-frontend'
import {joinPath} from '@usevenice/util'

import type {Database} from '../supabase/supabase.gen'

// https://db-dev.venice.is
// wss://db-dev.venice.is/realtime/v1/websocket

export function createRealtimeClient() {
  return new RealtimeClient(
    joinPath(
      commonEnv.NEXT_PUBLIC_SUPABASE_URL.replace('https', 'wss'),
      'realtime/v1',
    ),
    {params: {apikey: commonEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY}},
  )
}

// MARK: - React
export function InvalidateQueriesOnPostgresChanges(props: {
  client: SupabaseClient | RealtimeClient
}) {
  const trpcUtils = trpcReact.useContext()

  const invalidate = React.useCallback(() => {
    void trpcUtils.listConnections.invalidate()
    void trpcUtils.listPipelines.invalidate()
  }, [trpcUtils])
  usePostgresChanges(props.client, 'resource', invalidate)
  usePostgresChanges(props.client, 'pipeline', invalidate)
  return null
}

// TODO: Change this to supabase lib

/** Ties to component lifecycle. Prefer global ones for subscription */
export function usePostgresChanges(
  client: SupabaseClient | RealtimeClient,
  tableName: keyof Database['public']['Tables'],
  fn: (change: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  React.useEffect(() => subscribePostgresChanges(client, tableName, fn).unsub)
}

// MARK: - Utils

export function subscribePostgresChanges(
  client: SupabaseClient | RealtimeClient,
  tableName: keyof Database['public']['Tables'],
  fn: (change: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  const sub = client
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
