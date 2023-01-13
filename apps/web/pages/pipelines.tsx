import {useAtom, useAtomValue} from 'jotai'
import {Database} from 'phosphor-react'
import React from 'react'
import {twMerge} from 'tailwind-merge'

import {useVenice} from '@usevenice/engine-frontend'

import {PageContainer} from '../components/common-components'
import {envAtom, ledgerIdAtom, pipelineTypeAtom} from '../contexts/atoms'
import {ConnectionCard} from '../screens/components/ConnectionCard'

export default function ConnectionsScreen() {
  const [pipelineType, setPipelineType] = useAtom(pipelineTypeAtom)

  const env = useAtomValue(envAtom)
  const {connectionsRes} = useVenice({envName: env})
  const connections = connectionsRes.data ?? []

  // List the pipelines for sure...
  const sources = connections.filter(
    (conn) => !conn.id.startsWith('conn_postgres'),
  )
  const ledgers = connections.filter((conn) =>
    conn.id.startsWith('conn_postgres'),
  )
  const destinations: typeof sources = []

  const [ledgerId, setLedgerId] = useAtom(ledgerIdAtom)

  React.useEffect(() => {
    if (!connectionsRes.isLoading && !ledgers.some((l) => l.id === ledgerId)) {
      setLedgerId(ledgers[0]?.id ?? '')
    }
  }, [connectionsRes.isLoading, ledgerId, ledgers, setLedgerId])

  // const connectWith = React.useMemo(
  //   () => ({destinationId: ledgerId as Id['conn']}),
  //   [ledgerId],
  // )

  return (
    <PageContainer
      authenticated
      flex
      links={[
        {
          label: 'New connection',
          href: '/v2/connections?mode=connect',
          primary: true,
          fixed: true,
        },
      ]}>
      {/* TabList, visible on mobile only */}
      <div className="flex flex-row md:hidden">
        <h2
          className="flex-1 cursor-pointer p-3 text-lg font-bold"
          onClick={() => setPipelineType('sources')}>
          Pipelines in
        </h2>
        <h2
          className="flex-1 cursor-pointer p-3 text-lg font-bold"
          onClick={() => setPipelineType('destinations')}>
          Pipelines out
        </h2>
      </div>

      {/* Tab contents */}
      <div className="flex flex-1 flex-row items-stretch gap-4 p-4">
        <div
          className={twMerge(
            'flex flex-1 flex-col gap-4',
            pipelineType !== 'sources' && 'hidden md:block',
          )}>
          <h2 className="hidden p-3 text-lg font-bold md:block">
            Pipelines in
          </h2>
          {sources.map((conn) => (
            <ConnectionCard key={conn.id} connection={conn} />
          ))}
        </div>
        <ul className="hidden shrink self-center md:block">
          {ledgers.map((conn) => (
            <li key={conn.id}>
              <Database
                onClick={() => setLedgerId(conn.id)}
                className="inline cursor-pointer"
                alt={conn.id}
              />
            </li>
          ))}
        </ul>
        <div
          className={twMerge(
            'flex flex-1 flex-col gap-4',
            pipelineType !== 'destinations' && 'hidden md:block',
          )}>
          <h2 className="hidden p-3 text-lg font-bold md:block">
            Pipelines out
          </h2>
          {destinations.map((conn) => (
            <ConnectionCard key={conn.id} connection={conn} />
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
