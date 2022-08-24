import {styled} from '../stitches.config'

export const Flex = styled('div', {
  display: 'flex',
  variants: {
    justify: {
      start: {justifyContent: 'flex-start'},
      center: {justifyContent: 'center'},
      end: {justifyContent: 'flex-end'},
      between: {justifyContent: 'space-between'},
    },
    align: {
      start: {alignItems: 'flex-start'},
      center: {alignItems: 'center'},
      end: {alignItems: 'flex-end'},
    },
    direction: {
      column: {
        flexDirection: 'column',
      },
      row: {
        flexDirection: 'row',
      },
      'row-reverse': {
        flexDirection: 'row-reverse',
      },
      'column-reverse': {
        flexDirection: 'column-reverse',
      },
    },
  },
  defaultVariants: {
    direction: 'row',
  },
})
