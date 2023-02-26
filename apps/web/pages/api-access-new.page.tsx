import {Tabs, TabsContent, TabsTriggers} from '@usevenice/ui'
import type {GetServerSideProps} from 'next'
import {
  VeniceGraphQLExplorer,
  VeniceDatabaseExplorer,
  SQLAccessCard,
} from '../components/api-access'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'

// for server-side
import {z} from '@usevenice/util'
import {serverGetUser} from '../server'

interface ServerSideProps {
  apiKey: string
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx,
) => {
  const [user] = await serverGetUser(ctx)
  if (!user?.id) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }

  const apiKey = z.string().parse(user.user_metadata['apiKey'])

  return {
    props: {
      apiKey,
    },
  }
}

enum PrimaryTabsKey {
  graphqlAPI = 'graphqlAPI',
  restAPI = 'restAPI',
  database = 'database',
}

export default function Page(props: ServerSideProps) {
  const {apiKey} = props
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
              {key: PrimaryTabsKey.restAPI, label: 'Query API'},
              {key: PrimaryTabsKey.database, label: 'Database'},
            ]}
          />
          <TabsContent
            className="flex flex-col pt-6"
            value={PrimaryTabsKey.graphqlAPI}>
            <VeniceGraphQLExplorer />
          </TabsContent>
          <TabsContent value={PrimaryTabsKey.restAPI}>
            <VeniceDatabaseExplorer apiKey={apiKey} />
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
