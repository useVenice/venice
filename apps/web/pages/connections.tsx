import type {ConnectWith, Id, UserId} from '@usevenice/cdk-core'
import {DialogPrimitive as Dialog} from '@usevenice/ui'
import {AddFilledIcon} from '@usevenice/ui/icons'
import type {NonEmptyArray} from '@usevenice/util'
import type {GetServerSideProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  AddSourceCard,
  ConnectionCard,
  ConnectionCardSkeleton,
  DestinationComingSoonCard,
} from '../components/connections'
import {AddSourceDialog} from '../components/connections/AddSourceDialog'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import type {Connection} from '../lib/supabase-queries'
import {getQueryKeys, queries} from '../lib/supabase-queries'
import type {PageProps} from '../server'
import {createSSRHelpers} from '../server'

type ServerSideProps = PageProps & {
  ledgerIds: NonEmptyArray<Id['reso']>
  userId: UserId
}

// Should this be moved to _app getInitialProps?
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context,
) => {
  const {user, getPageProps, supabase, queryClient} = await createSSRHelpers(
    context,
  )
  if (!user?.id) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }

  await queryClient.prefetchQuery(getQueryKeys(supabase).connections.list)

  const {ensureDefaultLedger} = await import('../server')
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
  const res = queries.useConnectionsList()
  return (
    <PageLayout title="Connections">
      <div className="grid min-h-screen grid-rows-[auto_1fr]">
        <PageHeader title={['Connections']} />
        <div className="flex gap-24 overflow-y-auto p-16">
          {res.isLoading ? (
            <LoadingConnectionsColumn />
          ) : (
            <ConnectionsColumn
              connections={res.data?.source ?? []}
              connectWith={{destinationId: props.ledgerIds[0]}}
            />
          )}

          <VeniceDatabaseSection />

          {/* destinations column */}
          {/* <section className="flex w-[24rem] shrink-0 flex-col gap-4">
            <header>
              <h2 className="flex grow items-center gap-2">
                <Image
                  width={30}
                  height={30}
                  src="/pipeline-out.svg"
                  alt="" // decorative image
                  aria-hidden="true"
                />
                <span className="text-sm uppercase">Destinations</span>
              </h2>
            </header>
            <DestinationComingSoonCard />
          </section> */}
        </div>
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
  const {connections} = props
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
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="h-5 w-5 fill-current text-green hover:text-opacity-70 focus:outline-none focus-visible:text-opacity-70">
                <AddFilledIcon />
              </button>
            </Dialog.Trigger>
            <AddSourceDialog connectWith={props.connectWith} />
          </Dialog.Root>
        )}
      </header>
      {connections.length > 0 ? (
        connections.map((source) => (
          <ConnectionCard key={source.id} connection={source} />
        ))
      ) : (
        <EmptySources />
      )}
    </section>
  )
}

function EmptySources() {
  return (
    <>
      <AddSourceCard />
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
  )
}

function VeniceDatabaseSection() {
  return (
    // padding top is used to align againsts the two sides
    <section className="relative flex shrink-0 flex-col items-center pt-[2.625rem]">
      <Image
        width={86}
        height={112}
        src="/venice-database.png"
        alt="Venice Database"
      />
      <Image
        className="mr-12 mt-1"
        width={51}
        height={103}
        src="/db-links-line.svg"
        alt="Line for links"
      />
      <ul className="absolute top-[12.3rem] left-[1.2rem] flex min-w-[9rem] flex-col">
        <li>
          <Link
            href="/data"
            className="text-sm leading-4 text-green hover:text-opacity-70">
            Export data
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
            href="/api-access"
            className="text-sm leading-4 text-green hover:text-opacity-70">
            Access database
          </Link>
        </li>
      </ul>
    </section>
  )
}
