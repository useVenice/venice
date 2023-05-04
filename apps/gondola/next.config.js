// See https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/228
// @ts-ignore
const jiti = require('jiti')(__filename)
module.exports = jiti('./next.config.ts').default
