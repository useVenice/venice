import {VeniceProvider} from '@usevenice/engine-frontend'

import {Layout} from '../../components/Layout'

export default function HomePage() {
  const {ledgerId} = VeniceProvider.useContext()
  return (
    <>
      <title>Venice | {ledgerId}</title>
      <Layout
        title={ledgerId}
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
