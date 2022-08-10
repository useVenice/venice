import * as React from 'react'
import {config, styled} from '../stitches.config'
import type {Polymorphic} from './Polymorphic'

export type TextSize = keyof typeof config['theme']['fontSizes']

export const Text = React.forwardRef(function Text(
  {
    size = 'md',
    ...restProps
  }: Polymorphic.PropsWithoutRef<
    'p',
    React.ComponentProps<typeof StyledParagraph>
  >,
  ref: React.ForwardedRef<HTMLParagraphElement>,
) {
  return <StyledParagraph {...restProps} ref={ref} size={size} />
})

const StyledParagraph = styled('p', {
  color: '$gray12',
  fontFamily: '$body',
  variants: {
    size: {
      xs: {
        fontSize: '$xs',
        fontWeight: '$normal',
        lineHeight: '1rem',
      },
      sm: {
        fontSize: '$sm',
        fontWeight: '$normal',
        lineHeight: '1.25rem',
      },
      md: {
        fontSize: '$md',
        fontWeight: '$normal',
        lineHeight: '1.5rem',
      },
      lg: {
        fontSize: '$lg',
        fontWeight: '$normal',
        lineHeight: '1.75rem',
      },
      xl: {
        fontSize: '$xl',
        fontWeight: '$bold',
        lineHeight: '1.75rem',
      },
      '2xl': {
        fontSize: '$2xl',
        fontWeight: '$bold',
        lineHeight: '2rem',
      },
      '3xl': {
        fontSize: '$3xl',
        fontWeight: '$bold',
        lineHeight: '2.25rem',
      },
      '4xl': {
        fontSize: '$4xl',
        fontWeight: '$bold',
        lineHeight: '2.5rem',
      },
      '5xl': {
        fontSize: '$5xl',
        fontWeight: '$bold',
        lineHeight: '1',
      },
      '6xl': {
        fontSize: '$6xl',
        fontWeight: '$bold',
        lineHeight: '1',
      },
      '7xl': {
        fontSize: '$7xl',
        fontWeight: '$bold',
        lineHeight: '1',
      },
      '8xl': {
        fontSize: '$8xl',
        fontWeight: '$bold',
        lineHeight: '1',
      },
      '9xl': {
        fontSize: '$9xl',
        fontWeight: '$bold',
        lineHeight: '1',
      },
    },
  },
})
