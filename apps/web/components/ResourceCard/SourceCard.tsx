import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {VeniceProvider} from '@usevenice/engine-frontend'
import clsx from 'clsx'
import {formatDistanceToNowStrict} from 'date-fns'
import Image from 'next/image'
import type {ComponentType, PropsWithChildren} from 'react'
import {useEffect, useState} from 'react'
import {browserSupabase} from '../../contexts/common-contexts'
import {mutations} from '../../lib/supabase-queries'
import type {SvgIconProps} from '../icons'
import {
  CircleFilledIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  MoreIcon,
  SyncIcon,
} from '../icons'
import {ResourceCard} from './ResourceCard'

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

  // action.rename
  const [isRenaming, setIsRenaming] = useState(false)

  // action.sync
  const {trpc} = VeniceProvider.useContext()
  const dispatch = trpc.dispatch.useMutation()

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
              // TODO: open delete confirmation modal
              onClick={async () => {
                const result = await browserSupabase
                  .from('pipelines')
                  .delete()
                  .eq('id', id)

                console.log(result)
              }}
            />
          </ActionMenu>
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

function ActionMenu(props: PropsWithChildren<{}>) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="rounded-full p-1 hover:bg-venice-black/75 focus:outline-none focus-visible:bg-venice-black/75">
          <MoreIcon className="h-3.5 w-3.5 fill-current text-venice-gray" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          align="start"
          className="min-w-[8rem]">
          <div className="rounded-lg border border-venice-black-300 bg-venice-black-500 px-1 py-2 text-sm">
            {props.children}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

interface ActionMenuItemProps {
  icon: ComponentType<SvgIconProps>
  label: string
  onClick?: () => void
}

function ActionMenuItem(props: ActionMenuItemProps) {
  const {icon: Icon, label, onClick} = props
  return (
    <DropdownMenu.Item
      className="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-2 rounded-lg px-2 py-1.5 text-offwhite hover:bg-venice-black/75 focus:outline-none focus-visible:bg-venice-black/75"
      onClick={onClick}>
      <Icon className="h-3 w-3 fill-current" />
      <span>{label}</span>
    </DropdownMenu.Item>
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

export function SourceCardSkeleton() {
  return (
    <ResourceCard tagColor="venice-gray">
      <div className="flex grow flex-col justify-between py-2 px-3">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-venice-gray-muted" />
          <div className="h-4 w-[6rem] rounded bg-venice-gray-muted" />
          <DisabledActionMenu />
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="inline-flex items-center gap-1">
            <CircleFilledIcon className="h-2 w-2 fill-current text-venice-gray-muted" />
            <span className="flex h-2 w-[4rem] rounded-sm bg-venice-gray-muted" />
          </p>
          <div className="inline-flex h-2 w-[7rem] rounded-sm bg-venice-gray-muted" />
        </div>
      </div>
    </ResourceCard>
  )
}

function DisabledActionMenu() {
  return (
    <button className="pointer-events-none rounded-full p-1">
      <MoreIcon className="h-3.5 w-3.5 fill-current text-venice-gray-muted" />
    </button>
  )
}
