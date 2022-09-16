import {useAtomValue} from 'jotai'
import Head from 'next/head'

import {LSProvider} from '@ledger-sync/engine-frontend'

import {Layout} from '../../components/Layout'
import {modeAtom} from '../../contexts/atoms'
import {MyConnectionsScreen} from '../../screens/MyConnectionsScreen'
import {NewConnectionScreen} from '../../screens/NewConnectionScreen'

export default function LedgerPage() {
  const mode = useAtomValue(modeAtom)
  const {ledgerId} = LSProvider.useContext()
  return (
    <>
      <Head>
        <title>LedgerSync | Viewing as {ledgerId}</title>
      </Head>

      <Layout
        title={ledgerId}
        links={[
          {label: 'My connections', href: `/ledgers/${ledgerId}`},
          {
            label: 'New connection',
            href: `/ledgers/${ledgerId}?mode=connect`,
            primary: true,
            fixed: true,
          },
        ]}>
        {mode === 'connect' ? <NewConnectionScreen /> : <MyConnectionsScreen />}
      </Layout>
    </>
  )
}
