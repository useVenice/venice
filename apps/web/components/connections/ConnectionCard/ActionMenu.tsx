import {DropdownMenuPrimitive as DropdownMenu} from '@usevenice/ui'
import type {ComponentType, PropsWithChildren} from 'react'
import type {SvgIconProps} from '../../icons'
import {MoreIcon} from '../../icons'

type ActionMenuProps = PropsWithChildren<{}>

export function ActionMenu(props: ActionMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="rounded-full p-1 hover:bg-venice-black/75 focus:outline-none focus-visible:bg-venice-black/75 data-[state=open]:bg-venice-black/75">
          <MoreIcon className="h-3.5 w-3.5 fill-current text-venice-gray" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          align="start"
          className="min-w-[8rem] animate-slide-down rounded-lg border border-venice-black-300 bg-venice-black-500 px-1 py-2 text-sm drop-shadow-md">
          {props.children}
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

export function ActionMenuItem(props: ActionMenuItemProps) {
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
