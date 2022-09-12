/**
 * @type {import('prettier').Config}
 */
module.exports = {
  arrowParens: 'always',
  bracketSameLine: true,
  bracketSpacing: false,
  importOrder: [
    '^node:(.+)$',
    '<THIRD_PARTY_MODULES>',
    '^@ledger-sync/(.+)$',
    '^[./]',
  ],
  importOrderCaseInsensitive: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  jsxSingleQuote: false,
  plugins: [
    require.resolve('@ianvs/prettier-plugin-sort-imports'),
    require.resolve('prettier-plugin-packagejson'),
  ],
  printWidth: 80,
  quoteProps: 'as-needed',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
}
