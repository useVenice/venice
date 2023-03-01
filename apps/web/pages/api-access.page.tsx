import {
  BroadcastIcon,
  Button,
  CodeIcon,
  DatabaseIcon,
  DocsIcon,
  EmailIcon,
  InstructionCard,
  Tabs,
  TabsContent,
  TabsTriggers,
} from '@usevenice/ui'
import {useAtom} from 'jotai'
import type {InferGetServerSidePropsType} from 'next'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import {createEnumParam} from 'use-query-params'
import {GraphQLExplorer} from '../components/api-access'
import {CopyTextButton} from '../components/CopyTextButton'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import {atomWithQueryParam} from '../contexts/utils/atomWithQueryParam'

// for server-side
import {
  getGraphqlEndpoint,
  getRestEndpoint,
  xPatHeaderKey,
  xPatUrlParamKey,
} from '@usevenice/app-config/constants'
import {browserAnalytics} from '../lib/browser-analytics'
import {ensurePersonalAccessToken, serverGetUser} from '../server'

const tabLabelByKey = {
  apiKeys: 'API Keys',
  graphql: 'GraphQL Explorer',
  realtime: 'Real time API',
  sql: 'Raw SQL API',
} as const

const tabKey = (k: keyof typeof tabLabelByKey) => k

export const tabAtom = atomWithQueryParam(
  'tab',
  'apiKeys',
  createEnumParam(Object.keys(tabLabelByKey)),
)

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
  const pat = await ensurePersonalAccessToken(user.id)
  return {props: {pat}}
}) satisfies GetServerSideProps

export default function ApiAccessNewPage({
  pat,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
          <TabsContent className="flex flex-col pt-6" value={tabKey('apiKeys')}>
            <APIKeysCard pat={pat} />
          </TabsContent>
          <TabsContent className="flex flex-col" value={tabKey('graphql')}>
            <GraphQLExplorer pat={pat} />
          </TabsContent>
          <TabsContent className="max-w-[30rem]" value={tabKey('realtime')}>
            <InstructionCard icon={BroadcastIcon} title="Realtime API">
              <p className="text-venice-green">
                Please reach out if you&apos;re interested in:
              </p>
              <ul className="list-disc pl-4">
                <li>
                  Real-time notifications on database row insert / update /
                  deletions
                </li>
                <li>Web Socket API for client side use</li>
                <li>
                  Webhook callback for server-side use (e.g. serverless
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

/* API Keys Card */

interface APIKeysCardProps {
  pat: string
}

function APIKeysCard({pat}: APIKeysCardProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* GraphQL */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-base text-offwhite">
          GraphQL API Endpoint
        </span>
        <div className="flex gap-4">
          <input
            className="w-1/3 resize-none rounded-lg bg-venice-black-400 p-2 font-mono text-xs text-venice-gray/75 ring-1 ring-inset ring-venice-black-300 focus:outline-none"
            value={getGraphqlEndpoint(null).href}
            readOnly
          />
          <CopyTextButton content={getGraphqlEndpoint(null).href} />
        </div>
      </div>

      {/* REST API */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-base text-offwhite">
          REST API Endpoint
        </span>
        <div className="flex gap-4">
          <input
            className="w-1/3 resize-none rounded-lg bg-venice-black-400 p-2 font-mono text-xs text-venice-gray/75 ring-1 ring-inset ring-venice-black-300 focus:outline-none"
            value={getRestEndpoint(null).href}
            readOnly
          />
          <CopyTextButton content={getRestEndpoint(null).href} />
        </div>
        <Button variant="primary" asChild className="w-[14rem] gap-2">
          <Link href="/api-access/rest" target="_blank">
            <DocsIcon className="h-4 w-4 fill-current text-offwhite" />
            Explore the REST APIs
          </Link>
        </Button>
      </div>

      <span className="max-w-[50%] border-b border-venice-black-500" />

      {/* Personal Access Token */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-base text-offwhite">
          Personal Access Token
        </span>
        <div className="flex gap-4">
          <input
            type="password"
            className="w-1/3 resize-none rounded-lg bg-venice-black-400 p-2 font-mono text-xs text-venice-gray/75 ring-1 ring-inset ring-venice-black-300 focus:outline-none"
            value={pat}
            readOnly
          />
          <CopyTextButton
            content={pat}
            onCopied={() =>
              browserAnalytics.track({
                name: 'api/token-copied',
                data: {},
              })
            }
          />
        </div>
        <div className="flex gap-4">
          <CodeIcon className="h-5 w-5 place-self-center fill-venice-gray-muted" />
          <div>
            <span className="font-mono text-xs text-venice-gray">
              Header example:
            </span>
            <pre className="mt-2 max-w-lg truncate rounded-md bg-black-500 py-1 px-2 font-mono text-xs text-venice-gray">
              <code>{xPatHeaderKey}: myPersonalAccessTokenHere</code>
            </pre>
          </div>
        </div>
        <div className="flex gap-4">
          <CodeIcon className="h-5 w-5 place-self-center fill-venice-gray-muted" />
          <div>
            <span className="font-mono text-xs text-venice-gray">
              Query param example:
            </span>
            <pre className="mt-2 max-w-lg truncate rounded-md bg-black-500 py-1 px-2 font-mono text-xs text-venice-gray">
              <code>?{xPatUrlParamKey}=myPersonalAccessTokenHere</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
