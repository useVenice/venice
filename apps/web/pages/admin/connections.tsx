import type {RouterOutput} from '@usevenice/engine-backend'
import type {UseVenice} from '@usevenice/engine-frontend'
import {useVenice, VeniceProvider} from '@usevenice/engine-frontend'
import {AddFilledIcon} from '@usevenice/ui/icons'
import type {GetServerSideProps, InferGetServerSidePropsType} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {ArcherContainer, ArcherElement} from 'react-archer'
import {
  ConnectionCard,
  ConnectionCardSkeleton,
} from '../../components/connections'
import {LoadingIndicatorOverlayV2} from '../../components/loading-indicators'
import {PageHeader} from '../../components/PageHeader'
import {PageLayout} from '../../components/PageLayout'
import {TaggedCard} from '../../components/TaggedCard'
import {createSSRHelpers, ensureDefaultResourceAndPipelines} from '../../server'

type Connection = RouterOutput['listConnections'][number]

const VENICE_DATABASE_IMAGE_ID = 'venice-database-image'

// Should this be moved to _app getInitialProps?
export const getServerSideProps = (async (context) => {
  const {viewer, getPageProps, ssg} = await createSSRHelpers(context)
  if (viewer.role !== 'user') {
    return {
      redirect: {
        destination: '/admin/auth',
        permanent: false,
      },
    }
  }

  const [integrations] = await Promise.all([
    ssg.listIntegrations.fetch({}),
    ssg.listConnections.fetch({}),
    ssg.searchInstitutions.prefetch({keywords: undefined}),
  ])

  await ensureDefaultResourceAndPipelines(viewer.userId, {
    heronIntegrationId: integrations.find((i) => i.providerName === 'heron')
      ?.id,
  })
  return {
    props: {
      ...getPageProps(),
      userId: viewer.userId,
      integrations,
    },
  }
}) satisfies GetServerSideProps

export default function ConnectionsPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const {trpc} = VeniceProvider.useContext()
  const trpcCtx = trpc.useContext()
  const connections = trpc.listConnections.useQuery({})

  // TODO: Need to have default preConnectInput values for prefetch to work properly
  // Ideally this can work like a streaming react server component where we start
  // prefetching server side and then send down to the client when data is ready async
  // but not block the initial page load. Currently we have to wait for the client to
  // load the page and then issue the prefetch request, wasting a roundtrip time
  // but still better than blocking page load as users are probably not going to
  // connect immediately, until we have a dedicated screen for immediate connect anyways.
  React.useEffect(() => {
    props.integrations.forEach((int) =>
      trpcCtx.preConnect.prefetch([int.id, {envName: 'sandbox'}, {}]),
    )
  }, [props.integrations, trpcCtx])

  return (
    <PageLayout title="Connections" auth="user">
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
                connections={
                  connections.data?.filter((c) => c.type === 'source') ?? []
                }
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
}

function ConnectionsColumn(props: ConnectionsColumnProps) {
  const {connections} = props
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
      void veniceConnect.connect({id: onlyIntegrationId}, {})
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
                    {resourceId: source.id},
                  )
                } else {
                  console.error('Missing onlyIntegrationId')
                }
              }}
              onSandboxSimulateDisconnect={() =>
                checkResource.mutate([
                  source.id,
                  {sandboxSimulateDisconnect: true},
                ])
              }
            />
          </ArcherElement>
        ))
      ) : (
        <>
          <TaggedCard
            tagColor="offwhite"
            bgColor="bg-gradient-to-r from-[#ECAA47] to-[#722273]">
            <button
              className="flex items-center justify-center gap-2 px-3 py-2 text-offwhite hover:bg-venice-black/10 focus:outline-none focus-visible:bg-venice-black/10"
              onClick={addNewConnection}>
              <AddFilledIcon className="inline-flex h-5 w-5 fill-current" />
              <span className="text-sm uppercase">Add new source</span>
            </button>
          </TaggedCard>
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
      <ul className="absolute left-[1.2rem] top-[12.8rem] flex min-w-[9rem] flex-col">
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
