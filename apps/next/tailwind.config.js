const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

const palette = {
  'kashmir-blue': {
    DEFAULT: '#5166A0',
    50: '#C6CEE2',
    100: '#B9C2DB',
    200: '#9EAACE',
    300: '#8393C0',
    400: '#677BB2',
    500: '#5166A0',
    600: '#3E4E7B',
    700: '#2B3756',
    800: '#181F30',
    900: '#06070B',
  },
  primary: colors.black,
  secondary: '#5166a0',
  background: colors.white,
}

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    './{components,pages,screens}/**/*.{ts,tsx}',
    '../../packages/{@integrations/*,engine-frontend}/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: palette,
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
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
          primary: palette.primary,
          'primary-content': colors.white,
          secondary: palette.secondary,
          'secondary-content': colors.white,
          accent: palette.primary,
          'accent-content': colors.white,
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
