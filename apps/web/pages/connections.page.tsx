import type {ConnectWith, Id, UserId} from '@usevenice/cdk-core'
import type {UseVenice} from '@usevenice/engine-frontend'
import {useVenice} from '@usevenice/engine-frontend'
import {AddFilledIcon} from '@usevenice/ui/icons'
import type {NonEmptyArray} from '@usevenice/util'
import type {GetServerSideProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {ArcherContainer, ArcherElement} from 'react-archer'
import {ConnectionCard, ConnectionCardSkeleton} from '../components/connections'
import {LoadingIndicatorOverlayV2} from '../components/loading-indicators'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import {ResourceCard} from '../components/ResourceCard'
import type {Connection} from '../lib/supabase-queries'
import {getQueryKeys, queries} from '../lib/supabase-queries'
import type {PageProps} from '../server'
import {createSSRHelpers, ensureDefaultLedger} from '../server'

const VENICE_DATABASE_IMAGE_ID = 'venice-database-image'

type ServerSideProps = PageProps & {
  ledgerIds: NonEmptyArray<Id['reso']>
  userId: UserId
}

// Should this be moved to _app getInitialProps?
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context,
) => {
  const {user, getPageProps, supabase, queryClient, ssg} =
    await createSSRHelpers(context)
  if (!user?.id) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }

  const [integrations] = await Promise.all([
    ssg.listIntegrations.fetch({}),
    ssg.searchInstitutions.prefetch({keywords: undefined}),
    queryClient.prefetchQuery(getQueryKeys(supabase).connections.list),
  ])
  // console.log('integrations', integrations, getPageProps())

  // TODO: Need to have default preConnectInput values for prefetch to work properly
  // Get on this performance improvement when we can address it later...
  await Promise.all(
    integrations.map((int) =>
      ssg.preConnect.prefetch([
        {id: int.id as never},
        {envName: 'sandbox'},
        {},
      ]),
    ),
  )

  const ledgerIds = await ensureDefaultLedger(user.id)
  return {
    props: {
      ...getPageProps(),
      ledgerIds,
      userId: user.id as UserId,
    },
  }
}

export default function ConnectionsPage(props: ServerSideProps) {
  const connections = queries.useConnectionsList()

  return (
    <PageLayout title="Connections">
      <div className="grid min-h-screen grid-rows-[auto_1fr]">
        <PageHeader title={['Connections']} />
        <ArcherContainer
          className="overflow-y-auto"
          strokeColor="#3e3e3e"
          strokeWidth={2}
          endMarker={false}>
          <div className="flex gap-36 px-16 pt-8">
            {connections.isLoading ? (
              <LoadingConnectionsColumn />
            ) : (
              <ConnectionsColumn
                connections={connections.data?.source ?? []}
                connectWith={{destinationId: props.ledgerIds[0]}}
              />
            )}

            <VeniceDatabaseSection />
          </div>
        </ArcherContainer>
      </div>
    </PageLayout>
  )
}

function LoadingConnectionsColumn() {
  return (
    <section className="flex w-[24rem] shrink-0 flex-col gap-4">
      <header className="flex items-center">
        <h2 className="flex grow items-center gap-2">
          <Image
            width={30}
            height={30}
            src="/pipeline-in.svg"
            alt="" // decorative image
            aria-hidden="true"
          />
          <span className="text-sm uppercase">Sources</span>
        </h2>
      </header>
      <ConnectionCardSkeleton />
      <ConnectionCardSkeleton />
    </section>
  )
}

interface ConnectionsColumnProps {
  connections: Connection[]
  connectWith: ConnectWith
}

function ConnectionsColumn(props: ConnectionsColumnProps) {
  const {connections, connectWith} = props
  const archerElementRelations = [
    {
      targetId: VENICE_DATABASE_IMAGE_ID,
      targetAnchor: 'left',
      sourceAnchor: 'right',
    } as const,
  ]

  const {integrationsRes, veniceConnect, checkResource}: UseVenice = useVenice({
    envName: 'sandbox',
    keywords: undefined,
  })

  const onlyIntegrationId =
    integrationsRes.data?.length === 1 ? integrationsRes.data[0]?.id : undefined

  function addNewConnection() {
    if (onlyIntegrationId) {
      void veniceConnect.connect({id: onlyIntegrationId}, {connectWith})
    }
  }

  return (
    <section className="flex w-[24rem] shrink-0 flex-col gap-4">
      <header className="flex items-center">
        <h2 className="flex grow items-center gap-2">
          <Image
            width={30}
            height={30}
            src="/pipeline-in.svg"
            alt="" // decorative image
            aria-hidden="true"
          />
          <span className="text-sm uppercase">Sources</span>
        </h2>
        {connections.length > 0 && (
          <button
            onClick={addNewConnection}
            className="h-5 w-5 fill-current text-green hover:text-opacity-70 focus:outline-none focus-visible:text-opacity-70">
            <AddFilledIcon />
          </button>
        )}
      </header>
      {connections.length > 0 ? (
        connections.map((source) => (
          <ArcherElement
            key={source.id}
            id={`source-${source.id}`}
            relations={archerElementRelations}>
            <ConnectionCard
              connection={source}
              onReconnect={() => {
                if (onlyIntegrationId) {
                  void veniceConnect.connect(
                    {id: onlyIntegrationId},
                    {connectWith, resourceId: source.resource.id},
                  )
                } else {
                  console.error('Missing onlyIntegrationId')
                }
              }}
              onSandboxSimulateDisconnect={() =>
                checkResource.mutate([
                  {id: source.resource.id},
                  {sandboxSimulateDisconnect: true},
                ])
              }
            />
          </ArcherElement>
        ))
      ) : (
        <>
          <ResourceCard
            tagColor="offwhite"
            bgColor="bg-gradient-to-r from-[#ECAA47] to-[#722273]">
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 text-offwhite hover:bg-venice-black/10 focus:outline-none focus-visible:bg-venice-black/10"
              onClick={addNewConnection}>
              <AddFilledIcon className="inline-flex h-5 w-5 fill-current" />
              <span className="text-sm uppercase">Add new source</span>
            </button>
          </ResourceCard>
          <div className="grid gap-4 px-2 text-center text-sm text-venice-gray">
            <p>
              Venice has over 12,000 financial data sources to choose from (e.g.
              banks & investments)
            </p>
            <p>
              Don&apos;t see one you need?{' '}
              <a
                className="text-green hover:text-opacity-70"
                href="mailto:hi@venice.is">
                Reach&nbsp;out!
              </a>
            </p>
          </div>
        </>
      )}

      {veniceConnect.isConnecting && <LoadingIndicatorOverlayV2 />}
    </section>
  )
}

function VeniceDatabaseSection() {
  return (
    // padding top is used to align againsts the two sides
    <section className="relative flex shrink-0 flex-col items-center pt-[3.155rem]">
      <ArcherElement id={VENICE_DATABASE_IMAGE_ID}>
        <Image
          priority
          width={86}
          height={112}
          src="/venice-database.png"
          alt="Venice Database"
        />
      </ArcherElement>
      <Image
        priority
        className="mr-12 mt-1"
        width={51}
        height={103}
        src="/db-links-line.svg"
        alt="Line for links"
      />
      <ul className="absolute top-[12.8rem] left-[1.2rem] flex min-w-[9rem] flex-col">
        <li>
          <Link
            href="/explore-data"
            className="text-sm leading-4 text-green hover:text-opacity-70">
            Explore data
          </Link>
        </li>
        <li>
          <Link
            href="/api-access"
            className="text-sm leading-4 text-green hover:text-opacity-70">
            Explore APIs
          </Link>
        </li>
        <li>
          <Link
            href="/integrations"
            className="text-sm leading-4 text-green hover:text-opacity-70">
            View integrations
          </Link>
        </li>
      </ul>
    </section>
  )
}
