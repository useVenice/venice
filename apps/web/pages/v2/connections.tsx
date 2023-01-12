import {useAtom, useAtomValue} from 'jotai'
import React from 'react'
import {useFilter, useSelect} from 'react-supabase'

import type {Id} from '@usevenice/cdk-core'
import {VeniceProvider} from '@usevenice/engine-frontend'

import {Layout} from '../../components/Layout'
import {ledgerIdAtom, modeAtom} from '../../contexts/atoms'
import {MyConnectionsScreen} from '../../screens/MyConnectionsScreen'
import {NewConnectionScreen} from '../../screens/NewConnectionScreen'

export default function ConnectionsScreen() {
  const mode = useAtomValue(modeAtom)
  const {userId} = VeniceProvider.useContext()

  const [ledgerId, setLedgerId] = useAtom(ledgerIdAtom)
  const [ledgersRes] = useSelect('connection', {
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

  const connectWith = React.useMemo(
    () => ({destinationId: ledgerId as Id['conn']}),
    [ledgerId],
  )

  return (
    <>
      <title>Venice | {userId}</title>
      <Layout
        title={userId}
        links={[
          {label: 'Connections', href: '/v2/connections'},
          {label: 'Data explorer', href: '/v2/data-explorer'},
          {
            label: 'New connection',
            href: '/v2/connections?mode=connect',
            primary: true,
            fixed: true,
          },
        ]}>
        {mode === 'connect' ? (
          <NewConnectionScreen connectWith={connectWith} />
        ) : (
          <MyConnectionsScreen />
        )}
      </Layout>
    </>
  )
}
