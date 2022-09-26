import {VeniceProvider} from '@usevenice/engine-frontend'
import {Container, EffectContainer, Loading} from '@usevenice/ui'

import {Layout} from '../components/Layout'
import {useRouterPlus} from '../contexts/atoms'
import {AdminHomeScreen} from '../screens/AdminHomeScreen'

export default function HomeScreen() {
  const router = useRouterPlus()
  const {ledgerId, isAdmin} = VeniceProvider.useContext()
  if (isAdmin) {
    return (
      <Layout>
        <AdminHomeScreen />
      </Layout>
    )
  }
  if (ledgerId) {
    return (
      <EffectContainer
        effect={() => void router.pushPathname(`/ledgers/${ledgerId}`)}>
        <Layout>
          <Container className="flex-1">
            <Loading />
          </Container>
        </Layout>
      </EffectContainer>
    )
  }
  return (
    <Layout>
      <Container className="flex-1">
        <span className="text-xs">Unauthorized</span>
      </Container>
    </Layout>
  )
}
