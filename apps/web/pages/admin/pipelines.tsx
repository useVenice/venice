import type {UserId} from '@usevenice/cdk-core'
import {VeniceProvider} from '@usevenice/engine-frontend'
import type {GetServerSideProps, InferGetServerSidePropsType} from 'next'
import {PageHeader} from '../../components/PageHeader'
import {PageLayout} from '../../components/PageLayout'
import {PipelinesTable} from '../../components/PipelinesTable'
import {createSSRHelpers, ensureDefaultResourceAndPipelines} from '../../server'

// Should this be moved to _app getInitialProps?
export const getServerSideProps = (async (context) => {
  const {user, getPageProps, ssg} = await createSSRHelpers(context)
  if (!user?.id) {
    return {
      redirect: {
        destination: '/admin/auth',
        permanent: false,
      },
    }
  }

  const [integrations] = await Promise.all([
    ssg.listIntegrations.fetch({}),
    ssg.listPipelines.fetch({}),
  ])

  const ledgerIds = await ensureDefaultResourceAndPipelines(user.id, {
    heronIntegrationId: integrations.find((i) => i.providerName === 'heron')
      ?.id,
  })
  return {
    props: {
      ...getPageProps(),
      ledgerIds,
      userId: user.id as UserId,
      integrations,
    },
  }
}) satisfies GetServerSideProps

export default function PipelinesPage(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const {trpc} = VeniceProvider.useContext()
  const pipelines = trpc.listPipelines.useQuery({})

  return (
    <PageLayout title="Pipelines" auth="user">
      <div className="">
        <PageHeader title={['Pipelines']} />
        {pipelines.isLoading ? (
          <span>Loading...</span>
        ) : (
          <PipelinesTable pipelines={pipelines.data ?? []} />
        )}
      </div>
    </PageLayout>
  )
}
