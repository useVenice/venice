import {Tabs, TabsContent, TabsTriggers} from '@usevenice/ui'
import type {GetServerSideProps} from 'next'
import {VeniceGraphQLExplorer} from '../components/api-access'
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
  sqlApi = 'sqlApi',
}

export default function Page(props: ServerSideProps) {
  const {apiKey} = props
  return (
    <PageLayout title="API Access">
      <PageHeader title={['API Access', 'GraphQL']} />
      <div className="h-screen p-6">
        <Tabs
          // the id doesn't do anything, just for readability
          id="PrimaryTabs"
          className="flex h-full flex-col gap-6 pb-12"
          defaultValue={PrimaryTabsKey.graphqlAPI}>
          <TabsTriggers
            options={[
              {key: PrimaryTabsKey.graphqlAPI, label: 'GraphQL API'},
              {key: PrimaryTabsKey.sqlApi, label: 'SQL Access'},
            ]}
          />
          <TabsContent
            className="flex h-full flex-col"
            value={PrimaryTabsKey.graphqlAPI}>
            <VeniceGraphQLExplorer apiKey={apiKey} />
          </TabsContent>
          <TabsContent className="max-w-[50rem]" value={PrimaryTabsKey.sqlApi}>
            {/* <DatabaseAccessCard databaseUrl={databaseUrl} /> */}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
