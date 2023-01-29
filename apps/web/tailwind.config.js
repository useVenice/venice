const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

const {VeniceTheme} = require('./styles/themes')

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    './**/*.tsx',
    '../../integrations/**/*.tsx',
    '../../packages/engine-frontend/**/*.tsx',
  ],
  theme: {
    boxShadow: {
      'venice-green-glow': `0px 0px 8px 4px ${VeniceTheme.greenGlow}`,
      'venice-black-drop-shadow': `0px 2px 4px 0px ${VeniceTheme.dropShadow}`,
    },
    extend: {
      colors: {
        ...VeniceTheme,
        'venice-black': {
          DEFAULT: VeniceTheme.black,
          300: '#4e4e4e',
          500: '#2e2e2e',
        },
      },
      current: 'currentColor',
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
        mono: ['Source Code Pro', ...defaultTheme.fontFamily.mono],
      },
      textColor: {
        ...VeniceTheme,
        'venice-gray': '#c0c0c0',
      },
      transparent: 'transparent',
    },
    fontFamily: {
      montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans],
      sourceCode: ['Source Code Pro', ...defaultTheme.fontFamily.mono],
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
          primary: VeniceTheme.green,
          'primary-content': VeniceTheme.offwhite,
          secondary: VeniceTheme.green,
          'secondary-content': VeniceTheme.offwhite,
          accent: VeniceTheme.green,
          'accent-content': VeniceTheme.white,
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
  plugins: [require('tailwindcss-radix')(), require('daisyui')],
}
