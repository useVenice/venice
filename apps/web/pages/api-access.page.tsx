import {Tabs, TabsContent, TabsTriggers} from '@usevenice/ui'
import {useAtom} from 'jotai'
import {GetServerSideProps} from 'next'
import {createEnumParam} from 'use-query-params'
import {
  SQLAccessCard,
  VeniceGraphQLExplorer,
  VeniceRestExplorer,
} from '../components/api-access'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import {atomWithQueryParam} from '../contexts/utils/atomWithQueryParam'

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

const tabLabelByKey = {
  graphql: 'GraphQL API',
  rest: 'Rest API',
  sql: 'SQL API',
} as const

const tabKey = (k: keyof typeof tabLabelByKey) => k

export const tabAtom = atomWithQueryParam(
  'tab',
  'graphql',
  createEnumParam(Object.keys(tabLabelByKey)),
)

export default function ApiAccessNewPage() {
  const [tab, setTab] = useAtom(tabAtom)
  return (
    <PageLayout title="API Access">
      <PageHeader title={['API Access']} />
      <div className="p-6">
        <Tabs
          // the id doesn't do anything, just for readability
          id="PrimaryTabs"
          className="flex flex-col"
          value={tab}
          onValueChange={setTab}>
          <TabsTriggers
            options={Object.entries(tabLabelByKey).map(([key, label]) => ({
              key,
              label,
            }))}
          />
          <TabsContent className="flex flex-col pt-6" value={tabKey('graphql')}>
            <VeniceGraphQLExplorer />
          </TabsContent>
          <TabsContent value={tabKey('rest')}>
            <VeniceRestExplorer />
          </TabsContent>
          <TabsContent className="max-w-[30rem]" value={tabKey('sql')}>
            <SQLAccessCard />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
