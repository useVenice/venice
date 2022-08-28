import {useLedgerSync} from '@ledger-sync/engine-frontend'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {tw} from 'twind'
import {Layout} from '../../../components/Layout'

export default function LedgerMyConnectionsScreen() {
  const router = useRouter()
  const {ledgerId} = router.query as {ledgerId: string}
  const {connectionsRes} = useLedgerSync({
    ledgerId,
    envName: 'sandbox', // Add control for me...
  })
  console.log('connectionsRes', connectionsRes)
  return (
    <>
      <Head>
        <title>LedgerSync | Viewing as {ledgerId} | My connections</title>
      </Head>

      <Layout
        title={`Viewing as ${ledgerId}`}
        links={[
          {label: 'My connections', href: `/ledgers/${ledgerId}`},
          {label: 'Connect', href: `/ledgers/${ledgerId}/new-connection`},
        ]}>
        <div
          className={tw`flex flex-col space-y-4`}
          style={{maxWidth: '1024px', maxHeight: '400px'}}>
          {connectionsRes.data?.map((conn) => (
            <div
              className={tw`flex flex-row`}
              style={{margin: 32, padding: 16, border: '1px solid #eeeeee'}}>
              <img
                style={{objectFit: 'contain'}}
                src={`data:image/png;base64,${
                  (conn as any).settings.institution.logo
                }`}
              />
              <div>
                <h2>{(conn as any).settings.institution.name}</h2>
                <pre style={{maxHeight: 300, overflow: 'scroll'}}>
                  {JSON.stringify(conn, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </>
  )
}
