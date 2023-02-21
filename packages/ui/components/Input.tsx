import type {ComponentPropsWithoutRef} from 'react'
import {forwardRef} from 'react'
import {twMerge} from 'tailwind-merge'
import useConstant from '../hooks/useConstant'
import {ExclamationCircleIcon} from '../icons'
import {Label} from './Label'

type InputProps = {
  label?: string
  errorMessage?: string
} & ComponentPropsWithoutRef<'input'>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref,
) {
  const defaultId = useConstant(() => `input-${Math.random()}`)
  const {id = defaultId, label, className, errorMessage, ...inputProps} = props
  return (
    <div className="grid w-full gap-1">
      {label && <Label htmlFor={id}>{label}</Label>}
      <input
        {...inputProps}
        id={id}
        className={twMerge(
          'h-8 rounded-lg px-2 font-mono text-xs text-venice-gray/75 ring-1 ring-inset focus:outline-none',
          errorMessage
            ? 'bg-venice-red/30 ring-venice-red'
            : 'bg-venice-black-400 ring-venice-black-300',
          className,
        )}
        ref={ref}
      />
      {errorMessage ? (
        <div className="flex gap-1.5 text-sm text-venice-red">
          <div className="mt-0.5">
            <ExclamationCircleIcon className="h-3.5 w-3.5 fill-current" />
          </div>
          {errorMessage}
        </div>
      ) : null}
    </div>
  )
})
