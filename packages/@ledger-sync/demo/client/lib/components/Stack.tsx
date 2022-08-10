import React from 'react'
import {CSS} from '../stitches.config'
import {Flex} from './Flex'
import {Polymorphic} from './Polymorphic'

export const HStack = React.forwardRef(function HStack(
  {
    direction = 'row',
    ...restProps
  }: Polymorphic.PropsWithoutRef<'div', StackProps>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return <Stack {...restProps} ref={ref} direction={direction} />
})

export const VStack = React.forwardRef(function VStack(
  {
    direction = 'column',
    ...restProps
  }: Polymorphic.PropsWithoutRef<'div', StackProps>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return <Stack {...restProps} ref={ref} direction={direction} />
})

export interface StackProps extends React.ComponentProps<typeof Flex> {
  gap?: 'none' | 'sm' | 'md' | 'lg'
}

export const Stack = React.forwardRef(function Stack(
  {
    direction = 'row',
    gap = 'none',
    css,
    ...restProps
  }: Polymorphic.PropsWithoutRef<'div', StackProps>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const gapValue = {
    none: 0,
    sm: '$space$2',
    md: '$space$4',
    lg: '$space$6',
  }[gap]
  return (
    <Flex
      {...restProps}
      ref={ref}
      direction={direction}
      css={{
        ...css,
        [childWithGap]: {
          ...(css?.[childWithGap] as CSS | undefined),
          ...(direction === 'row' && {
            margin: `0 0 0 ${gapValue}`,
          }),
          ...(direction === 'row-reverse' && {
            margin: `0 ${gapValue} 0 0`,
          }),
          ...(direction === 'column' && {
            margin: `${gapValue} 0 0 0`,
          }),
          ...(direction === 'column-reverse' && {
            margin: `0 0 ${gapValue} 0`,
          }),
        },
      }}
    />
  )
})

const childWithGap = '> * + *'
