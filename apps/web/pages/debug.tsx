import type {SupabaseClient} from '@supabase/supabase-js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {VeniceProvider} from '@usevenice/engine-frontend'
import type {InferGetServerSidePropsType} from 'next'
import {GetServerSideProps} from 'next'
import React from 'react'
import {browserSupabase} from '../contexts/common-contexts'
import type {Database} from '../lib/supabase.gen'
import {createSSRHelpers} from '../server'

async function getPipelines(supabase: SupabaseClient<Database>) {
  type Resource = Pick<
    Database['public']['Tables']['resource']['Row'],
    'id' | 'display_name' | 'provider_name'
  >
  return supabase
    .from('pipeline')
    .select(
      'id, last_sync_completed_at, source:source_id(id, display_name,provider_name), destination:destination_id(id,display_name, provider_name)',
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
}

// Should this be moved to _app getInitialProps?
export const getServerSideProps = (async (_context) => {
  const {ssg, getPageProps, queryClient, supabase} = await createSSRHelpers(
    _context,
  )

  await ssg.health.prefetch(undefined)
  // Unfortunately have to duplicate queryKey and data fetcher settings...
  // Quite a bit of boilerplate...
  await queryClient.prefetchQuery(['pipelines'], () => getPipelines(supabase))

  return {props: {...getPageProps(), ids: []}}
}) satisfies GetServerSideProps

export default function Debug(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const {trpc, queryClient} = VeniceProvider.useContext()
  const res = trpc.health.useQuery(undefined, {enabled: false})

  const res2 = useQuery(['pipelines'], () => getPipelines(browserSupabase), {
    // enabled: false,
    // staleTime: 1000,
    // refetchInterval: 1000,
  })

  React.useEffect(() => {
    const sub = browserSupabase
      .channel('any')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'pipeline'},
        (payload) => {
          console.log('Change received!', payload)
        },
      )
      .subscribe()

    console.log('listenened to postgres_changes')

    return () => {
      console.log('Unsub to postgres_changes')
      void sub.unsubscribe()
    }
  })

  const updateDisplayName = useMutation(
    async ({resourceId, newName}: {resourceId: string; newName: string}) =>
      browserSupabase
        .from('resource')
        .update({display_name: newName})
        .eq('id', resourceId),
    {onSuccess: () => queryClient.invalidateQueries(['pipelines'])},
  )

  const pipelines = res2.data ?? []
  console.log('pipelines', pipelines)

  return (
    <h1 className="text-white">
      how are you {res.data} pipelines {res2.data?.length}
      <ul>
        {pipelines.map((p) => (
          <li key={p.id}>
            {p.source?.id} {p.source?.display_name}
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          updateDisplayName.mutate({
            resourceId: pipelines?.[0]?.source?.id ?? '',
            newName: new Date().toString(),
          })
        }}>
        Update
      </button>
    </h1>
  )
}
