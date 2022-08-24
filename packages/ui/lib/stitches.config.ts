import * as Colors from '@radix-ui/colors'
import type * as Stitches from '@stitches/react'
import {createStitches} from '@stitches/react'

const stitches = createStitches({
  prefix: 'demo',
  theme: {
    colors: {
      ...Colors.gray,
      ...Colors.blackA,
      success: Colors.green.green11,
      danger: Colors.red.red11,
      warning: Colors.yellow.yellow11,

      primary: 'hsl(224, 33%, 47%)',
      secondary: 'hsl(224, 47%, 63%)',
    },
    fonts: {
      sans: "system-ui, -apple-system, 'Helvetica Neue', sans-serif",
      mono: "'SFMono-Regular', Consolas, Menlo, monospace",
      display: "'InterVariable', $fonts$sans",
      body: "'InterVariable', $fonts$sans",
    },
    fontSizes: {
      // Borrowed from Tailwind CSS defaults
      // https://github.com/tailwindlabs/tailwindcss/blob/c03f9ad60088470a6d07f14bdf790592f93c5772/stubs/defaultConfig.stub.js#L318
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    fontWeights: {
      // Borrowed from Tailwind CSS defaults
      // https://github.com/tailwindlabs/tailwindcss/blob/c03f9ad60088470a6d07f14bdf790592f93c5772/stubs/defaultConfig.stub.js#L333
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeights: {
      // Borrowed from Tailwind CSS defaults
      // https://github.com/tailwindlabs/tailwindcss/blob/c03f9ad60088470a6d07f14bdf790592f93c5772/stubs/defaultConfig.stub.js#L536
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
    },
    radii: {
      // Borrowed from Tailwind CSS defaults
      // https://github.com/tailwindlabs/tailwindcss/blob/c03f9ad60088470a6d07f14bdf790592f93c5772/stubs/defaultConfig.stub.js#L185
      none: '0px',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    shadows: {
      // Borrowed from Tailwind CSS defaults
      // https://github.com/tailwindlabs/tailwindcss/blob/c03f9ad60088470a6d07f14bdf790592f93c5772/stubs/defaultConfig.stub.js#L203
      none: 'none',
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      focus: '0 0 0 1px $colors$primary',
    },
    sizes: {
      bpsm: '640px',
      bpmd: '768px',
      bplg: '1024px',
      bpxl: '1280px',
    },
    space: {
      // Borrowed from Tailwind CSS defaults
      // https://github.com/tailwindlabs/tailwindcss/blob/c03f9ad60088470a6d07f14bdf790592f93c5772/stubs/defaultConfig.stub.js#L69
      px: '1px',
      0: '0px',
      '0_5': '0.125rem',
      1: '0.25rem',
      '1_5': '0.375rem',
      2: '0.5rem',
      '2_5': '0.625rem',
      3: '0.75rem',
      '3_5': '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
    },
    transitions: {
      default: '225ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    zIndices: {
      // Inspired by Bootstrap
      // https://getbootstrap.com/docs/5.2/layout/z-index/
      dialog: '1050',
      popover: '1070',
      toast: '1090',
    },
  },
  utils: {
    inset: (value: Stitches.ScaleValue<'space'> | number | string) => ({
      top: value,
      right: value,
      bottom: value,
      left: value,
    }),
    paddingX: (value: Stitches.ScaleValue<'space'> | number | string) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    paddingY: (value: Stitches.ScaleValue<'space'> | number | string) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    marginX: (value: Stitches.ScaleValue<'space'> | number | string) => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginY: (value: Stitches.ScaleValue<'space'> | number | string) => ({
      marginTop: value,
      marginBottom: value,
    }),
    stackGap: (value: Stitches.ScaleValue<'space'> | number | string) => ({
      $$gap: `$space${value}`,
    }),
  },
  media: {
    // Borrowed from Tailwind CSS defaults
    // https://github.com/tailwindlabs/tailwindcss/blob/c03f9ad60088470a6d07f14bdf790592f93c5772/stubs/defaultConfig.stub.js#L6
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
  },
})

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = stitches

export const darkTheme = createTheme({
  colors: {
    ...Colors.grayDark,
    success: Colors.greenDark.green11,
    danger: Colors.redDark.red11,
    warning: Colors.yellowDark.yellow11,
  },
})

export type CSS = Stitches.CSS<typeof config>
