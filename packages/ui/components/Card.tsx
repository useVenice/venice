import {twMerge} from 'tailwind-merge'
import type {PropsWithChildren} from 'react'

export type CardProps = PropsWithChildren<{
  // tailwind bg- classname
  bgColor?: string
}>

export function Card(props: CardProps) {
  const {bgColor = 'bg-venice-black-500', children} = props
  return (
    <div
      className={twMerge(
        'overflow-hidden rounded-lg',
        // need to use ring inset instead of border to allow decorative element
        // (like the ResourceCard's Tag) to cover it
        'ring-1 ring-inset ring-venice-black-300',
        bgColor,
      )}>
      {children}
    </div>
  )
}
