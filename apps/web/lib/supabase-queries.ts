import {createQueryKeyStore} from '@lukemorales/query-key-factory'
import type {
  RealtimePostgresChangesPayload,
  SupabaseClient,
} from '@supabase/supabase-js'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import type {Id} from '@usevenice/cdk-core'
import React from 'react'
import {browserSupabase} from '../contexts/common-contexts'
import type {Database} from './supabase.gen'

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
    const queryClient = useQueryClient()

    // TODO: Move the invalidation logic to a global context so we only maintain a single
    // subscription
    const invalidate = React.useCallback(
      () =>
        queryClient.invalidateQueries(
          getQueryKeys(browserSupabase).pipelines._def,
        ),
      [queryClient],
    )
    // Consider updating query data directly rather than invalidating for things like sync status updates
    usePostgresChanges('pipeline', invalidate)
    usePostgresChanges('resource', invalidate)
    // Institutions do not change very often so no need to monitor closely
    return useQuery({
      ...getQueryKeys(browserSupabase).pipelines.list,
      // Never stale because we explicitly invalidate using supabase realtime
      staleTime: Number.POSITIVE_INFINITY,
    })
  },
}

// MARK: Mutations

export const mutations = {
  useUpdateResource: () => {
    const queryClient = useQueryClient()
    return useMutation(
      async ({
        id,
        ...update
      }: Database['public']['Tables']['resource']['Update'] & {
        id: Id['reso']
      }) => browserSupabase.from('resource').update(update).eq('id', id),
      {
        // Unfortunately we don't have access to the variables at render time
        // If we need a mutationKey per pipeline update we are gonna have to call
        // useUpdateResource within PipelineCard or something similar.
        // @see https://share.cleanshot.com/Px624f99
        mutationKey: ['updateResource'],
        // Consider updating query data directly rather than invalidating
        // This may actually not necessary anymore due to usePostgresChanges
        // However due to unmounting / remounting often times changes may actually get missed
        // therefore we still need this for now to be sure
        // We should figure out why react query is not deduplicating the requests though
        // They seem to fire one another
        onSuccess: () =>
          queryClient.invalidateQueries(
            getQueryKeys(browserSupabase).pipelines._def,
          ),
      },
    )
  },
}

// MARK: Subscriptions

export function usePostgresChanges(
  tableName: keyof Database['public']['Tables'],
  fn: (payload: RealtimePostgresChangesPayload<Record<string, any>>) => void,
) {
  React.useEffect(() => {
    const sub = browserSupabase
      .channel('any')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: tableName},
        (payload) => {
          console.log(`[postgres_changes] public.${tableName}`, payload)
          fn(payload)
        },
      )
      .subscribe()
    console.log(`[postgres_changes] Sub public.${tableName}`)
    return () => {
      console.log(`[postgres_changes] Unsub public.${tableName}`)
      void sub.unsubscribe()
    }
  })
}
