import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import React from 'react'
import {tw} from 'twind'

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
    <div className={tw`flex flex-col space-y-2`}>
      <legend className={tw`text-sm font-medium leading-4 text-gray-500`}>
        {label}
      </legend>

      <RadioGroupPrimitive.Root
        className={tw(
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

export interface RadioProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  id: string
  label: string
}

export function Radio({id, label, className, ...restProps}: RadioProps) {
  return (
    <div className={tw`flex flex-row items-center space-x-2`}>
      <RadioGroupPrimitive.Item
        {...restProps}
        id={id}
        className={tw(
          'relative w-4 h-4 rounded-full border border-transparent text-white',
          'radix-state-checked:bg-primary radix-state-unchecked:bg-gray-100',
          'focus:(outline-none ring-0 ring-offset-0) focus-visible:(ring ring-purple-500 ring-opacity-75 ring-offset-2)',
          className,
        )}>
        <RadioGroupPrimitive.Indicator
          className={tw`absolute inset-0 flex items-center justify-center leading-none`}>
          <div className={tw`w-1.5 h-1.5 rounded-full bg-white`} />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>

      <label htmlFor={id} className={tw`text-sm text-gray-500`}>
        {label}
      </label>
    </div>
  )
}
