import {createQueryKeyStore} from '@lukemorales/query-key-factory'
import type {SupabaseClient} from '@supabase/supabase-js'
// import {browserSupabase} from '../contexts/common-contexts'
import type {Database} from './supabase.gen'

export const getQueries = (supabase: SupabaseClient<Database>) =>
  createQueryKeyStore({
    pipelines: {
      // all: () => ({
      //   queryFn: async (ctx) => getPipelines(browserSupabase),
      // }),
      // all: () => ({
      //   queryKey: null,
      //   queryFn: () => ['hello'],
      // }),

      all: {
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
                    row as typeof row & {
                      source: Resource
                      destination: Resource
                    },
                ) ?? [],
            )
        },
      },

      detail: (userId: string) => ({
        queryKey: [userId],
        queryFn: (ctx) => ({userId}),
      }),
    },
  })
