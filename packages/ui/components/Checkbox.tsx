'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import {titleCase} from '@usevenice/util'
import {LucideCheck} from 'lucide-react'
import * as React from 'react'
import {twMerge} from 'tailwind-merge'

import {cn} from '../utils'

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({className, ...props}, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900',
      className,
    )}
    {...props}>
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center')}>
      <LucideCheck className="h-4 w-4" />
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
    <div className="form-control">
      <legend className="label">
        <span className="label-text">{label}</span>
      </legend>

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
  id = `radio-group-item-${value}`,
  label = titleCase(value),
  ...restProps
}: CheckboxGroupItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox {...restProps} id={id} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    </div>
  )
}
