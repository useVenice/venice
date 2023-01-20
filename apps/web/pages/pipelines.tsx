import {useAtom, useAtomValue} from 'jotai'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type {Id} from '@usevenice/cdk-core'
import {useVenice} from '@usevenice/engine-frontend'

import {PageContainer} from '../components/common-components'
import {EnhancedActiveLink} from '../components/EnhancedActiveLink'
import {envAtom, ledgerIdAtom, modeAtom} from '../contexts/atoms'
import {ConnectionCard} from '../screens/components/ConnectionCard'
import {NewConnectionScreen} from '../screens/NewConnectionScreen'

export default function PipelinesScreen() {
  const mode = useAtomValue(modeAtom)
  const env = useAtomValue(envAtom)
  const {connectionsRes} = useVenice({envName: env})
  const connections = connectionsRes.data ?? []

  // List the pipelines in and out of Venice
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

  const pipelinesInAndOut = (
    <>
      <div className="mt-5 grid grid-cols-2 p-4">
        <div className="col-span-1">
          <div className="flex justify-start">
            <Image
              src="/pipeline-in.svg"
              alt="Pipeline in"
              width={32}
              height={32}
            />
            <h2 className="p-3 text-lg font-medium">Pipelines in</h2>
            <EnhancedActiveLink
              key="/pipelines?mode=connect"
              href="/pipelines?mode=connect"
              className="btn btn-primary btn-sm mt-2 ml-4 rounded-xl">
              Add
            </EnhancedActiveLink>
          </div>
          <div className="mt-4 flex flex-1 flex-col gap-4 pr-10">
            {sources.length == 0 ? (
              <EmptySourcesView />
            ) : (
              sources.map((conn) => (
                <ConnectionCard key={conn.id} connection={conn} />
              ))
            )}
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex justify-start">
            <Image
              src="/pipeline-out.svg"
              alt="Pipeline out"
              width={32}
              height={32}
            />
            <h2 className="p-3 text-lg font-medium">Pipelines out</h2>
          </div>
          <div className="mt-4 flex flex-1 flex-col gap-4 pr-10">
            {sources.length == 0 ? (
              <EmptyDestinationsView />
            ) : (
              destinations.map((conn) => (
                <ConnectionCard key={conn.id} connection={conn} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )

  return (
    // TODO: Figure out a better way when ledgerId is still being loaded
    <PageContainer title="Pipelines" flex>
      {/* We need this workaround so connect does not capture the wrong scope */}
      {mode === 'connect' && connectWith.destinationId ? (
        <NewConnectionScreen connectWith={connectWith} />
      ) : (
        pipelinesInAndOut
      )}
    </PageContainer>
  )
}

function EmptySourcesView() {
  return (
    <div className="bg-primaryUIControl card max-w-md border border-base-content/25 p-10">
      <p className="max-w-sm text-center text-sm">
        Venice has over 10,000 financial data sources to choose from (e.g. your
        bank)
        <br />
        <br />
        Don&apos;t see one you need?&nbsp;
        <Link
          className="text-green"
          href="mailto:hello@venice.is"
          target="_blank">
          Reach out!
        </Link>
      </p>
    </div>
  )
}

function EmptyDestinationsView() {
  return (
    <div className="bg-primaryUIControl card max-w-md border border-base-content/25 p-10">
      <p className="max-w-sm text-center text-sm">
        Your data is safe on Venice, but soon you&apos;ll be able to pipe it
        into other destinations like Coda or Excel.
        <br />
        <br />
        Have a destination in mind?&nbsp;
        <Link
          className="text-green"
          href="mailto:hello@venice.is"
          target="_blank">
          Reach out!
        </Link>
      </p>
    </div>
  )
}

// Ledgers UI code (not in MVP for now)
// TODO: Move this into settings screen (rarely used)

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@usevenice/ui'
// import {makeUlid} from '@usevenice/util'
// import {makeId} from '@usevenice/cdk-core'
// import {Database, PlusCircle} from 'phosphor-react'
// import {useDelete, useInsert} from 'react-supabase'

// const [_insertLedgerRes, insertLedger] = useInsert('connection')
// const [_deleteLedgerRes, deleteLedger] = useDelete('connection')

// <ul className="shrink self-center md:block">
//   {ledgers.map((conn) => (
//     <li key={conn.id}>
//       <DropdownMenu>
//         <DropdownMenuTrigger>
//           <Database className="inline cursor-pointer" alt={conn.id} />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuItem
//             className="cursor-pointer"
//             onClick={() => setLedgerId(conn.id)}>
//             Switch to
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             className="cursor-pointer"
//             onClick={async () => {
//               await deleteLedger((query) => query.eq('id', conn.id))
//               await connectionsRes.refetch()
//             }}>
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </li>
//   ))}
//   <li>
//     <PlusCircle
//       onClick={async () => {
//         const newId = makeId('conn', 'postgres', makeUlid())
//         await insertLedger({id: newId, creator_id: user?.id})
//         await connectionsRes.refetch()
//         setLedgerId(newId)
//       }}
//       className="inline cursor-pointer"
//       alt="Create ledger"
//     />
//   </li>
// </ul>
