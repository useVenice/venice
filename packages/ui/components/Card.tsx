import type {HTMLAttributes} from 'react'
import {twMerge} from 'tailwind-merge'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  // tailwind bg- classname
  bgColor?: string
}

export function Card(props: CardProps) {
  const {bgColor = 'bg-venice-black-500', className, children, ...rest} = props
  const mergedClassName = twMerge(
    'overflow-hidden rounded-lg',
    // need to use ring inset instead of border to allow decorative element
    // (like the ResourceCard's Tag) to cover it
    'ring-1 ring-inset ring-venice-black-300',
    bgColor,
    className,
  )
  return (
    <div className={mergedClassName} {...rest}>
      {children}
    </div>
  )
}
