import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import {titleCase} from '@usevenice/util'
import React from 'react'
import {twMerge} from 'tailwind-merge'
import {useConstant} from '../hooks'
import {Label} from './Label'

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  label: string
  orientation?: 'vertical' | 'horizontal'
}

export function RadioGroup({
  label,
  orientation = 'vertical',
  className,
  children,
  ...restProps
}: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <RadioGroupPrimitive.Root
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
      </RadioGroupPrimitive.Root>
    </div>
  )
}

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  id?: string
  label?: string
}

export function RadioGroupItem({
  value,
  id: _id,
  label = titleCase(value),
  className,
  ...restProps
}: RadioGroupItemProps) {
  const defaultId = useConstant(() => `radio-${Math.random()}`)
  const id = _id ?? defaultId
  return (
    <div className="flex flex-row items-center space-x-2">
      <RadioGroupPrimitive.Item
        {...restProps}
        value={value}
        id={id}
        className={twMerge(
          'relative h-4 w-4 rounded-full border border-transparent text-white',
          'radix-state-checked:bg-secondary radix-state-unchecked:bg-offwhite',
          'ring-0 ring-primary/75 focus:outline-none focus:ring-offset-0 focus-visible:ring focus-visible:ring-offset-2',
          className,
        )}>
        <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center leading-none">
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>

      <label htmlFor={id} className="text-sm">
        {label}
      </label>
    </div>
  )
}
