import * as colors from 'twind/colors'
import {css} from 'twind/css'

/**
 * @type {import('twind').Configuration}
 */
export default {
  theme: {
    extend: {
      colors: {
        primary: colors.gray[900],
        secondary: colors.blue[500],
      },
      fontFamily: {
        display: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: {
    'h-screen': css`
      & {
        height: 100vh;
      }

      @supports (height: 100dvh) {
        & {
          height: 100dvh;
        }
      }
    `,
  },
  variants: {
    'radix-state-active': '&[data-state="active"]',
    'radix-state-inactive': '&[data-state="inactive"]',
    'radix-state-checked': '&[data-state="checked"]',
    'radix-state-unchecked': '&[data-state="unchecked"]',
  },
}
