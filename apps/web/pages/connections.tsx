import Image from 'next/image'
import Link from 'next/link'
import {AddFilledIcon} from '../components/icons'
import {PageHeader} from '../components/PageHeader'
import {PageLayout} from '../components/PageLayout'
import {
  AddSourceCard,
  DestinationComingSoonCard,
  SourceCard,
} from '../components/ResourceCard'

interface Source {
  id: number
  customization: {name?: string}
  institution: {
    name: string
    logoUrl: string
  }
  connectionStatus: 'connected' | 'disconnected'
  lastSynced: number
}

const FAKE_DATA: {
  isLoading: boolean
  sources: Source[]
} = {
  isLoading: false,
  sources: [
    {
      id: 1,
      customization: {},
      institution: {
        name: 'Wells Fargo',
        logoUrl: '/wells-fargo-logo.svg',
      },
      connectionStatus: 'connected',
      lastSynced: 1675011600000,
    },
    {
      id: 2,
      customization: {},
      institution: {
        name: 'Fidelity',
        logoUrl: '/fidelity-logo.svg',
      },
      connectionStatus: 'disconnected',
      lastSynced: 1674493200000,
    },
    {
      id: 3,
      customization: {name: 'My custom named source'},
      institution: {
        name: 'Chase',
        logoUrl: '/chase-logo.svg',
      },
      connectionStatus: 'connected',
      lastSynced: 1675171121059,
    },
  ],
}

export default function Page() {
  const {sources} = FAKE_DATA
  return (
    <PageLayout title="Connections">
      <div className="grid min-h-screen grid-rows-[auto_1fr]">
        <PageHeader title={['Connections']} />
        <div className="flex gap-24 overflow-y-auto p-16">
          {/* sources column */}
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
              sources.map((source) => (
                <SourceCard key={source.id} {...source} />
              ))
            ) : (
              <EmptySources />
            )}
          </section>

          {/* venice database */}
          {/* padding top is used to align againsts the two sides */}
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
            Reach out!
          </a>
        </p>
      </div>
    </>
  )
}
