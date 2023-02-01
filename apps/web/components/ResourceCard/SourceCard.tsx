import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import {formatDistanceToNow} from 'date-fns'
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
  // id: number
  // customization: {name?: string}
  // institution: {
  //   name: string
  //   logoUrl: string
  // }
  // connectionStatus: 'connected' | 'disconnected'
  // lastSynced: number
  // id: string
  displayName: string
  institution?: {
    name: string
    logoUrl?: string
  }
  lastSyncCompletedAt?: string
  // TODO where to get the type
  status?: 'error' | 'healthy' | 'disconnected' | 'manual'
}

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
  console.log('\n\n\n')
  console.log(props)
  console.log('\n\n\n')
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
            <span>No institution - TODO</span>
          )}
          <span className="text-sm uppercase">{displayName}</span>
          <ActionMenu />
        </div>
        <div className="text-right">
          {status ? (
            <ConnectionStatus status={status} />
          ) : (
            <p>Status unknown TODO</p>
          )}
          <p className="text-xs text-venice-gray">
            Synced{' '}
            {lastSyncCompletedAt
              ? formatDistanceToNow(new Date(lastSyncCompletedAt), {
                  addSuffix: true,
                })
              : 'unknown'}
          </p>
        </div>
      </div>
    </ResourceCard>
  )
}

function ActionMenu() {
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

function ConnectionStatus({
  status,
}: {
  status: 'error' | 'healthy' | 'disconnected' | 'manual'
}) {
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
