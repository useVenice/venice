import {LSProvider} from '@ledger-sync/engine-frontend'

import {EffectContainer} from '../components/EffectContainer'
import {useRouterPlus} from '../contexts/atoms'
import {AdminHomeScreen} from '../screens/AdminHomeScreen'

export default function HomeScreen() {
  const router = useRouterPlus()
  const {ledgerId, isAdmin} = LSProvider.useContext()

  return isAdmin ? (
    <AdminHomeScreen />
  ) : ledgerId ? (
    <EffectContainer
      effect={() => void router.pushPathname(`/ledgers/${ledgerId}`)}
    />
  ) : (
    <div>Unauthorized</div>
  )
}
