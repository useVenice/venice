import {useAtomValue} from 'jotai'
import {
  ArrowClockwise,
  Circle,
  CloudSlash,
  DotsThreeVertical,
  Play,
  Trash,
} from 'phosphor-react'
import {twMerge} from 'tailwind-merge'

import type {EnvName, ZStandard} from '@usevenice/cdk-core'
import {useVenice} from '@usevenice/engine-frontend'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@usevenice/ui'
import {formatDateTime, sentenceCase} from '@usevenice/util'

import {InstitutionLogo} from '../../components/InstitutionLogo'
import {envAtom} from '../../contexts/atoms'

export interface ConnectionCardProps {
  connection: ZStandard['connection'] & {
    envName: EnvName | null | undefined
    syncInProgress: boolean
    lastSyncCompletedAt: Date | null | undefined
    institution: ZStandard['institution'] | null | undefined
  }
}

export function ConnectionCard({connection: conn}: ConnectionCardProps) {
  const env = useAtomValue(envAtom)
  // NOTE: envName is not relevant when reconnecting,
  // and honestly neither is userId...
  // How do we express these situations?
  const {
    connect,
    syncConnection,
    deleteConnection,
    checkConnection,
    developerMode,
  } = useVenice({envName: env})
  return (
    <div className="card max-w-md border border-base-content/25 bg-tableRow p-10">
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

              {conn.envName === 'sandbox' && (
                <DropdownMenuItem
                  className="btn btn-ghost no-animation justify-start gap-2"
                  onClick={() =>
                    checkConnection
                      .mutateAsync([
                        {id: conn.id},
                        {sandboxSimulateDisconnect: true},
                      ])
                      .then((res) => {
                        console.log('checkConnection success', res)
                      })
                      .catch((err) => {
                        console.error('checkConnection error', err)
                      })
                  }>
                  <CloudSlash />
                  Simulate disconnect
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-between space-x-4">
          <span className="card-title text-xl text-offwhite">
            {conn.displayName}
          </span>

          <div className="flex flex-col items-end space-y-1 text-sm">
            {conn.status && conn.status !== 'manual' && (
              <div
                className={twMerge(
                  'flex items-center space-x-1',
                  {
                    healthy: 'text-green',
                    disconnected: 'text-orange-600',
                    error: 'text-red',
                  }[conn.status],
                )}>
                <Circle weight="fill" />
                <span>{sentenceCase(conn.status)}</span>
              </div>
            )}

            <span className="text-xs text-gray">
              {conn.syncInProgress
                ? 'Syncing…'
                : conn.lastSyncCompletedAt
                ? `Synced ${
                    formatDateTime(conn.lastSyncCompletedAt, 'relative') ??
                    'recently'
                  }`
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
