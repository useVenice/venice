import Head from 'next/head'
import {useRouter} from 'next/router'
import {Circle} from 'phosphor-react'
import {twMerge} from 'tailwind-merge'

import type {Id} from '@ledger-sync/cdk-core'
import {useLedgerSync} from '@ledger-sync/engine-frontend'

import {Layout} from '../../../components/Layout'

export default function LedgerMyConnectionsScreen() {
  const router = useRouter()
  const {ledgerId} = router.query as {ledgerId: Id['ldgr']}

  // NOTE: envName is not relevant when reconnecting,
  // and honestly neither is ledgerId...
  // How do we express these situations?
  const {connectionsRes, connect} = useLedgerSync({
    ledgerId,
    envName: 'sandbox', // Add control for me...
  })
  const connections = connectionsRes.data
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
        <div className="mx-auto w-full max-w-screen-2xl flex-1 flex-col overflow-y-auto px-4 py-8 md:px-8">
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
                        src={conn.institution?.logoUrl}
                        alt={`"${conn.institution?.name}" logo`}
                        className="h-12 w-12 overflow-hidden object-contain"
                      />

                      <div className="flex-row gap-4">
                        <span className="badge-outline badge uppercase">
                          {conn.institution?.envName}
                        </span>
                        <span>{conn.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between space-x-4">
                    <span className="text-xl font-medium">
                      {conn.displayName}
                    </span>

                    <div
                      className={twMerge(
                        'flex items-center space-x-2 text-sm',
                        conn.status === 'healthy'
                          ? ' text-green-600'
                          : conn.status === 'disconnected'
                          ? 'text-orange-600'
                          : conn.status === 'error'
                          ? 'text-red-600'
                          : '',
                      )}>
                      <Circle weight="fill" />
                      <span>{conn.status}</span>
                      {conn.status === 'disconnected' && (
                        <button
                          onClick={() => {
                            connect(
                              {id: 'int_plaid_'}, // Need the integration id too
                              {connectionId: conn.id},
                            )
                          }}>
                          Reconnect
                        </button>
                      )}
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
