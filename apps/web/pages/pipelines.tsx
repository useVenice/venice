import {useAtom, useAtomValue} from 'jotai'
import {Database, PlusCircle} from 'phosphor-react'
import React from 'react'
import {useDelete, useInsert} from 'react-supabase'
import {twMerge} from 'tailwind-merge'

import type {Id} from '@usevenice/cdk-core'
import {makeId} from '@usevenice/cdk-core'
import {useVenice} from '@usevenice/engine-frontend'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@usevenice/ui'
import {makeUlid} from '@usevenice/util'

import {PageContainer} from '../components/common-components'
import {
  envAtom,
  ledgerIdAtom,
  modeAtom,
  pipelineTypeAtom,
} from '../contexts/atoms'
import {useUser} from '../contexts/session-context'
import {ConnectionCard} from '../screens/components/ConnectionCard'
import {NewConnectionScreen} from '../screens/NewConnectionScreen'

export default function ConnectionsScreen() {
  const [user] = useUser()
  const [pipelineType, setPipelineType] = useAtom(pipelineTypeAtom)
  const mode = useAtomValue(modeAtom)

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

  const connectWith = React.useMemo(
    () => ({destinationId: ledgerId as Id['conn']}),
    [ledgerId],
  )

  const [_insertLedgerRes, insertLedger] = useInsert('connection')
  const [_deleteLedgerRes, deleteLedger] = useDelete('connection')

  const myConnections = (
    <>
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
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Database className="inline cursor-pointer" alt={conn.id} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setLedgerId(conn.id)}>
                    Switch to
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={async () => {
                      await deleteLedger((query) => query.eq('id', conn.id))
                      await connectionsRes.refetch()
                    }}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
          <li>
            <PlusCircle
              onClick={async () => {
                const newId = makeId('conn', 'postgres', makeUlid())
                await insertLedger({id: newId, creator_id: user?.id})
                await connectionsRes.refetch()
                setLedgerId(newId)
              }}
              className="inline cursor-pointer"
              alt="Create ledger"
            />
          </li>
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
    </>
  )

  return (
    <PageContainer
      authenticated
      flex
      links={[
        {
          label: 'New connection',
          href: '/pipelines?mode=connect',
          primary: true,
          fixed: true,
        },
      ]}>
      {mode === 'connect' ? (
        <NewConnectionScreen connectWith={connectWith} />
      ) : (
        myConnections
      )}
    </PageContainer>
  )
}
