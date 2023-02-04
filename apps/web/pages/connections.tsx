import {DialogPrimitive as Dialog} from '@usevenice/ui'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  AddSourceCard,
  ConnectionCard,
  ConnectionCardSkeleton,
  DestinationComingSoonCard,
} from '../components/connections'
import {AddSourceDialog} from '../components/connections/AddSourceDialog'
import {AddFilledIcon} from '../components/icons'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import type {Connection} from '../lib/supabase-queries'
import {getQueryKeys, queries} from '../lib/supabase-queries'
import {createSSRHelpers} from '../server'

// Should this be moved to _app getInitialProps?
export const getServerSideProps = (async (context) => {
  const {user, getPageProps, supabase, queryClient} = await createSSRHelpers(
    context,
  )
  if (!user?.id) {
    return {redirect: {destination: '/', permanent: false}}
  }
  await queryClient.prefetchQuery(getQueryKeys(supabase).connections.list)
  // console.log('prefetched pipelines', res, getPageProps())

  // const {ensureDefaultLedger} = await import('../server')
  // const ids = await ensureDefaultLedger(user.id)
  // const integrations = await ssg.listIntegrations.fetch({})

  // // TODO: Get the correct default env name...
  // await Promise.all(
  //   integrations.map((int) =>
  //     ssg.preConnect.prefetch([{id: int.id as never}, {envName: 'sandbox'}]),
  //   ),
  // )
  return {props: getPageProps()}
}) satisfies GetServerSideProps

export default function ConnectionsPage() {
  const res = queries.useConnectionsList()

  return (
    <PageLayout title="Connections">
      <div className="grid min-h-screen grid-rows-[auto_1fr]">
        <PageHeader title={['Connections']} />
        <div className="flex gap-24 overflow-y-auto p-16">
          {res.isLoading ? (
            <LoadingSourcesColumn />
          ) : (
            <ConnectionsColumn connections={res.data?.source ?? []} />
          )}

          <VeniceDatabaseSection />

          {/* destinations column */}
          <section className="flex w-[20rem] shrink-0 flex-col gap-4">
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
            {/* <AddDestinationCard /> */}
            <DestinationComingSoonCard />
          </section>
        </div>
      </div>
    </PageLayout>
  )
}

function LoadingSourcesColumn() {
  return (
    <section className="flex w-[20rem] shrink-0 flex-col gap-4">
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
  return (
    <section className="flex w-[20rem] shrink-0 flex-col gap-4">
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
            <AddSourceDialog />
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
    <section className="flex shrink-0 flex-col items-center pt-[2.625rem]">
      <Image
        width={86}
        height={112}
        src="/venice-database.png"
        alt="Venice Database"
      />
      <ul className="flex flex-col gap-2 pt-[3.25rem]">
        <li>
          <Link
            href="/data"
            className="text-sm text-green hover:text-opacity-70">
            Export data
          </Link>
        </li>
        <li>
          <Link
            href="/api-access"
            className="text-sm text-green hover:text-opacity-70">
            Explore APIs
          </Link>
        </li>
        <li>
          <Link
            href="/api-access"
            className="text-sm text-green hover:text-opacity-70">
            Access database
          </Link>
        </li>
      </ul>
    </section>
  )
}
