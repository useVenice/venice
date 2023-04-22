import {VeniceProvider} from '@usevenice/engine-frontend'
import type {InferGetServerSidePropsType} from 'next'
import type {GetServerSideProps} from 'next'
import {PageHeader} from '../../components/PageHeader'
import {PageLayout} from '../../components/PageLayout'
import {DataTable} from '../../components/DataTable'
import {createSSRHelpers} from '../../server'

export const getServerSideProps = (async (ctx) => {
  const {user, getPageProps, ssg} = await createSSRHelpers(ctx)
  if (!user?.id) {
    return {redirect: {destination: '/admin/auth', permanent: false}}
  }
  await ssg.adminSearchEndUsers.prefetch({})
  return {props: {...getPageProps()}}
}) satisfies GetServerSideProps

export default function ShowUsers(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const {trpc} = VeniceProvider.useContext()

  const endUsersRes = trpc.adminSearchEndUsers.useQuery({})
  return (
    <PageLayout title="Connected users">
      <PageHeader title={['Connected users']} />
      <div className="p-6">
        <p>A list of users who have at least one connection</p>
        <DataTable
          rows={endUsersRes.data ?? []}
          isFetching={endUsersRes.isFetching}
        />
      </div>
    </PageLayout>
  )
}
