import {useQuery} from '@tanstack/react-query'
import {GetServerSideProps} from 'next'
import {browserSupabase} from '../contexts/common-contexts'
import {getQueries} from '../lib/queries'
import {createSSRHelpers} from '../server'

export default function Debug() {
  const res = useQuery({
    ...getQueries(browserSupabase).pipelines.all,

    enabled: false,
  })
  console.log('data', res.data?.[0])
  // new QueryClient().prefetchQuery({meta})
  return null
}

export const getServerSideProps = (async (_context) => {
  const {ssg, getPageProps, queryClient, supabase} = await createSSRHelpers(
    _context,
  )

  await ssg.health.prefetch(undefined)
  // Unfortunately have to duplicate queryKey and data fetcher settings...
  // Quite a bit of boilerplate...
  await queryClient.prefetchQuery(getQueries(supabase).pipelines.all)

  return {props: {...getPageProps(), ids: []}}
}) satisfies GetServerSideProps
