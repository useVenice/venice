import {Tabs, TabsContent, TabsTriggers} from '@usevenice/ui'
import type {GetServerSideProps} from 'next'
import {
  DatabaseAccessCard,
  VeniceDatabaseExplorer,
} from '../components/api-access'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'

// for server-side
import {z} from '@usevenice/util'
import {getDatabaseInfo, serverGetUser} from '../server'

interface ServerSideProps {
  apiKey: string
  databaseUrl: string
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
  const {databaseUrl} = await getDatabaseInfo(user.id)

  return {
    props: {
      apiKey,
      databaseUrl,
    },
  }
}

enum PrimaryTabsKey {
  databaseUri = 'databaseUri',
  sqlApi = 'sqlApi',
}

export default function Page(props: ServerSideProps) {
  const {apiKey, databaseUrl} = props
  return (
    <PageLayout title="API Access">
      <PageHeader title={['API Access', 'SQL']} />
      <div className="p-6">
        <Tabs
          // the id doesn't do anything, just for readability
          id="PrimaryTabs"
          className="grid gap-6"
          defaultValue={PrimaryTabsKey.sqlApi}>
          <TabsTriggers
            options={[
              {key: PrimaryTabsKey.sqlApi, label: 'SQL API'},
              {key: PrimaryTabsKey.databaseUri, label: 'Database URI'},
            ]}
          />
          <TabsContent value={PrimaryTabsKey.sqlApi}>
            <VeniceDatabaseExplorer apiKey={apiKey} />
          </TabsContent>
          <TabsContent
            className="max-w-[50rem]"
            value={PrimaryTabsKey.databaseUri}>
            <DatabaseAccessCard databaseUrl={databaseUrl} />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
