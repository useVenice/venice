import {useAtomValue} from 'jotai'

import {VeniceProvider} from '@usevenice/engine-frontend'

import {Layout} from '../../components/Layout'
import {modeAtom} from '../../contexts/atoms'
import {MyConnectionsScreen} from '../../screens/MyConnectionsScreen'
import {NewConnectionScreen} from '../../screens/NewConnectionScreen'

export default function ConnectionsScreen() {
  const mode = useAtomValue(modeAtom)
  const {ledgerId} = VeniceProvider.useContext()

  return (
    <>
      <title>Venice | {ledgerId}</title>
      <Layout
        title={ledgerId}
        links={[
          {label: 'Connections', href: '/v2/connections'},
          {label: 'Data explorer', href: '/v2/data-explorer'},
          // {
          //   label: 'New connection',
          //   href: `/ledgers/${ledgerId}?mode=connect`,
          //   primary: true,
          //   fixed: true,
          // },
        ]}>
        {mode === 'connect' ? <NewConnectionScreen /> : <MyConnectionsScreen />}
      </Layout>
    </>
  )
}
