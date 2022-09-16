import {useAtomValue} from 'jotai'

import {modeAtom} from '../../contexts/atoms'
import {MyConnectionsScreen} from '../../screens/MyConnectionsScreen'
import {NewConnectionScreen} from '../../screens/NewConnectionScreen'

export default function LedgerPage() {
  const mode = useAtomValue(modeAtom)
  return mode === 'connect' ? <NewConnectionScreen /> : <MyConnectionsScreen />
}
