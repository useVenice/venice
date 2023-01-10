import {Auth} from '@supabase/auth-ui-react'
import {useSelect} from 'react-supabase'

import {Container, EffectContainer, Loading} from '@usevenice/ui'

import {Layout} from '../../components/Layout'
import {useRouterPlus} from '../../contexts/atoms'

export default function DataExplorerScreen() {
  const {user} = Auth.useUser()
  const router = useRouterPlus()

  const [connsRes] = useSelect('connection')
  console.log('conns', connsRes.data)

  const [pipesRes] = useSelect('pipeline')
  console.log('pipes', connsRes.data)

  const [accountsRes] = useSelect('account')
  console.log('accounts', accountsRes.data)

  if (!user) {
    return (
      <EffectContainer effect={() => void router.pushPathname('/v2/auth')}>
        <Layout>
          <Container className="flex-1">
            <Loading />
          </Container>
        </Layout>
      </EffectContainer>
    )
  }

  return (
    <Layout
      links={[
        {label: 'Connections', href: '/v2/connections'},
        {label: 'Data explorer', href: '/v2/data-explorer'},
      ]}>
      <Container className="flex-1">
        <span className="text-xs">You are logged in as {user.id}</span>
        Connections
        <ul>
          {connsRes.data?.map((conn) => (
            <li key={conn.id}>{conn.id}</li>
          ))}
        </ul>
        Pipelines
        <ul>
          {pipesRes.data?.map((pipe) => (
            <li key={pipe.id}>{pipe.id}</li>
          ))}
        </ul>
        Accounts
        <ul>
          {accountsRes.data?.map((account) => (
            <li key={account.id}>{account.id}</li>
          ))}
        </ul>
      </Container>
    </Layout>
  )
}
