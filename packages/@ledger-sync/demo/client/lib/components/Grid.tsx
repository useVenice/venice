import {styled} from '../stitches.config'

export const Grid = styled('div', {
  boxSizing: 'border-box',
  display: 'grid',
  variants: {
    center: {
      true: {
        placeItems: 'center',
      },
    },
    align: {
      start: {
        alignItems: 'start',
      },
      center: {
        alignItems: 'center',
      },
      end: {
        alignItems: 'end',
      },
      stretch: {
        alignItems: 'stretch',
      },
      baseline: {
        alignItems: 'baseline',
      },
    },
    justify: {
      start: {
        justifyContent: 'start',
      },
      center: {
        justifyContent: 'center',
      },
      end: {
        justifyContent: 'end',
      },
      between: {
        justifyContent: 'space-between',
      },
    },
    flow: {
      row: {
        gridAutoFlow: 'row',
      },
      column: {
        gridAutoFlow: 'column',
      },
      dense: {
        gridAutoFlow: 'dense',
      },
      rowDense: {
        gridAutoFlow: 'row dense',
      },
      columnDense: {
        gridAutoFlow: 'column dense',
      },
    },
    columns: {
      1: {
        gridTemplateColumns: 'repeat(1, 1fr)',
      },
      2: {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
      3: {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },
      4: {
        gridTemplateColumns: 'repeat(4, 1fr)',
      },
    },
    gap: {
      none: {},
      sm: {
        gap: '$space$2',
      },
      md: {
        gap: '$space$4',
      },
      lg: {
        gap: '$space$6',
      },
    },
    gapX: {
      none: {},
      sm: {
        columnGap: '$space$2',
      },
      md: {
        columnGap: '$space$4',
      },
      lg: {
        columnGap: '$space$6',
      },
    },
    gapY: {
      none: {},
      sm: {
        rowGap: '$space$2',
      },
      md: {
        rowGap: '$space$4',
      },
      lg: {
        rowGap: '$space$6',
      },
    },
  },
})
