/**
 * @type {import('prettier').Config}
 */
module.exports = {
  arrowParens: 'always',
  bracketSameLine: true,
  bracketSpacing: false,
  importOrder: [
    '^[^./](.*)\\.fx$',
    '^[./](.*)\\.fx$',
    '<THIRD_PARTY_MODULES>',
    '^[./]',
  ],
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  jsxSingleQuote: false,
  printWidth: 80,
  quoteProps: 'as-needed',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
}
