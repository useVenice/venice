import {useAtomValue} from 'jotai'
import Head from 'next/head'

import {VeniceProvider} from '@usevenice/engine-frontend'

import {Layout} from '../../components/Layout'
import {modeAtom} from '../../contexts/atoms'
import {MyConnectionsScreen} from '../../screens/MyConnectionsScreen'
import {NewConnectionScreen} from '../../screens/NewConnectionScreen'

export default function LedgerPage() {
  const mode = useAtomValue(modeAtom)
  const {ledgerId} = VeniceProvider.useContext()
  return (
    <>
      <Head>
        <title>Venice | {ledgerId}</title>
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
