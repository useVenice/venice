import {
  Button,
  DatabaseIcon,
  EmailIcon,
  InstructionCard,
  Tabs,
  TabsContent,
  TabsTriggers,
} from '@usevenice/ui'
import {useAtom} from 'jotai'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import {createEnumParam} from 'use-query-params'
import {GraphQLExplorer} from '../components/api-access'
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
  realtime: 'Real time API',
  sql: 'Raw SQL API',
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
            <GraphQLExplorer />
          </TabsContent>
          <TabsContent value={tabKey('rest')}></TabsContent>
          <TabsContent className="max-w-[30rem]" value={tabKey('realtime')}>
            <InstructionCard icon={DatabaseIcon} title="Real time API">
              <p className="text-venice-green">
                Please reach out if you&apos;re interested in:
              </p>
              <ul className="list-disc pl-4">
                <li>
                  Real-time notifications on row insert / update / deletions
                </li>
                <li>Web Socket API for client side use</li>
                <li>
                  Webhook callback for server side use (e.g. serverless
                  functions)
                </li>
              </ul>
              <div className="flex gap-2 py-2 pr-7">
                <Button variant="primary" asChild className="gap-2">
                  <Link href="mailto:hi@venice.is">
                    <EmailIcon className="h-4 w-4 fill-current text-offwhite" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </InstructionCard>
          </TabsContent>
          <TabsContent className="max-w-[30rem]" value={tabKey('sql')}>
            <InstructionCard
              icon={DatabaseIcon}
              title="Dedicated database package">
              <p className="text-venice-green">
                Please reach out if you&apos;re interested in:
              </p>
              <ul className="list-disc pl-4">
                <li>Dedicated Postgres database (or bring your own)</li>
                <li>Control scaleability, backups, compute, and more</li>
                <li>Raw SQL access (for backends, data analysis, etc.)</li>
              </ul>
              <div className="flex gap-2 py-2 pr-7">
                <Button variant="primary" asChild className="gap-2">
                  <Link href="mailto:hi@venice.is">
                    <EmailIcon className="h-4 w-4 fill-current text-offwhite" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </InstructionCard>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}
