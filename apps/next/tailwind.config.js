const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./{components,pages}/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.gray[900],
        secondary: colors.blue[500],
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('tailwindcss-radix')()],
}
