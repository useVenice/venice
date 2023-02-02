import {VeniceProvider} from '@usevenice/engine-frontend'
import type {InferGetServerSidePropsType} from 'next'
import {GetServerSideProps} from 'next'

export default function Debug(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const {trpc} = VeniceProvider.useContext()
  const res = trpc.health.useQuery(undefined, {enabled: false})
  // React.useEffect(() => {
  //   void browserSupabase
  //     .from('resource')
  //     .select('*')
  //     .then((res) => {
  //       console.log('res', res.data)
  //     })
  //   const sub = browserSupabase
  //     .channel('any')
  //     .on(
  //       'postgres_changes',
  //       {event: '*', schema: 'public', table: 'resource'},
  //       (payload) => {
  //         console.log('Change received!', payload)
  //       },
  //     )
  //     .subscribe()

  //   console.log('listenened to postgres_changes')

  //   return () => {
  //     console.log('Unsub to postgres_changes')
  //     void sub.unsubscribe()
  //   }
  // })

  return <h1 className="text-white">how are you {res.data}</h1>
}

import {createProxySSGHelpers} from '@trpc/react-query/ssg'

// Should this be moved to _app getInitialProps?
export const getServerSideProps = (async (_context) => {
  await import('@usevenice/app-config/register.node')
  const {veniceRouter} = await import('@usevenice/app-config/backendConfig')

  const ssg = createProxySSGHelpers({
    router: veniceRouter,
    ctx: {},
    // transformer: superjson,
  })
  await ssg.health.prefetch(undefined)

  // ssg.
  // const supabase = createServerSupabaseClient<Database>(context)

  // const res = await supabase.from('pipeline').select('*')
  // console.log('pipelines', res)
  // const user = await serverGetUser(context)
  // if (!user?.id) {
  //   return {redirect: {destination: '/', permanent: false}}
  // }

  // const {ensureDatabaseUser, dropDbUser} = await import('../server/procedures')
  // await dropDbUser(user.id)
  // const ids = await ensureDatabaseUser(user.id)

  return {props: {ids: [], dehydratedState: ssg.dehydrate()}}
}) satisfies GetServerSideProps
