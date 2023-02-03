import {Loading} from '@usevenice/ui'
import {GetServerSideProps} from 'next'
import {getQueryKeys, mutations, queries} from '../lib/supabase-queries'
import {createSSRHelpers} from '../server'

export default function Debug() {
  const res = queries.usePipelinesList()
  console.log('pipelines', res.data)
  const updateResource = mutations.useUpdateResource()

  if (!res.data) {
    return <Loading />
  }
  return (
    <ul>
      {res.data.map((p) => (
        <li key={p.id}>
          {p.id} {p.source?.id} {p.source?.display_name}{' '}
          {p.source?.institution?.name}
          <button
            onClick={() =>
              updateResource.mutate({
                id: p.source?.id as any,
                display_name: `Hello ${new Date()}`,
              })
            }>
            {' '}
            Update display name
          </button>
          <br />
          <br />
        </li>
      ))}
    </ul>
  )
}

export const getServerSideProps = (async (_context) => {
  const {ssg, getPageProps, queryClient, supabase} = await createSSRHelpers(
    _context,
  )

  // await ssg.health.prefetch(undefined)
  // Unfortunately have to duplicate queryKey and data fetcher settings...
  // Quite a bit of boilerplate...
  await queryClient.prefetchQuery(getQueryKeys(supabase).pipelines.list)

  return {
    props: {
      // ...getPageProps(), // Dehyrated properties is currently causing crash due to undefined not being valid json value...
      ids: [],
    },
  }
}) satisfies GetServerSideProps
