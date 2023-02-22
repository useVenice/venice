import {Slot} from '@radix-ui/react-slot'
import {forwardRef} from 'react'
import {twMerge} from 'tailwind-merge'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  variant?: keyof typeof variants
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {asChild, className, variant = 'default', ...buttonProps} = props
    const Component = asChild ? Slot : 'button'
    return (
      <Component
        className={twMerge(
          'inline-flex h-8 select-none items-center justify-center rounded-lg px-4 text-sm transition-colors',
          'drop-shadow-sm hover:drop-shadow focus:outline-none disabled:pointer-events-none disabled:opacity-70 disabled:drop-shadow-none',
          variants[variant],
          className,
        )}
        ref={ref}
        {...buttonProps}
      />
    )
  },
)

const variants = {
  default:
    'bg-venice-black-500 text-white hover:bg-venice-black-400 ring-1 ring-inset ring-venice-black-300 focus-visible:ring-venice-green',
  primary:
    'bg-venice-green-btn text-white hover:bg-venice-green focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-offwhite/70',
}
