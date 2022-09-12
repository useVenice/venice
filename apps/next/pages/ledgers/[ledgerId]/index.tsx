import Head from 'next/head'
import {useRouter} from 'next/router'
import {
  ArrowClockwise,
  Circle,
  DotsThree,
  Play,
  PlugsConnected,
  Trash,
} from 'phosphor-react'
import {useState} from 'react'
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

  const [dropdownShow, setDropdownShow] = useState(false)

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
            <div
              key="key1"
              className="card border border-base-content/25 transition-[transform,shadow] hover:scale-105 hover:shadow-lg">
              <div className="card-body justify-between space-y-8 pt-4">
                <div className="flex space-x-4">
                  <div className="flex w-full flex-col space-y-2">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-col justify-center space-y-4">
                        <img
                          src="https://joeschmoe.io/api/v1/random"
                          alt="Random Logo"
                          className="h-12 w-12 overflow-hidden object-contain"
                        />
                        <span className="badge-outline badge text-xs uppercase text-black">
                          SANDBOX
                        </span>
                      </div>
                      <div className="flex flex-row space-x-4">
                        <div className="flex flex-col items-center space-y-1">
                          <button
                            data-tooltip-target="tooltip-default"
                            className="btn-outline btn btn-sm btn-circle border-base-content/25">
                            <ArrowClockwise size={16} />
                          </button>
                          <span className="text-xs text-gray-400">Sync</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <button
                            data-tooltip-target="tooltip-default"
                            className="btn-outline btn btn-sm btn-circle border-base-content/25">
                            <Play size={16} />
                          </button>
                          <div className="text-xs text-gray-400">Full Sync</div>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <button
                            data-tooltip-target="tooltip-default"
                            className="btn-outline btn btn-sm btn-circle border-base-content/25">
                            <Trash size={16} />
                          </button>
                          <div className="text-xs text-gray-400">Delete</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 pt-4">
                  <div className="flex justify-between space-x-4">
                    <span className="text-xl font-medium text-black">
                      Chase Bank
                    </span>

                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <Circle weight="fill" />
                      <span>Healthy</span>
                    </div>
                  </div>
                  <div>
                    <p className="w-70 truncate font-mono text-sm text-gray-400 hover:text-clip">
                      conn_plaid_yE1Nd9K8e5SpnDQLJdPvuxopn46ER8tyvaPbM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              key="key2"
              className="card border border-base-content/25 transition-[transform,shadow] hover:scale-105 hover:shadow-lg">
              <div className="card-body justify-between space-y-8 pt-4">
                <div className="flex space-x-4">
                  <div className="flex w-full flex-col space-y-2">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-col justify-center space-y-4">
                        <img
                          src="https://joeschmoe.io/api/v1/random"
                          alt="Random Logo"
                          className="h-12 w-12 overflow-hidden object-contain"
                        />
                        <span className="badge-outline badge text-xs uppercase text-black">
                          DEVELOPMENT
                        </span>
                      </div>
                      <div className="flex flex-row space-x-4">
                        <div className="flex flex-col items-center space-y-1">
                          <button
                            data-tooltip-target="tooltip-default"
                            className="btn-outline btn btn-sm btn-circle border-base-content/25">
                            <PlugsConnected size={16} />
                          </button>
                          <span className="text-xs text-gray-400">
                            Reconnect
                          </span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <button
                            data-tooltip-target="tooltip-default"
                            className="btn-outline btn btn-sm btn-circle border-base-content/25">
                            <Play size={16} />
                          </button>
                          <div className="text-xs text-gray-400">Full Sync</div>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <button
                            data-tooltip-target="tooltip-default"
                            className="btn-outline btn btn-sm btn-circle border-base-content/25">
                            <Trash size={16} />
                          </button>
                          <div className="text-xs text-gray-400">Delete</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 pt-4">
                  <div className="flex justify-between space-x-4">
                    <span className="text-xl font-medium text-black">
                      Bank of America
                    </span>

                    <div className="flex items-center space-x-2 text-sm text-orange-600">
                      <Circle weight="fill" />
                      <span>Disconnected</span>
                    </div>
                  </div>
                  <div>
                    <p className="w-70 truncate font-mono text-sm text-gray-400 hover:text-clip">
                      conn_plaid_yE1Nd9K8e5SpnDQLJdPvuxopn46ER8tyvaPbM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              key="key3"
              className="card border border-base-content/25 transition-[transform,shadow] hover:scale-105 hover:shadow-lg">
              <div className="card-body justify-between space-y-8 pt-4">
                <div className="flex space-x-4">
                  <div className="flex w-full flex-col space-y-2">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-col justify-center space-y-4">
                        <img
                          src="https://joeschmoe.io/api/v1/random"
                          alt="Random Logo"
                          className="h-12 w-12 overflow-hidden object-contain"
                        />
                        <span className="badge-outline badge text-xs uppercase text-black">
                          PRODUCTION
                        </span>
                      </div>
                      <div className="flex flex-row space-x-4">
                        <div className="flex flex-col items-center space-y-1">
                          <button
                            data-tooltip-target="tooltip-default"
                            className="btn-outline btn btn-sm btn-circle border-base-content/25">
                            <PlugsConnected size={16} />
                          </button>
                          <span className="text-xs text-gray-400">
                            Reconnect
                          </span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <button
                            data-tooltip-target="tooltip-default"
                            className="btn-outline btn btn-sm btn-circle border-base-content/25">
                            <Trash size={16} />
                          </button>
                          <div className="text-xs text-gray-400">Delete</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 pt-4">
                  <div className="flex justify-between space-x-4">
                    <span className="text-xl font-medium text-black">
                      Wells Fargo
                    </span>

                    <div className="flex items-center space-x-2 text-sm text-red-600">
                      <Circle weight="fill" />
                      <span>Reconnect</span>
                    </div>
                  </div>
                  <div>
                    <p className="w-70 truncate font-mono text-sm text-gray-400 hover:text-clip">
                      conn_plaid_yE1Nd9K8e5SpnDQLJdPvuxopn46ER8tyvaPbM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* <div
              key={"key3"}
              className="card border border-base-content/25 transition-[transform,shadow] hover:scale-105 hover:shadow-lg">
              <div className="card-body space-y-4">
                <div className="flex space-x-4">
                  <div className="flex flex-col space-y-2 w-full">
                    <div className="flex flex-row justify-between items-center">
                      <img
                        src="https://joeschmoe.io/api/v1/random"
                        alt="Random Logo"
                        className="h-12 w-12 overflow-hidden object-contain"
                      />
                      <div className="flex flex-row space-x-4">
                        <button data-tooltip-target="tooltip-default" className="btn-outline btn btn-sm btn-circle border-base-content/25">
                          <PlugsConnected size={16} />
                        </button>
                        <button data-tooltip-target="tooltip-default" className="btn-outline btn btn-sm btn-circle border-base-content/25">
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex-row gap-4">
                      <span className="badge-outline badge uppercase text-xs">
                        PRODUCTION
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 pt-4">
                  <div className="flex justify-between space-x-4">
                    <span className="text-xl text-black font-medium">
                      Wells Fargo
                    </span>

                    <div
                      className='flex items-center space-x-2 text-sm text-red-600'>
                      <Circle weight="fill" />
                      <span>Reconnect</span>
                    </div>
                  </div>
                  <div>
                    <p className="truncate w-70 hover:text-clip font-mono text-sm text-gray-400">conn_plaid_yE1Nd9K8e5SpnDQLJdPvuxopn46ER8tyvaPbM</p>
                  </div>
                </div>
              </div>
            </div> */}

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
                              {id: 'int_plaid'}, // Need the integration id too
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
