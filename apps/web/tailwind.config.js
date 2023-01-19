const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

const veniceTheme = {
  background: 'rgba(30, 30, 30, 1)',
  black: 'rgba(30, 30, 30, 1)',
  footerBlack: 'rgba(25, 25, 25, 1)',
  githubGray: 'rgba(238, 241, 245, 1)',
  gray: 'rgba(125, 125, 125, 1)',
  green: 'rgba(18, 184, 134, 1)',
  greenGlow: 'rgba(18,184,134,0.15)',
  innerBevel: 'rgba(0, 0, 0, 0.102)',
  inputBackground: 'rgba(41, 41, 41, 1)',
  inputBorder: 'rgba(0, 0, 0, 0.5)',
  offwhite: 'rgba(233, 233, 233, 1)',
  primary: 'rgba(233, 233, 233, 1)',
  secondary: 'rgba(18, 184, 134, 1)',
  white: 'rgba(255, 255, 255, 1)',
}

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    './{components,pages,screens}/**/*.{ts,tsx}',
    '../../integrations/*/**/*.tsx',
    '../../packages/engine-frontend/**/*.tsx',
  ],
  theme: {
    boxShadow: {
      'venice-green-glow': '0px 0px 8px 4px rgba(18,184,134,0.15)',
      'venice-black-drop-shadow': '0px 2px 4px 0px rgba(0,0,0,0.15)',
    },
    extend: {
      backgroundColor: {
        'venice-black': veniceTheme.black,
      },
      colors: veniceTheme,
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      textColor: veniceTheme.offwhite,
    },
    fontFamily: {
      montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans],
    },
    keyframes: {
      // Dropdown menu
      'scale-in': {
        '0%': {opacity: 0, transform: 'scale(0)'},
        '100%': {opacity: 1, transform: 'scale(1)'},
      },
      'slide-down': {
        '0%': {opacity: 0, transform: 'translateY(-10px)'},
        '100%': {opacity: 1, transform: 'translateY(0)'},
      },
      'slide-up': {
        '0%': {opacity: 0, transform: 'translateY(10px)'},
        '100%': {opacity: 1, transform: 'translateY(0)'},
      },
      // Toast
      'toast-hide': {
        '0%': {opacity: 1},
        '100%': {opacity: 0},
      },
      'toast-slide-in-right': {
        '0%': {transform: 'translateX(calc(100% + 1rem))'},
        '100%': {transform: 'translateX(0)'},
      },
      'toast-slide-in-bottom': {
        '0%': {transform: 'translateY(calc(100% + 1rem))'},
        '100%': {transform: 'translateY(0)'},
      },
      'toast-swipe-out': {
        '0%': {transform: 'translateX(var(--radix-toast-swipe-end-x))'},
        '100%': {
          transform: 'translateX(calc(100% + 1rem))',
        },
      },
    },
    animation: {
      // Dropdown menu
      'scale-in': 'scale-in 0.2s ease-in-out',
      'slide-down': 'slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      // Toast
      'toast-hide': 'toast-hide 100ms ease-in forwards',
      'toast-slide-in-right':
        'toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      'toast-slide-in-bottom':
        'toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      'toast-swipe-out': 'toast-swipe-out 100ms ease-out forwards',
    },
  },
  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          primary: veniceTheme.offWhite,
          'primary-content': veniceTheme.black,
          secondary: veniceTheme.green,
          'secondary-content': veniceTheme.offwhite,
          accent: veniceTheme.green,
          'accent-content': veniceTheme.white,
          neutral: colors.gray[700],
          'neutral-content': colors.white,
          'base-100': colors.white,
          'base-200': colors.gray[100],
          'base-300': colors.gray[200],
          'base-content': colors.gray[500],

          '--rounded-box': '0.5rem',
          '--rounded-btn': '0.25rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-text-case': 'none',
          '--tab-radius': '0.25rem',
        },
      },
    ],
  },
  plugins: [
    require('tailwindcss-radix')(),
    require('daisyui'),
    // ActiveLink
    plugin(({addVariant}) => {
      addVariant('link-active', '&[data-link-active]')
      addVariant('link-exact-active', '&[data-link-exact-active]')
    }),
  ],
}
