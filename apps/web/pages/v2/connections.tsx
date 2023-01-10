import {useAtomValue} from 'jotai'

import {VeniceProvider} from '@usevenice/engine-frontend'

import {Layout} from '../../components/Layout'
import {modeAtom} from '../../contexts/atoms'
import {MyConnectionsScreen} from '../../screens/MyConnectionsScreen'
import {NewConnectionScreen} from '../../screens/NewConnectionScreen'

export default function ConnectionsScreen() {
  const mode = useAtomValue(modeAtom)
  const {userId} = VeniceProvider.useContext()

  return (
    <>
      <title>Venice | {userId}</title>
      <Layout
        title={userId}
        links={[
          {label: 'Connections', href: '/v2/connections'},
          {label: 'Data explorer', href: '/v2/data-explorer'},
          // {
          //   label: 'New connection',
          //   href: `/users/${userId}?mode=connect`,
          //   primary: true,
          //   fixed: true,
          // },
        ]}>
        {mode === 'connect' ? <NewConnectionScreen /> : <MyConnectionsScreen />}
      </Layout>
    </>
  )
}
