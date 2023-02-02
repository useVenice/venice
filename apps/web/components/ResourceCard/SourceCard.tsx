import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import {formatDistanceToNowStrict} from 'date-fns'
import Image from 'next/image'
import type {ComponentType} from 'react'
import type {SvgIconProps} from '../icons'
import {
  CircleFilledIcon,
  DeleteIcon,
  EditIcon,
  MoreIcon,
  SyncIcon,
} from '../icons'
import {ResourceCard} from './ResourceCard'

export interface SourceCardProps {
  displayName: string
  institution?: {
    name: string
    logoUrl?: string
  }
  lastSyncCompletedAt?: string | null
  status?: ConnectionStatus | null
}

type ConnectionStatus = 'error' | 'healthy' | 'disconnected' | 'manual'

// displayName : "Postgres"
// envName : null
// externalId : "<string>"
// id : "<string>"
// lastSyncCompletedAt : "2023-01-29T11:14:04.171Z"
// status : "healthy"
// syncInProgress : true

// institution? : {
//   id : "ins_plaid_ins_13"
//   loginUrl: "https://www.pnc.com"
//   logoUrl: "data:image/png;base64,..."
//   name : "PNC"
// }

export function SourceCard(props: SourceCardProps) {
  const {displayName, institution, lastSyncCompletedAt, status} = props
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
          <span className="text-sm uppercase">{displayName}</span>
          <ActionMenu />
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

function ActionMenu(props: {disabled?: boolean}) {
  if (props.disabled) {
    return (
      <button className="pointer-events-none rounded-full p-1">
        <MoreIcon className="h-3.5 w-3.5 fill-current text-venice-gray-muted" />
      </button>
    )
  }
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
            <ActionMenuItem icon={EditIcon} label="Rename" />
            <ActionMenuItem icon={SyncIcon} label="Sync" />
            <ActionMenuItem icon={DeleteIcon} label="Delete" />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

interface ActionMenuItemProps {
  icon: ComponentType<SvgIconProps>
  label: string
}

function ActionMenuItem(props: ActionMenuItemProps) {
  const {icon: Icon, label} = props
  return (
    <DropdownMenu.Item className="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-2 rounded-lg px-2 py-1.5 text-offwhite hover:bg-venice-black/75 focus:outline-none focus-visible:bg-venice-black/75">
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
          <ActionMenu disabled />
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
