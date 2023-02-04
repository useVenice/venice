import type {ZStandard} from '@usevenice/cdk-core'
import {VeniceProvider} from '@usevenice/engine-frontend'
import {DialogPrimitive as Dialog} from '@usevenice/ui'
import clsx from 'clsx'
import {formatDistanceToNowStrict} from 'date-fns'
import Image from 'next/image'
import {useEffect, useState} from 'react'
import {browserSupabase} from '../../../contexts/common-contexts'
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

export interface ConnectionCardProps {
  connection: Connection
}

type ConnectionStatus = Connection['resource']['status']

export function ConnectionCard(props: ConnectionCardProps) {
  const {
    id,
    resource: {displayName, institution, status},
    lastSyncCompletedAt,
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
              resourceId={id}
              displayName={displayName ?? ''}
              onCancel={() => setIsRenaming(false)}
              onUpdateSuccess={() => setIsRenaming(false)}
            />
          ) : (
            <span className="truncate text-sm font-medium uppercase">
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
                  name: 'resource/sync-requested',
                  data: {resourceId: id},
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
            <DeleteSourceDialog
              resourceId={id}
              name={displayName}
              institution={institution}
              onCancel={() => setDeleteDialogOpen(false)}
            />
          </Dialog.Root>
        </div>
        <div className="text-right">
          {status ? <ConnectionStatus status={status} /> : null}
          <p className="text-xs font-medium text-venice-gray">
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
          // TODO show loading state on mutation.isLoading
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

interface DeleteSourceDialogProps {
  institution?: ZStandard['institution'] | null
  name?: Connection['resource']['displayName']
  onCancel: () => void
  resourceId: string
}

function DeleteSourceDialog(props: DeleteSourceDialogProps) {
  const {institution, name, onCancel, resourceId} = props
  return (
    <Dialog.Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity will-change-auto animate-in fade-in" />
        <Dialog.Content className="fixed z-50 grid w-full gap-4 border border-venice-black-300 bg-venice-black-500 p-6 opacity-100 animate-in fade-in-70 focus:outline-none focus:ring-venice-black-300 sm:min-w-[35rem] sm:max-w-lg sm:rounded-lg">
          <div className="mt-2 mb-3 flex items-center justify-center gap-2">
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
            <span className="text-sm uppercase">{name}</span>
          </div>
          <Dialog.Title className="text-center text-venice-green">
            Are you sure you want to delete this connection?
          </Dialog.Title>
          <div className="mx-auto max-w-[20rem] text-sm text-venice-gray">
            <p className="pb-1">Deleting {name} will:</p>
            <ul className="list-disc pl-4">
              <li>stop syncing its data into Venice keep</li>
              <li>all previously synced data safely in Venice</li>
              <li>delete this connection with {name}</li>
            </ul>
          </div>
          <div className="mt-12 flex justify-center gap-4">
            <button
              onClick={onCancel}
              className="min-w-[6rem] rounded-lg px-3 py-2 text-sm text-offwhite ring-1 ring-inset ring-venice-black-400 transition-colors hover:bg-venice-black-400 focus:outline-none focus-visible:bg-venice-black-400">
              Cancel
            </button>
            <button
              onClick={async () => {
                const result = await browserSupabase
                  .from('pipelines')
                  .delete()
                  .eq('id', resourceId)

                console.log(result)
              }}
              className="flex min-w-[6rem] items-center gap-2 rounded-lg bg-venice-red px-3 py-2 text-sm text-offwhite hover:bg-[#ac2039] focus:outline-none focus-visible:bg-[#ac2039]">
              <DeleteIcon className="h-4 w-4 fill-current" />
              <span>Delete</span>
            </button>
          </div>
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  )
}
