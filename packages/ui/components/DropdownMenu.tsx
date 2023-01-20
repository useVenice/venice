import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import React from 'react'
import {twMerge} from 'tailwind-merge'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuItem = DropdownMenuPrimitive.Item

export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Content
  > {}

export function DropdownMenuContent({
  className,
  ...restProps
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={6}
        className={twMerge('flex flex-col rounded-lg p-1', className)}
        {...restProps}
      />
    </DropdownMenuPrimitive.Portal>
  )
}
