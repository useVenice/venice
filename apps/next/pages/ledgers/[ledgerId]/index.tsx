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
          className={tw`flex flex-col flex-1 p-8 mx-auto max-w-screen-2xl overflow-y-auto space-y-4`}>
          {connectionsRes.data?.map((conn) => (
            <div
              className={tw`flex flex-row p-2 bg-gray-100 border-2 border-gray-200 rounded-lg object-contain space-x-4`}>
              <img
                src={`data:image/png;base64,${
                  (conn as any).settings.institution.logo
                }`}
                alt={`"${(conn as any).settings.institution.name}" logo`}
                className={tw`w-32 h-32 object-contain`}
              />

              <div className={tw`flex flex-col space-y-2`}>
                <span className={tw`text-xl font-medium`}>
                  {(conn as any).settings.institution.name}
                </span>

                <pre className={tw`max-h-64 overflow-y-auto`}>
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
