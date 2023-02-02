import type {SupabaseClient} from '@supabase/supabase-js'
import {useQuery} from '@tanstack/react-query'
import {VeniceProvider} from '@usevenice/engine-frontend'
import type {InferGetServerSidePropsType} from 'next'
import {GetServerSideProps} from 'next'
import {browserSupabase} from '../contexts/common-contexts'
import type {Database} from '../lib/supabase.gen'
import {createSSRHelpers} from '../server'

async function getPipelines(supabase: SupabaseClient<Database>) {
  return supabase
    .from('pipeline')
    .select('*')
    .then((r) => r.data ?? [])
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
  const {trpc} = VeniceProvider.useContext()
  const res = trpc.health.useQuery(undefined, {enabled: false})

  const res2 = useQuery(['pipelines'], () => getPipelines(browserSupabase), {
    enabled: false,
  })

  return (
    <h1 className="text-white">
      how are you {res.data} pipelines {res2.data?.length}
    </h1>
  )
}
