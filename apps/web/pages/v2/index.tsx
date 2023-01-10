import {VeniceProvider} from '@usevenice/engine-frontend'

import {Layout} from '../../components/Layout'

export default function HomePage() {
  const {userId: userId} = VeniceProvider.useContext()
  return (
    <>
      <title>Venice | {userId}</title>
      <Layout
        title={userId}
        links={[
          {label: 'Connections', href: '/v2/connections'},
          {label: 'Data explorer', href: '/v2/data-explorer'},
          {label: 'Auth', href: '/v2/auth'},
        ]}>
        <div>Welcome to Venice</div>
      </Layout>
    </>
  )
}
