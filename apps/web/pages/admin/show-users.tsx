import {VeniceProvider} from '@usevenice/engine-frontend'
import type {InferGetServerSidePropsType} from 'next'
import {GetServerSideProps} from 'next'
import {PageHeader} from '../../components/PageHeader'
import {AdminPageLayout} from '../../components/PageLayout'
import {DataTable} from '../../components/DataTable'
import {createSSRHelpers} from '../../server'

export const getServerSideProps = (async (ctx) => {
  const {user, getPageProps, ssg} = await createSSRHelpers(ctx)
  if (!user?.id) {
    return {redirect: {destination: '/admin/auth', permanent: false}}
  }
  await ssg.adminSearchCreatorIds.prefetch({})
  return {props: {...getPageProps()}}
}) satisfies GetServerSideProps

export default function ShowUsers(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const {trpc} = VeniceProvider.useContext()

  const creatorIdRes = trpc.adminSearchCreatorIds.useQuery({})
  return (
    <AdminPageLayout title="Connected users">
      <PageHeader title={['Connected users']} />
      <div className="p-6">
        <p>A list of users who have at least one connection</p>
        <DataTable
          rows={creatorIdRes.data ?? []}
          isFetching={creatorIdRes.isFetching}
        />
      </div>
    </AdminPageLayout>
  )
}
