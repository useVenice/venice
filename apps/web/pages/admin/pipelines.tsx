import type {UserId} from '@usevenice/cdk-core'
import {VeniceProvider} from '@usevenice/engine-frontend'
import type {GetServerSideProps, InferGetServerSidePropsType} from 'next'
import {PageHeader} from '../../components/PageHeader'
import {PageLayout} from '../../components/PageLayout'
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

export default function ConnectionsPage(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const {trpc} = VeniceProvider.useContext()
  const pipelines = trpc.listPipelines.useQuery({})

  return (
    <PageLayout title="Pipelines" auth="user">
      <div className="grid min-h-screen grid-rows-[auto_1fr]">
        <PageHeader title={['Pipelines']} />

        <div className="flex flex-col">
          {pipelines.isLoading ? (
            <span>Loading...</span>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Last Sync</th>
                  <th>Sync Now</th>
                </tr>
              </thead>
              <tbody>
                {(pipelines.data ?? []).map((pipe) => (
                  <tr key={pipe.id}>
                    <td>{pipe.id}</td>
                    <td>{JSON.stringify(pipe.source)}</td>
                    <td>{JSON.stringify(pipe.destination)}</td>
                    <td>{pipe.syncInProgress}</td>
                    <td>Button...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
