'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import {titleCase} from '@usevenice/util'
import {Check} from 'lucide-react'
import * as React from 'react'
import {twMerge} from 'tailwind-merge'
import {useConstant} from '../hooks'

import {cn} from '../utils'
import {Label} from './Label'

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({className, ...props}, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-6 w-6 shrink-0 rounded-md bg-venice-black-500 ring-1 ring-inset ring-venice-black-300 focus:outline-none focus:ring-venice-green disabled:cursor-default disabled:opacity-50',
      className,
    )}
    {...props}>
    <CheckboxPrimitive.Indicator
      className={cn('flex h-6 w-6 items-center justify-center')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// MARK: - Checkbox group

export interface CheckboxGroupProps {
  label: string
  orientation?: 'vertical' | 'horizontal'
  className?: string
  children?: React.ReactNode
}

export function CheckboxGroup({
  label,
  orientation = 'vertical',
  className,
  children,
  ...restProps
}: CheckboxGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div
        className={twMerge(
          'flex',
          {
            vertical: 'flex-col space-y-3',
            horizontal: 'flex-row items-center space-x-3',
          }[orientation],
          className,
        )}
        {...restProps}>
        {children}
      </div>
    </div>
  )
}

export interface CheckboxGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  value: string
  id?: string
  label?: string
}

export function CheckboxGroupItem({
  value,
  id: _id,
  label = titleCase(value),
  ...restProps
}: CheckboxGroupItemProps) {
  const defaultId = useConstant(() => `checkbox-${Math.random()}`)
  const id = _id ?? defaultId
  return (
    <div className="flex items-center justify-center space-x-2">
      <Checkbox {...restProps} id={id} />
      <label
        htmlFor={id}
        className="mt-2 h-6 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    </div>
  )
}
