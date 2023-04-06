import {useMutation} from '@tanstack/react-query'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {DialogPrimitive, Loading} from '@usevenice/ui'
import {
  CircleFilledIcon,
  DeleteIcon,
  EditIcon,
  SyncIcon,
} from '@usevenice/ui/icons'
import clsx from 'clsx'
import {formatDistanceToNowStrict} from 'date-fns'
import * as Lucide from 'lucide-react'
import Image from 'next/image'
import {forwardRef, useState} from 'react'
import {useSupabase} from '../../../contexts/session-context'

import type {Connection} from '../../../lib/supabase-queries'
import {ResourceCard} from '../../ResourceCard'
import {ActionMenu, ActionMenuItem} from './ActionMenu'
import {DeleteConnectionDialog} from './DeleteConnectionDialog'
import {EditingDisplayName} from './EditingDisplayName'

export interface ConnectionCardProps {
  connection: Connection
  onReconnect?: () => void
  onSandboxSimulateDisconnect?: () => void
}

type ConnectionStatus = Connection['status']

export const ConnectionCard = forwardRef<HTMLDivElement, ConnectionCardProps>(
  function ConnectionCard(props, ref) {
    const {connection, onReconnect} = props
    const {
      id: resourceId,
      displayName,
      institution,
      status,
      labels = [],
      lastSyncCompletedAt,
      syncInProgress,
    } = connection

    // action.rename
    const [isRenaming, setIsRenaming] = useState(false)

    // action.sync
    const {trpc} = VeniceProvider.useContext()
    const trpcCtx = trpc.useContext()
    const dispatch = trpc.dispatch.useMutation()

    const deleteResource = trpc.deleteResource.useMutation({
      onSuccess: () => {
        console.log('Delete success', resourceId)
        void trpcCtx.listConnections.invalidate()
      },
      onError: console.error,
      onSettled: () => setDeleteDialogOpen(false),
    })

    const supabase = useSupabase()
    const deleteAssociatedData = useMutation(
      () =>
        Promise.all([
          supabase
            .from('raw_transaction')
            .delete({count: 'exact'})
            .eq('source_id', resourceId),
          supabase
            .from('raw_account')
            .delete({count: 'exact'})
            .eq('source_id', resourceId),
          supabase
            .from('raw_commodity')
            .delete({count: 'exact'})
            .eq('source_id', resourceId),
        ]).then(() => undefined),
      {mutationKey: ['resource', 'deleteAssociated', resourceId]},
    )

    // action.delete
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

    // TODO: We really need a toast component...

    return (
      <ResourceCard
        tagColor={status === 'disconnected' ? 'venice-red' : 'venice-green'}>
        <div className="flex grow flex-col justify-between py-2 px-3" ref={ref}>
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
            {institution?.logoUrl ? (
              <Image
                width={32}
                height={32}
                src={institution.logoUrl}
                alt={`${institution.name} Logo`}
              />
            ) : (
              <Image
                width={32}
                height={32}
                src="/institution-placeholder.svg"
                alt=""
                aria-hidden="true"
              />
            )}

            {isRenaming ? (
              <EditingDisplayName
                resourceId={resourceId}
                displayName={displayName ?? ''}
                onCancel={() => setIsRenaming(false)}
                onUpdateSuccess={() => setIsRenaming(false)}
              />
            ) : (
              <span
                className="truncate text-sm font-medium uppercase"
                onClick={() => setIsRenaming(true)}>
                {displayName}
              </span>
            )}

            <ActionMenu>
              {/* This is not working... */}
              {/* <ActionMenuItem
                icon={CopyIcon}
                label="Copy Id"
                onClick={() => {
                  void copyToClipboard(resourceId)
                }}
              /> */}
              <ActionMenuItem
                icon={EditIcon}
                label="Rename"
                onClick={() => setIsRenaming(true)}
              />
              <ActionMenuItem
                icon={SyncIcon}
                label="Sync"
                // TODO: show sync in progress and result (success/failure)
                onClick={() =>
                  dispatch.mutate({
                    name: 'sync/resource-requested',
                    data: {resourceId},
                  })
                }
              />
              {status === 'disconnected' && (
                <ActionMenuItem
                  icon={Lucide.Link}
                  label="Reconnect"
                  onClick={() => onReconnect?.()}
                />
              )}
              {status === 'healthy' && labels.includes('sandbox') && (
                <ActionMenuItem
                  icon={Lucide.Unlink}
                  label="Simulate disconnect"
                  onClick={() => props.onSandboxSimulateDisconnect?.()}
                />
              )}
              <ActionMenuItem
                icon={DeleteIcon}
                label="Delete"
                onClick={() => {
                  // a work around to address error:
                  //   react-remove-scroll-bar cannot calculate scrollbar size
                  //   because it is removed (overflow:hidden on body)
                  //
                  // because the dropdown modal was open (setting overflow:hidden)
                  // and the dialog modal tries to open. there might be a better
                  // way to handle this.
                  setTimeout(() => setDeleteDialogOpen(true), 0)
                }}
              />
            </ActionMenu>

            {/* Needs to keep Dialog root outside ActionMenu otherwise it won't open */}
            <DialogPrimitive.Root
              open={isDeleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}>
              <DeleteConnectionDialog
                isConnectionDeleting={
                  deleteAssociatedData.isLoading || deleteResource.isLoading
                }
                institution={institution}
                name={displayName}
                onCancel={() => setDeleteDialogOpen(false)}
                onDeletionConfirmed={(opts) => {
                  if (opts?.deleteAssociatedData) {
                    deleteAssociatedData.mutate(undefined, {
                      onSuccess: () =>
                        deleteResource.mutate([{id: resourceId}, {}]),
                    })
                  } else {
                    deleteResource.mutate([{id: resourceId}, {}])
                  }
                }}
              />
            </DialogPrimitive.Root>
          </div>
          <div className="flex flex-row">
            <div className="self-end">
              {labels.map((l) => (
                <span className="text-sm font-medium text-venice-gray" key={l}>
                  {l}
                </span>
              ))}
            </div>
            <div className="ml-auto text-right">
              {status ? <ConnectionStatus status={status} /> : null}
              <p className="text-sm font-medium text-venice-gray">
                {syncInProgress ? (
                  <Loading text="Syncing" />
                ) : lastSyncCompletedAt ? (
                  `Synced ${formatDistanceToNowStrict(
                    new Date(lastSyncCompletedAt),
                    {addSuffix: true},
                  )}`
                ) : (
                  'No sync information'
                )}
              </p>
            </div>
          </div>
        </div>
      </ResourceCard>
    )
  },
)

function ConnectionStatus({status}: {status: ConnectionStatus}) {
  const {color, text} =
    status === 'disconnected'
      ? {color: 'text-venice-red', text: 'Disconnected'}
      : {color: 'text-venice-green', text: 'Connected'}

  return (
    <p className={clsx('inline-flex items-center gap-1', color)}>
      <CircleFilledIcon className="h-2 w-2 fill-current" />
      <span className="inline-flex text-sm">{text}</span>
    </p>
  )
}
