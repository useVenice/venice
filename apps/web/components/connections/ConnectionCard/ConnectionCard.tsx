import {VeniceProvider} from '@usevenice/engine-frontend'
import {DialogPrimitive as Dialog, Loading} from '@usevenice/ui'
import {
  CircleFilledIcon,
  DeleteIcon,
  EditIcon,
  SyncIcon,
} from '@usevenice/ui/icons'
import clsx from 'clsx'
import {formatDistanceToNowStrict} from 'date-fns'
import Image from 'next/image'
import {forwardRef, useState} from 'react'
import type {Connection} from '../../../lib/supabase-queries'
import {ResourceCard} from '../../ResourceCard'
import {ActionMenu, ActionMenuItem} from './ActionMenu'
import {DeleteConnectionDialog} from './DeleteConnectionDialog'
import {EditingDisplayName} from './EditingDisplayName'

export interface ConnectionCardProps {
  connection: Connection
}

type ConnectionStatus = Connection['resource']['status']

export const ConnectionCard = forwardRef<HTMLDivElement, ConnectionCardProps>(
  function ConnectionCard(props, ref) {
    const {
      id,
      resource: {id: resourceId, displayName, institution, status},
      lastSyncCompletedAt,
      syncInProgress,
    } = props.connection

    // action.rename
    const [isRenaming, setIsRenaming] = useState(false)

    // action.sync
    const {trpc} = VeniceProvider.useContext()
    const dispatch = trpc.dispatch.useMutation()

    // action.delete
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)

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
                    name: 'pipeline/sync-requested',
                    data: {pipelineId: id},
                  })
                }
              />
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
            <Dialog.Root
              open={isDeleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}>
              <DeleteConnectionDialog
                pipelineId={id}
                resourceId={resourceId}
                name={displayName}
                institution={institution}
                onCancel={() => setDeleteDialogOpen(false)}
              />
            </Dialog.Root>
          </div>
          <div className="text-right">
            {status ? <ConnectionStatus status={status} /> : null}
            <p className="text-xs font-medium text-venice-gray">
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
      <span className="inline-flex text-xs">{text}</span>
    </p>
  )
}
