import {useAtom} from 'jotai'
import React from 'react'
import {useDelete, useFilter, useInsert, useSelect} from 'react-supabase'

import {makeId} from '@usevenice/cdk-core'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {makeUlid} from '@usevenice/util'

import {Layout} from '../../components/Layout'
import {ledgerIdAtom} from '../../contexts/atoms'

export default function HomePage() {
  const {userId} = VeniceProvider.useContext()
  const [ledgerId, setLedgerId] = useAtom(ledgerIdAtom)

  const [insertLedgerRes, insertLedger] = useInsert('connection')
  const [deleteLedgerRes, deleteLedger] = useDelete('connection')

  // Unfortunately useRealtime does not work at the moment
  // @see https://github.com/tmm/react-supabase/issues/67
  const [ledgersRes, refetchLedgers] = useSelect('connection', {
    filter: useFilter((query) => query.eq('provider_name', 'postgres'), []),
  })

  React.useEffect(() => {
    if (
      !ledgersRes.fetching &&
      !ledgersRes.data?.find((l) => l.id === ledgerId)
    ) {
      setLedgerId(ledgersRes.data?.[0].id)
    }
  }, [ledgerId, ledgersRes.data, ledgersRes.fetching, setLedgerId])

  console.log('ledgers', ledgersRes.data)
  return (
    <>
      <title>Venice | {userId}</title>
      <Layout
        title={userId}
        links={[
          {label: 'Connections', href: '/v2/connections'},
          {label: 'Data explorer', href: '/v2/data-explorer'},
          {label: 'Auth', href: '/v2/auth'},
        ]}>
        <h1>Welcome to Venice</h1>
        <h2>Ledgers (current: {ledgerId})</h2>

        <ul>
          {ledgersRes.data?.map((ledger) => (
            <li key={ledger.id} onClick={() => setLedgerId(ledger.id)}>
              {ledger.id}
              <button
                onClick={async () => {
                  await deleteLedger((query) => query.eq('id', ledger.id))
                  await refetchLedgers()
                }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={async () => {
            const newId = makeId('conn', 'postgres', makeUlid())
            await insertLedger({id: newId, creator_id: userId})
            await refetchLedgers()
            setLedgerId(newId)
          }}>
          Create new ledger
        </button>
      </Layout>
    </>
  )
}
