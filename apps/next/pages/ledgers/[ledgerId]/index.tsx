import {Layout} from '../../../components/Layout'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
import Head from 'next/head'
import {useRouter} from 'next/router'

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
        <div className="mx-auto flex max-w-screen-2xl flex-1 flex-col space-y-4 overflow-y-auto p-8">
          {connectionsRes.data?.map((conn) => (
            <div className="flex flex-row space-x-4 rounded-lg border-2 border-gray-200 bg-gray-100 object-contain p-2">
              <img
                src={`data:image/png;base64,${
                  (conn as any).settings.institution.logo
                }`}
                alt={`"${(conn as any).settings.institution.name}" logo`}
                className="h-32 w-32 object-contain"
              />

              <div className="flex flex-col space-y-2">
                <span className="text-xl font-medium">
                  {(conn as any).settings.institution.name}
                </span>

                <pre className="max-h-64 overflow-y-auto">
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
