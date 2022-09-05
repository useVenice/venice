import * as TabsPrimitive from '@radix-ui/react-tabs'
import React from 'react'
import {twMerge} from 'tailwind-merge'

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {}

export function Tabs({className, children, ...restProps}: TabsProps) {
  return (
    <TabsPrimitive.Root
      {...restProps}
      className={twMerge('flex flex-col flex-1 overflow-y-hidden', className)}>
      {children}
    </TabsPrimitive.Root>
  )
}

export interface TabListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {}

export function TabList({className, children}: TabListProps) {
  return (
    <TabsPrimitive.List className={twMerge('flex flex-row', className)}>
      {children}
    </TabsPrimitive.List>
  )
}

export interface TabProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  children: string
}

export function Tab({className, children, ...restProps}: TabProps) {
  return (
    <TabsPrimitive.Trigger
      {...restProps}
      className={twMerge(
        'flex-1 px-3 py-2 text-gray-500 border-b-4 border-transparent',
        'radix-state-active:(text-primary border-primary)',
        className,
      )}>
      <span className="text-sm font-medium">{children}</span>
    </TabsPrimitive.Trigger>
  )
}

export interface TabContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {}

export function TabContent({children, ...restProps}: TabContentProps) {
  return (
    <TabsPrimitive.Content {...restProps}>{children}</TabsPrimitive.Content>
  )
}
