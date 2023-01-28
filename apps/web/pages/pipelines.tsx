import {useAtom, useAtomValue} from 'jotai'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type {Id} from '@usevenice/cdk-core'
import {useVenice} from '@usevenice/engine-frontend'

import {EnhancedActiveLink} from '../components/EnhancedActiveLink'
import {envAtom, ledgerIdAtom, modeAtom} from '../contexts/atoms'
import {ResourceCard} from '../components/ResourceCard'
import {PageLayout} from '../layouts/PageLayout'
import {NewPipelineInScreen} from '../screens/NewPipelineInScreen'

export default function PipelinesScreen() {
  const mode = useAtomValue(modeAtom)
  const env = useAtomValue(envAtom)
  const {resourcesRes} = useVenice({envName: env})
  const resources = resourcesRes.data ?? []

  // List the pipelines in and out of Venice
  const sources = resources.filter(
    (reso) => !reso.id.startsWith('reso_postgres'),
  )
  const ledgers = resources.filter((reso) =>
    reso.id.startsWith('reso_postgres'),
  )
  const destinations: typeof sources = []
  const [ledgerId, setLedgerId] = useAtom(ledgerIdAtom)

  React.useEffect(() => {
    if (!resourcesRes.isLoading && !ledgers.some((l) => l.id === ledgerId)) {
      setLedgerId(ledgers[0]?.id ?? '')
    }
  }, [resourcesRes.isLoading, ledgerId, ledgers, setLedgerId])

  const connectWith = React.useMemo(
    () => ({destinationId: ledgerId as Id['reso']}),
    [ledgerId],
  )

  const pipelinesInAndOut = (
    <>
      <div className="mt-5 grid grid-cols-2 gap-10 p-4">
        <div className="col-span-1 border-r border-base-content/25">
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
              className="btn btn-sm mt-3 ml-4 rounded-lg border border-[#000]/50 bg-green px-4 py-2 text-xs font-normal hover:bg-green/90 active:bg-green/75">
              Add
            </EnhancedActiveLink>
          </div>
          <div className="mt-4 ml-11 flex flex-1 flex-col gap-4 pr-10">
            {sources.length == 0 ? (
              <EmptySourcesView />
            ) : (
              sources.map((reso) => (
                <ResourceCard key={reso.id} resource={reso} />
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
          <div className="mt-4 ml-11 flex flex-1 flex-col gap-4 pr-10">
            {destinations.length == 0 ? (
              <EmptyDestinationsView />
            ) : (
              destinations.map((reso) => (
                <ResourceCard key={reso.id} resource={reso} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )

  return (
    <PageLayout title="Pipelines">
      {/* We need this workaround so connect does not capture the wrong scope */}
      {mode === 'connect' && connectWith.destinationId ? (
        <NewPipelineInScreen connectWith={connectWith} />
      ) : (
        pipelinesInAndOut
      )}
    </PageLayout>
  )
}

function EmptySourcesView() {
  return (
    <div className="card max-w-md border border-base-content/25 bg-primaryUIControl p-6">
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
    <div className="card max-w-md border border-base-content/25 bg-primaryUIControl p-6">
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

// const [_insertLedgerRes, insertLedger] = useInsert('resource')
// const [_deleteLedgerRes, deleteLedger] = useDelete('resource')

// <ul className="shrink self-center md:block">
//   {ledgers.map((reso) => (
//     <li key={reso.id}>
//       <DropdownMenu>
//         <DropdownMenuTrigger>
//           <Database className="inline cursor-pointer" alt={reso.id} />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuItem
//             className="cursor-pointer"
//             onClick={() => setLedgerId(reso.id)}>
//             Switch to
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             className="cursor-pointer"
//             onClick={async () => {
//               await deleteLedger((query) => query.eq('id', reso.id))
//               await resourcesRes.refetch()
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
//         const newId = makeId('reso', 'postgres', makeUlid())
//         await insertLedger({id: newId, creator_id: user?.id})
//         await resourcesRes.refetch()
//         setLedgerId(newId)
//       }}
//       className="inline cursor-pointer"
//       alt="Create ledger"
//     />
//   </li>
// </ul>
