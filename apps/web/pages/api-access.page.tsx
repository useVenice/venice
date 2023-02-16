import {TabsPrimitive as Tabs} from '@usevenice/ui'
import type {GetServerSideProps} from 'next'
import {
  DatabaseAccessCard,
  PrimaryTabs,
  VeniceDatabaseExplorer,
} from '../components/api-access'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'

// for server-side
import {z} from '@usevenice/util'
import {commonEnv} from '@usevenice/app-config/commonConfig'
import {getDatabaseInfo, serverGetUser} from '../server'

interface ServerSideProps {
  apiKey: string
  databaseUrl: string
  serverUrl: string
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
  const serverUrl = commonEnv.NEXT_PUBLIC_SERVER_URL

  return {
    props: {
      apiKey,
      databaseUrl,
      serverUrl,
    },
  }
}

enum PrimaryTabsKey {
  databaseUri = 'databaseUri',
  sqlApi = 'sqlApi',
}

export default function Page(props: ServerSideProps) {
  const {apiKey, databaseUrl, serverUrl} = props
  return (
    <PageLayout title="API Access">
      <PageHeader title={['API Access', 'SQL']} />
      <div className="p-6">
        <Tabs.Root
          // the id doesn't do anything, just for readability
          id="PrimaryTabs"
          className="grid gap-6"
          defaultValue={PrimaryTabsKey.sqlApi}>
          <PrimaryTabs
            options={[
              {key: PrimaryTabsKey.sqlApi, label: 'SQL API'},
              {key: PrimaryTabsKey.databaseUri, label: 'Database URI'},
            ]}
          />
          <Tabs.Content className="max-w-full" value={PrimaryTabsKey.sqlApi}>
            <VeniceDatabaseExplorer apiKey={apiKey} serverUrl={serverUrl} />
          </Tabs.Content>
          <Tabs.Content
            className="max-w-[38.5rem]"
            value={PrimaryTabsKey.databaseUri}>
            <DatabaseAccessCard databaseUrl={databaseUrl} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </PageLayout>
  )
}
