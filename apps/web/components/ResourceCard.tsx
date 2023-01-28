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

import {envAtom} from '../contexts/atoms'
import {copyToClipboard} from '../contexts/common-contexts'
import {InstitutionLogo} from './InstitutionLogo'

export interface ResourceCardProps {
  resource: ZStandard['resource'] & {
    envName: EnvName | null | undefined
    syncInProgress: boolean
    lastSyncCompletedAt: Date | null | undefined
    institution: ZStandard['institution'] | null | undefined
  }
}

export function ResourceCard({resource: reso}: ResourceCardProps) {
  const env = useAtomValue(envAtom)
  // NOTE: envName is not relevant when reconnecting,
  // and honestly neither is userId...
  // How do we express these situations?
  const {connect, syncResource, deleteResource, checkResource, developerMode} =
    useVenice({envName: env})

  const dropdownItemClass =
    'cursor-pointer text-offwhite/75 p-2 hover:outline-0 outline-none hover:bg-offwhite/5 rounded-lg'

  return (
    <div className="card max-w-md border border-base-content/25 bg-primaryUIControl">
      <div className="card-body p-4">
        <div className="flex space-x-4">
          <div className="flex flex-col space-y-2">
            <InstitutionLogo institution={reso.institution} />

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
            {reso.status === 'disconnected' && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  void connect(
                    {id: 'int_plaid'}, // Need the integration id too
                    {resourceId: reso.id},
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
                (syncResource.isLoading || deleteResource.isLoading) &&
                  'loading cursor-not-allowed',
              )}>
              <DotsThreeVertical />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="border border-base-content/25 bg-black text-sm">
              <DropdownMenuItem
                className={dropdownItemClass}
                onClick={() => copyToClipboard(reso.id)}>
                Copy id
              </DropdownMenuItem>
              <DropdownMenuItem
                className={dropdownItemClass}
                onClick={() =>
                  syncResource
                    .mutateAsync([{id: reso.id}, {}])
                    .then((res) => {
                      console.log('syncResource success', res)
                    })
                    .catch((err) => {
                      console.error('syncResource error', err)
                    })
                }>
                Sync
              </DropdownMenuItem>

              <DropdownMenuItem
                className={dropdownItemClass}
                onClick={() =>
                  syncResource
                    .mutateAsync([{id: reso.id}, {fullResync: true}])
                    .then((res) => {
                      console.log('syncResource success', res)
                    })
                    .catch((err) => {
                      console.error('syncResource error', err)
                    })
                }>
                Full sync
              </DropdownMenuItem>

              {/* TODO: Add a confirmation dialog */}
              <DropdownMenuItem
                className={twMerge(dropdownItemClass, 'text-red')}
                onClick={() =>
                  deleteResource
                    .mutateAsync([{id: reso.id}, {}])
                    .then((res) => {
                      console.log('deleteResource success', res)
                    })
                    .catch((err) => {
                      console.error('deleteResource error', err)
                    })
                }>
                Delete
              </DropdownMenuItem>

              {reso.envName === 'sandbox' && (
                <DropdownMenuItem
                  className={dropdownItemClass}
                  onClick={() =>
                    checkResource
                      .mutateAsync([
                        {id: reso.id},
                        {sandboxSimulateDisconnect: true},
                      ])
                      .then((res) => {
                        console.log('checkResource success', res)
                      })
                      .catch((err) => {
                        console.error('checkResource error', err)
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
            {reso.displayName}
          </span>

          <div className="flex flex-col items-end space-y-1 text-sm">
            {reso.status && reso.status !== 'manual' && (
              <div
                className={twMerge(
                  'flex items-center space-x-1',
                  {
                    healthy: 'text-green',
                    disconnected: 'text-orange-600',
                    error: 'text-red',
                  }[reso.status],
                )}>
                <Circle weight="fill" />
                <span>{sentenceCase(reso.status)}</span>
              </div>
            )}

            <span className="text-xs text-gray">
              {reso.syncInProgress
                ? 'Syncing…'
                : reso.lastSyncCompletedAt
                ? `Synced ${
                    formatDateTime(reso.lastSyncCompletedAt, 'relative') ??
                    'recently'
                  }`
                : 'Never synced yet'}
            </span>
          </div>
        </div>

        {developerMode && (
          <div className="flex-row gap-4">
            <span className="text-2xs border-base-content/25">{reso.id}</span>
          </div>
        )}
      </div>
    </div>
  )
}
