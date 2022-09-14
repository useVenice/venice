import {Slot} from '@radix-ui/react-slot'
import {twMerge} from 'tailwind-merge'

export interface ContainerProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean
}

export function Container({asChild, className, ...restProps}: ContainerProps) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      className={twMerge(
        'mx-auto flex max-w-screen-2xl flex-col px-4 py-8 sm:max-w-screen-2xl md:max-w-screen-2xl md:px-8 lg:max-w-screen-2xl',
        className,
      )}
      {...restProps}
    />
  )
}
