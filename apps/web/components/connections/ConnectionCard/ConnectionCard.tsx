import type {Id} from '@usevenice/cdk-core'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {DialogPrimitive as Dialog, Loading} from '@usevenice/ui'
import clsx from 'clsx'
import {formatDistanceToNowStrict} from 'date-fns'
import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'
import type {Connection} from '../../../lib/supabase-queries'
import {mutations} from '../../../lib/supabase-queries'
import {
  CircleFilledIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  SyncIcon,
} from '../../icons'
import {ResourceCard} from '../../ResourceCard'
import {ActionMenu, ActionMenuItem} from './ActionMenu'
import {DeleteConnectionDialog} from './DeleteConnectionDialog'

export interface ConnectionCardProps {
  connection: Connection
}

type ConnectionStatus = Connection['resource']['status']

export function ConnectionCard(props: ConnectionCardProps) {
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
      <div className="flex grow flex-col justify-between py-2 px-3">
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
}

interface EditingDisplayNameProps {
  displayName: string
  onCancel: () => void
  onUpdateSuccess: () => void
  resourceId: Id['reso']
}

function EditingDisplayName(props: EditingDisplayNameProps) {
  const {onCancel, onUpdateSuccess, resourceId} = props
  const [displayName, setDisplayName] = useState(props.displayName)
  const updateResource = mutations.useUpdateResource()

  useEffect(() => {
    async function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case 'Escape':
          onCancel()
          break
        case 'Enter':
          // TODO show loading state on mutation.isLoading
          await updateResource.mutateAsync({
            id: resourceId,
            display_name: displayName,
          })
          onUpdateSuccess()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [displayName, onCancel, onUpdateSuccess, resourceId, updateResource])

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    // HACK: don't know why but doing it sync or with 0 timeout doesn't work
    // using autoFocus props on input also doesn't work. It might have
    // something to do with radix dropdown focus management.
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [inputRef])

  return (
    <div className="relative flex grow items-center gap-2 rounded bg-venice-black px-2 py-1 focus-within:ring-1 focus-within:ring-inset focus-within:ring-venice-green">
      <input
        ref={inputRef}
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        className="grow appearance-none bg-transparent text-sm text-offwhite focus:outline-none"
      />
      <button
        className="h-4 w-4 shrink-0 rounded-full fill-current p-1 text-white hover:bg-offwhite/20 focus:outline-none focus-visible:bg-offwhite/20"
        onClick={onCancel}>
        <CloseIcon />
      </button>
    </div>
  )
}

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
