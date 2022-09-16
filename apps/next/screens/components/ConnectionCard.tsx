import {useAtomValue} from 'jotai'
import {
  ArrowClockwise,
  Circle,
  DotsThreeVertical,
  Play,
  Trash,
} from 'phosphor-react'
import {twMerge} from 'tailwind-merge'

import type {ZStandard} from '@ledger-sync/cdk-core'
import {useLedgerSync} from '@ledger-sync/engine-frontend'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ledger-sync/ui'
import {formatDate, sentenceCase} from '@ledger-sync/util'

import {InstitutionLogo} from '../../components/InstitutionLogo'
import {envAtom} from '../../contexts/atoms'

export interface ConnectionCardProps {
  connection: ZStandard['connection'] & {
    syncInProgress: boolean
    lastSyncCompletedAt: Date | null | undefined
    institution: ZStandard['institution'] | null | undefined
  }
}

export function ConnectionCard({connection: conn}: ConnectionCardProps) {
  const env = useAtomValue(envAtom)
  // NOTE: envName is not relevant when reconnecting,
  // and honestly neither is ledgerId...
  // How do we express these situations?
  const {connect, syncConnection, deleteConnection, developerMode} =
    useLedgerSync({envName: env})
  return (
    <div className="card border border-base-content/25 transition-[transform,shadow] hover:scale-105 hover:shadow-lg">
      <div className="card-body space-y-4">
        <div className="flex space-x-4">
          <div className="flex flex-col space-y-2">
            <InstitutionLogo institution={conn.institution} />

            {developerMode && (
              <div className="flex-row gap-4">
                <span className="badge-outline badge text-2xs border-base-content/25 uppercase">
                  {/* FIXME */}
                  sandbox
                </span>
              </div>
            )}
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

          <DropdownMenu>
            <DropdownMenuTrigger
              className={twMerge(
                'btn-outline btn btn-sm btn-circle border-base-content/25 text-lg',
                (syncConnection.isLoading || deleteConnection.isLoading) &&
                  'btn-disabled loading',
              )}>
              <DotsThreeVertical />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-screen md:w-52">
              <DropdownMenuItem
                className="btn btn-ghost no-animation justify-start gap-2"
                onClick={() =>
                  syncConnection
                    .mutateAsync([{id: conn.id}, {}])
                    .then((res) => {
                      console.log('syncConnection success', res)
                    })
                    .catch((err) => {
                      console.error('syncConnection error', err)
                    })
                }>
                <ArrowClockwise />
                Sync
              </DropdownMenuItem>

              <DropdownMenuItem
                className="btn btn-ghost no-animation justify-start gap-2"
                onClick={() =>
                  syncConnection
                    .mutateAsync([{id: conn.id}, {fullResync: true}])
                    .then((res) => {
                      console.log('syncConnection success', res)
                    })
                    .catch((err) => {
                      console.error('syncConnection error', err)
                    })
                }>
                <Play />
                Full sync
              </DropdownMenuItem>

              <DropdownMenuItem
                className="btn btn-ghost no-animation justify-start gap-2"
                onClick={() =>
                  deleteConnection
                    .mutateAsync([{id: conn.id}, {}])
                    .then((res) => {
                      console.log('deleteConnection success', res)
                    })
                    .catch((err) => {
                      console.error('deleteConnection error', err)
                    })
                }>
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

        {developerMode && (
          <div className="flex-row gap-4">
            <span className="text-2xs border-base-content/25">{conn.id}</span>
          </div>
        )}
      </div>
    </div>
  )
}
