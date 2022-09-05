import {Layout} from '../../../components/Layout'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {Circle} from 'phosphor-react'

export default function LedgerMyConnectionsScreen() {
  const router = useRouter()
  const {ledgerId} = router.query as {ledgerId: string}
  const {connectionsRes} = useLedgerSync({
    ledgerId,
    envName: 'sandbox', // Add control for me...
  })
  const connections = connectionsRes.data
  console.log('connections', connections)
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
        <div className="mx-auto w-full max-w-screen-2xl flex-1 flex-col overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {connections?.map((conn) => (
              <div
                key={conn.id}
                className="card border border-base-content/25 transition-[transform,shadow] hover:scale-105 hover:shadow-lg">
                <div className="card-body space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex flex-col space-y-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`data:image/png;base64,${
                          (conn as any).institution.logo
                        }`}
                        alt={`"${(conn as any).institution.name}" logo`}
                        className="h-12 w-12 overflow-hidden object-contain"
                      />

                      <span className="badge-outline badge uppercase">
                        {(conn as any).envName}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between space-x-4">
                    <span className="text-xl font-medium">
                      {(conn as any).institution.name}
                    </span>

                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <Circle weight="fill" />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  )
}
