import {useRouterQuery} from 'next-router-query'
import Head from 'next/head'
import type {IconProps} from 'phosphor-react'
import {ArrowClockwise, Circle, Play, Trash} from 'phosphor-react'
import {twMerge} from 'tailwind-merge'
import {match} from 'ts-pattern'

import type {Id, ZStandard} from '@ledger-sync/cdk-core'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
import {formatDate, sentenceCase} from '@ledger-sync/util'

import {Container} from '../../../components/Container'
import {InstitutionLogo} from '../../../components/InstitutionLogo'
import {Layout} from '../../../components/Layout'
import {Loading} from '../../../components/Loading'
import {useEnv} from '../../../contexts/PortalParamsContext'

export default function LedgerMyConnectionsScreen() {
  const {ledgerId} = useRouterQuery() as {ledgerId: Id['ldgr']}
  const env = useEnv()
  const {connectionsRes} = useLedgerSync({
    ledgerId,
    envName: env,
  })
  return (
    <>
      <Head>
        <title>LedgerSync | Viewing as {ledgerId} | My connections</title>
      </Head>

      <Layout
        links={[
          {label: 'My connections', href: `/ledgers/${ledgerId}`},
          {
            label: 'New connection',
            href: `/ledgers/${ledgerId}/new-connection`,
            primary: true,
          },
        ]}>
        <Container className="flex-1 overflow-y-auto">
          {match(connectionsRes)
            .with({status: 'idle'}, () => null)
            .with({status: 'loading'}, () => <Loading />)
            .with({status: 'error'}, () => (
              <span className="text-xs">Something went wrong</span>
            ))
            .with({status: 'success'}, (res) =>
              res.data.length === 0 ? (
                <span className="text-xs">No results</span>
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {res.data.map((conn) => (
                    <ConnectionCard
                      key={conn.id}
                      ledgerId={ledgerId}
                      connection={conn}
                    />
                  ))}
                </div>
              ),
            )
            .exhaustive()}
        </Container>
      </Layout>
    </>
  )
}

function ConnectionCard({
  ledgerId,
  connection: conn,
}: {
  ledgerId: Id['ldgr']
  connection: ZStandard['connection'] & {
    syncInProgress: boolean
    lastSyncCompletedAt: Date | null | undefined
    institution: ZStandard['institution'] | null | undefined
  }
}) {
  const env = useEnv()
  // NOTE: envName is not relevant when reconnecting,
  // and honestly neither is ledgerId...
  // How do we express these situations?
  const {connect, syncConnection, deleteConnection} = useLedgerSync({
    ledgerId,
    envName: env,
  })
  return (
    <div className="card border border-base-content/25 transition-[transform,shadow] hover:scale-105 hover:shadow-lg">
      <div className="card-body space-y-4">
        <div className="flex space-x-4">
          <div className="flex flex-col space-y-2">
            <InstitutionLogo institution={conn.institution} />

            <div className="flex-row gap-4">
              <span className="badge-outline badge text-2xs border-base-content/25 uppercase">
                {/* FIXME */}
                sandbox
              </span>
            </div>
          </div>

          <div className="flex flex-1 justify-end">
            {conn.status === 'disconnected' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  void connect(
                    {id: 'int_plaid'}, // Need the integration id too
                    {connectionId: conn.id},
                  )
                }}>
                Reconnect
              </button>
            )}
          </div>

          <CardButton
            label="Sync"
            IconComponent={ArrowClockwise}
            onClick={() =>
              syncConnection
                .mutateAsync([{id: conn.id}, {}])
                .then((res) => {
                  console.log('syncConnection success', res)
                })
                .catch((err) => {
                  console.error('syncConnection error', err)
                })
            }
          />

          <CardButton
            label="Full Sync"
            IconComponent={Play}
            onClick={() =>
              syncConnection
                .mutateAsync([{id: conn.id}, {fullResync: true}])
                .then((res) => {
                  console.log('syncConnection success', res)
                })
                .catch((err) => {
                  console.error('syncConnection error', err)
                })
            }
          />

          <CardButton
            label="Delete"
            IconComponent={Trash}
            onClick={() =>
              deleteConnection
                .mutateAsync([{id: conn.id}, {}])
                .then((res) => {
                  console.log('deleteConnection success', res)
                })
                .catch((err) => {
                  console.error('deleteConnection error', err)
                })
            }
          />
        </div>

        <div className="flex justify-between space-x-4">
          <span className="card-title text-xl text-black">
            {conn.displayName}
          </span>

          <div className="flex flex-col items-end space-y-1 text-sm">
            {conn.status && conn.status !== 'manual' && (
              <div
                className={twMerge(
                  'flex items-center space-x-1',
                  {
                    healthy: 'text-green-600',
                    disconnected: 'text-orange-600',
                    error: 'text-red-600',
                  }[conn.status],
                )}>
                <Circle weight="fill" />
                <span>{sentenceCase(conn.status)}</span>
              </div>
            )}

            <span className="text-xs text-gray-500">
              {conn.syncInProgress
                ? 'Syncing…'
                : conn.lastSyncCompletedAt
                ? `Synced ${formatDate(conn.lastSyncCompletedAt, 'relative')}`
                : 'Never synced yet'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardButton({
  label,
  IconComponent,
  onClick,
}: {
  label: string
  IconComponent: React.ComponentType<IconProps>
  onClick: (event: React.MouseEvent) => void
}) {
  return (
    <button className="flex flex-col items-center space-y-1">
      <div
        className="btn-outline btn btn-sm btn-circle border-base-content/25"
        onClick={onClick}>
        <IconComponent size={16} />
      </div>
      <span className="text-xs text-gray-500">{label}</span>
    </button>
  )
}
