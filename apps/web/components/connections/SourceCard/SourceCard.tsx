import {DialogPrimitive as Dialog} from '@usevenice/ui'
import {VeniceProvider} from '@usevenice/engine-frontend'
import clsx from 'clsx'
import {formatDistanceToNowStrict} from 'date-fns'
import Image from 'next/image'
import {useEffect, useState} from 'react'
import {browserSupabase} from '../../../contexts/common-contexts'
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
import {AddSourceDialog} from '../AddSourceDialog'

export interface SourceCardProps {
  id: string
  displayName: string
  institution?: {
    name?: string
    logoUrl?: string
  }
  lastSyncCompletedAt?: string | null
  status?: ConnectionStatus | null
}

type ConnectionStatus = 'error' | 'healthy' | 'disconnected' | 'manual'

export function SourceCard(props: SourceCardProps) {
  const {id, displayName, institution, lastSyncCompletedAt, status} = props
  const [isActionMenuOpen, setActionMenuOpen] = useState(false)

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
              resourceId={id}
              displayName={displayName}
              onCancel={() => setIsRenaming(false)}
              onUpdateSuccess={() => setIsRenaming(false)}
            />
          ) : (
            <span className="text-sm uppercase">{displayName}</span>
          )}

          <ActionMenu
            isOpen={isActionMenuOpen}
            onOpenChange={setActionMenuOpen}>
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
                  name: 'resource/sync-requested',
                  data: {resourceId: id},
                })
              }
            />
            <ActionMenuItem
              icon={DeleteIcon}
              label="Delete"
              onClick={() => {
                // need to close dropdown menu first
                setActionMenuOpen(false)
                setTimeout(() => setDeleteDialogOpen(true), 0)
              }}
              // TODO: open delete confirmation modal
              // onClick={async () => {
              //   const result = await browserSupabase
              //     .from('pipelines')
              //     .delete()
              //     .eq('id', id)

              //   console.log(result)
              // }}
            />
          </ActionMenu>

          {/* Needs to keep Dialog root outside ActionMenu otherwise it won't open */}
          <Dialog.Root
            open={isDeleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}>
            <DeleteSourceDialog />
          </Dialog.Root>
        </div>
        <div className="text-right">
          {status ? <ConnectionStatus status={status} /> : null}
          <p className="text-xs text-venice-gray">
            {lastSyncCompletedAt
              ? `Synced ${formatDistanceToNowStrict(
                  new Date(lastSyncCompletedAt),
                  {addSuffix: true},
                )}`
              : 'No sync information'}
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
  resourceId: string
}

function EditingDisplayName(props: EditingDisplayNameProps) {
  const {onCancel, onUpdateSuccess, resourceId} = props
  const [displayName, setDisplayName] = useState(props.displayName)
  const updateResource = mutations.useUpdateResource()

  useEffect(() => {
    async function handleKeyUp(event: KeyboardEvent) {
      switch (event.key) {
        case 'Escape':
          onCancel()
          break
        case 'Enter':
          await updateResource.mutateAsync({
            // @ts-expect-error fix query or mutation type
            id: resourceId,
            display_name: displayName,
          })
          onUpdateSuccess()
          break
      }
    }

    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [displayName, onCancel, onUpdateSuccess, resourceId, updateResource])

  return (
    <div className="relative flex grow items-center gap-2 rounded bg-venice-black px-2 py-1">
      <input
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

function DeleteSourceDialog() {
  return (
    <Dialog.Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity will-change-auto animate-in fade-in" />
        <Dialog.Content className="fixed z-50 grid w-full gap-4 bg-venice-black-500 p-6 opacity-100 animate-in fade-in-70 focus:outline-none focus:ring-venice-black-300 sm:max-w-lg sm:rounded-lg">
          <Dialog.Title>
            Are you sure you want to delete this connection?
          </Dialog.Title>
          <Dialog.Description>
            Deleting Wells Fargo will: stop syncing its data into Venice keep
            all previously synced data safely in Venice delete this connection
            with Wells Fargo
          </Dialog.Description>
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  )
}
