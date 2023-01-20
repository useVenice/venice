import {useAtomValue} from 'jotai'
import {Circle, DotsThreeVertical} from 'phosphor-react'
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

  const dropdownItemClass =
    'cursor-pointer text-offwhite/75 p-2 hover:outline-0 outline-none hover:bg-offwhite/5 rounded-lg'

  return (
    <div className="card max-w-md border border-base-content/25 bg-primaryUIControl">
      <div className="card-body p-4">
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
                'text-xl outline-none hover:outline-0',
                (syncConnection.isLoading || deleteConnection.isLoading) &&
                  'loading cursor-not-allowed',
              )}>
              <DotsThreeVertical />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="border border-base-content/25 bg-black text-sm">
              <DropdownMenuItem
                className={dropdownItemClass}
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
                Sync
              </DropdownMenuItem>

              <DropdownMenuItem
                className={dropdownItemClass}
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
                Full sync
              </DropdownMenuItem>

              {/* TODO: Add a confirmation dialog */}
              <DropdownMenuItem
                className={twMerge(dropdownItemClass, 'text-red')}
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
                Delete
              </DropdownMenuItem>

              {conn.envName === 'sandbox' && (
                <DropdownMenuItem
                  className={dropdownItemClass}
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
                  Simulate disconnect
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-between space-x-4">
          <span className="card-title text-lg text-offwhite">
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
