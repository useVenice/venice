import {useQuery} from '@tanstack/react-query'
import {VeniceProvider} from '@usevenice/engine-frontend'
import type {InferGetServerSidePropsType} from 'next'
import {GetServerSideProps} from 'next'
import React from 'react'
import {browserSupabase} from '../contexts/common-contexts'
import {getQueryKeys, mutations} from '../lib/supabase-queries'
import {createSSRHelpers} from '../server'

// Should this be moved to _app getInitialProps?
export const getServerSideProps = (async (ctx) => {
  const {ssg, getPageProps, queryClient, supabase} = await createSSRHelpers(ctx)

  await ssg.health.prefetch(undefined)
  await queryClient.prefetchQuery(getQueryKeys(supabase).pipelines.list)

  return {props: {...getPageProps(), ids: []}}
}) satisfies GetServerSideProps

export default function Debug(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const {trpc} = VeniceProvider.useContext()
  const res = trpc.health.useQuery(undefined, {enabled: false})

  const res2 = useQuery(getQueryKeys(browserSupabase).pipelines.list)

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

  const updateResource = mutations.useUpdateResource()

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
          updateResource.mutate({
            id: pipelines?.[0]?.source?.id as any,
            display_name: `new name ${new Date().toString()}`,
          })
        }}>
        Update
      </button>
    </h1>
  )
}
