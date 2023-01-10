import {useAtomValue} from 'jotai'
import Head from 'next/head'

import {VeniceProvider} from '@usevenice/engine-frontend'

import {Layout} from '../../components/Layout'
import {modeAtom} from '../../contexts/atoms'
import {MyConnectionsScreen} from '../../screens/MyConnectionsScreen'
import {NewConnectionScreen} from '../../screens/NewConnectionScreen'

export default function LedgerPage() {
  const mode = useAtomValue(modeAtom)
  const {userId} = VeniceProvider.useContext()
  return (
    <>
      <Head>
        <title>Venice | {userId}</title>
      </Head>

      <Layout
        title={userId}
        links={[
          {label: 'My connections', href: `/users/${userId}`},
          {
            label: 'New connection',
            href: `/users/${userId}?mode=connect`,
            primary: true,
            fixed: true,
          },
        ]}>
        {mode === 'connect' ? <NewConnectionScreen /> : <MyConnectionsScreen />}
      </Layout>
    </>
  )
}
