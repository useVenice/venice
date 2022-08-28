import {useLedgerSync} from '@ledger-sync/engine-frontend'
import {Card} from '@supabase/ui'
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
          className={tw`container flex flex-col items-center justify-center mx-auto flex-1`}>
          <div className={tw`flex flex-col space-y-4`}>
            {connectionsRes.data?.map((conn) => (
              <Card title={(conn as any).settings.institution.name}>
                <img
                  src={`data:image/png;base64,${
                    (conn as any).settings.institution.logo
                  }`}
                />
                <pre>{JSON.stringify(conn, null, 2)}</pre>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    </>
  )
}
