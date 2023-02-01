import {VeniceProvider} from '@usevenice/engine-frontend'
import Image from 'next/image'
import Link from 'next/link'
import {AddFilledIcon} from '../components/icons'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import {
  AddSourceCard,
  DestinationComingSoonCard,
  SourceCard,
  SourceCardSkeleton,
} from '../components/ResourceCard'

interface Source {
  id: string
  displayName: string
  institution?: {
    name: string
    logoUrl?: string
  }
  lastSyncCompletedAt?: string | null
  status?: 'error' | 'healthy' | 'disconnected' | 'manual' | null
}

export default function Page() {
  const {trpc, userId} = VeniceProvider.useContext()
  const {
    isLoading,
    // error,
    data: sources,
  } = trpc.listResources.useQuery({}, {enabled: !!userId})

  return (
    <PageLayout title="Connections">
      <div className="grid min-h-screen grid-rows-[auto_1fr]">
        <PageHeader title={['Connections']} />
        <div className="flex gap-24 overflow-y-auto p-16">
          {isLoading ? (
            <LoadingSourcesColumn />
          ) : (
            <SourcesColumn sources={sources ?? []} />
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
      <SourceCardSkeleton />
      <SourceCardSkeleton />
    </section>
  )
}

interface SourcesColumnProps {
  sources: Source[]
}

function SourcesColumn(props: SourcesColumnProps) {
  const {sources} = props
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
        {sources.length > 0 && (
          <button className="h-5 w-5 fill-current text-green hover:text-opacity-70">
            <AddFilledIcon />
          </button>
        )}
      </header>
      {sources.length > 0 ? (
        sources.map((source) => <SourceCard key={source.id} {...source} />)
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
