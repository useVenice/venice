import {createQueryKeyStore} from '@lukemorales/query-key-factory'
import type {
  RealtimePostgresChangesPayload,
  SupabaseClient,
} from '@supabase/supabase-js'
import {useMutation, useQuery} from '@tanstack/react-query'
import type {Id} from '@usevenice/cdk-core'
import {atom, useAtom} from 'jotai'
import React from 'react'
import {browserSupabase} from '../contexts/common-contexts'
import type {Database} from '../supabase/supabase.gen'
import {queryClient} from './query-client'

// MARK: Queries

export const getQueryKeys = (supabase: SupabaseClient<Database>) =>
  createQueryKeyStore({
    pipelines: {
      list: {
        queryKey: null,
        queryFn: () => {
          type Resource = Pick<
            Database['public']['Tables']['resource']['Row'],
            'id' | 'display_name' | 'provider_name'
          > & {institution: {id: string; name: string} | null}

          return supabase
            .from('pipeline')
            .select(
              `id,
               last_sync_completed_at,
               source:source_id (id, display_name, provider_name, institution (id)),
               destination:destination_id (id, display_name, provider_name, institution (id))`,
            )
            .then(
              (r) =>
                r.data?.map(
                  (row) =>
                    // Consider enforcing pipeline must have source & destination statically
                    row as typeof row & {
                      source: Resource | null
                      destination: Resource | null
                    },
                ) ?? [],
            )
        },
      },
    },
  })

export const queries = {
  usePipelinesList: () => {
    // Not sure why useAtom is not working...
    useAtom(postgresSubscriptionsAtom)
    return useQuery({
      ...getQueryKeys(browserSupabase).pipelines.list,
      // Never stale because we explicitly invalidate using supabase realtime
      staleTime: Number.POSITIVE_INFINITY,
    })
  },
}

// MARK: Mutations

export const mutations = {
  useUpdateResource: () =>
    useMutation(
      async ({
        id,
        ...update
      }: Database['public']['Tables']['resource']['Update'] & {
        id: Id['reso']
      }) => browserSupabase.from('resource').update(update).eq('id', id),
      {
        // TODO: Consider optimistic update
        // Unfortunately we don't have access to the variables at render time
        // If we need a mutationKey per pipeline update we are gonna have to call
        // useUpdateResource within PipelineCard or something similar.
        // @see https://share.cleanshot.com/Px624f99
        mutationKey: ['updateResource'],

        // Consider updating query data directly rather than invalidating
        // This is not always necessary due to finicky issues with Suapbase realtime
        // For example two simultaneous subscriptions seems to break it
        // However due to network sometimes times changes may actually get missed
        // therefore we still need this for now to be sure
        // We should figure out why react query is not deduplicating the requests though
        // They seem to fire one another
        onSuccess: () =>
          queryClient.invalidateQueries(
            getQueryKeys(browserSupabase).pipelines._def,
          ),
      },
    ),
}

// MARK: Subscriptions

export const postgresSubscriptionsAtom = atom<PostgresSubscription[]>([])
postgresSubscriptionsAtom.onMount = (setAtom) => {
  const invalidate = () =>
    queryClient.invalidateQueries(getQueryKeys(browserSupabase).pipelines._def)
  // Consider updating query data directly rather than invalidating for things like sync status updates
  const subs = [
    subscribePostgresChanges('resource', invalidate),
    // it seems that if we have two subscriptions then we don't get any changes at all
    // but if we have one subscription we do... why is that possibly the case?
    // subscribePostgresChanges('pipeline', invalidate),

    // Institutions do not change very often so no need to monitor closely
  ]
  setAtom(subs)
  return () => subs.forEach((s) => s.unsub())
}

// MARK: - Utilities

type PostgresSubscription = ReturnType<typeof subscribePostgresChanges>

export function subscribePostgresChanges(
  tableName: keyof Database['public']['Tables'],
  fn: (change: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  const sub = browserSupabase
    .channel('any')
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
    // ...sub,
    unsub: () => {
      console.log(`[postgres_changes] Unsub public.${tableName}`)
      void sub.unsubscribe()
    },
  }
}

/** Ties to component lifecycle. Prefer global ones for subscription */
export function usePostgresChanges(
  tableName: keyof Database['public']['Tables'],
  fn: (change: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  React.useEffect(() => subscribePostgresChanges(tableName, fn).unsub)
}
