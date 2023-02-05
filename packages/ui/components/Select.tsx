import * as Radix from '@radix-ui/react-select'
import type {ElementRef, ReactNode} from 'react'
import {forwardRef} from 'react'
import {twMerge} from 'tailwind-merge'
import {CheckIcon, ChevronDownIcon} from '../icons'

export {Select, SelectGroup, SelectLabel} from '@radix-ui/react-select'

type TriggerRef = ElementRef<typeof Radix.SelectTrigger>
type TriggerProps = Radix.SelectTriggerProps & {
  placeholder?: ReactNode
}

export const SelectTrigger = forwardRef<TriggerRef, TriggerProps>(
  function SelectTrigger(props, ref) {
    const {children, className, placeholder, ...triggerProps} = props
    return (
      <Radix.SelectTrigger
        ref={ref}
        className={twMerge(
          'inline-flex h-8 w-full items-center justify-between gap-2 rounded-lg bg-venice-black-500 px-4 font-mono text-xs text-offwhite ring-1 ring-inset ring-venice-black-300 focus:outline-none focus-visible:ring-venice-green disabled:cursor-default disabled:opacity-50 data-[placeholder]:text-venice-gray-muted',
          className,
        )}
        {...triggerProps}>
        <Radix.SelectValue placeholder={placeholder} />
        <Radix.SelectIcon className="shrink-0">
          <ChevronDownIcon className="h-2.5 w-2.5 fill-current" />
        </Radix.SelectIcon>
      </Radix.SelectTrigger>
    )
  },
)

type ContentRef = ElementRef<typeof Radix.Content>
type ContentProps = Radix.SelectContentProps

// TODO use SelectScrollUpButton and SelectScrollDownButton
export const SelectContent = forwardRef<ContentRef, ContentProps>(
  function SelectContent(props, ref) {
    const {children, className, ...contentProps} = props
    return (
      <Radix.SelectPortal>
        <Radix.SelectContent
          ref={ref}
          className={twMerge(
            'min-w-[8rem] animate-slide-down overflow-hidden rounded-lg border border-venice-black-300 bg-venice-black-500 px-1 py-2 text-sm drop-shadow-md animate-in fade-in-80',
            className,
          )}
          {...contentProps}>
          <Radix.SelectViewport className="grid gap-1">
            {children}
          </Radix.SelectViewport>
        </Radix.SelectContent>
      </Radix.SelectPortal>
    )
  },
)

// TODO implements SelectLabel

type ItemRef = ElementRef<typeof Radix.SelectItem>
type ItemProps = Radix.SelectItemProps

export const SelectItem = forwardRef<ItemRef, ItemProps>(function SelectItem(
  props,
  ref,
) {
  const {children, className, ...itemProps} = props
  return (
    <Radix.SelectItem
      ref={ref}
      className={twMerge(
        'relative cursor-pointer rounded-lg px-2 py-1.5 font-mono text-xs text-offwhite hover:bg-venice-black/75 focus:outline-none focus-visible:bg-venice-black/75 data-[disabled]:pointer-events-none data-[hilighted]:bg-venice-black/75 data-[disabled]:opacity-50',
        className,
      )}
      {...itemProps}>
      <Radix.SelectItemText>{children}</Radix.SelectItemText>
      <Radix.SelectItemIndicator className="absolute inset-y-0 right-2 grid place-items-center">
        <CheckIcon className="h-4 w-4 fill-current" />
      </Radix.SelectItemIndicator>
    </Radix.SelectItem>
  )
})

type SeparatorRef = ElementRef<typeof Radix.SelectSeparator>
type SeparatorProps = Radix.SelectSeparatorProps

export const SelectSeparator = forwardRef<SeparatorRef, SeparatorProps>(
  function SelectSeparator(props, ref) {
    const {className, ...separatorProps} = props
    return (
      <Radix.SelectSeparator
        ref={ref}
        className={twMerge('h-px bg-venice-black-300', props.className)}
        {...separatorProps}
      />
    )
  },
)
