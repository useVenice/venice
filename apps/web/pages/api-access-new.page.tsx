import {Tabs, TabsContent, TabsTriggers} from '@usevenice/ui'
import {GetServerSideProps} from 'next'
import {
  SQLAccessCard,
  VeniceGraphQLExplorer,
  VeniceRestExplorer,
} from '../components/api-access-new'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'

// for server-side
import {serverGetUser} from '../server'

export const getServerSideProps = (async (ctx) => {
  const [user] = await serverGetUser(ctx)
  if (!user?.id) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }
  return {props: {}}
}) satisfies GetServerSideProps

enum PrimaryTabsKey {
  graphqlAPI = 'graphqlAPI',
  restAPI = 'restAPI',
  database = 'database',
}

export default function ApiAccessNewPage() {
  return (
    <PageLayout title="API Access">
      <PageHeader title={['API Access']} />
      <div className="p-6">
        <Tabs
          // the id doesn't do anything, just for readability
          id="PrimaryTabs"
          className="flex flex-col"
          defaultValue={PrimaryTabsKey.graphqlAPI}>
          <TabsTriggers
            options={[
              {key: PrimaryTabsKey.graphqlAPI, label: 'GraphQL API'},
              {key: PrimaryTabsKey.restAPI, label: 'Rest API'},
              {key: PrimaryTabsKey.database, label: 'Database'},
            ]}
          />
          <TabsContent
            className="flex flex-col pt-6"
            value={PrimaryTabsKey.graphqlAPI}>
            <VeniceGraphQLExplorer />
          </TabsContent>
          <TabsContent value={PrimaryTabsKey.restAPI}>
            <VeniceRestExplorer />
          </TabsContent>
          <TabsContent
            className="max-w-[30rem]"
            value={PrimaryTabsKey.database}>
            <SQLAccessCard />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
