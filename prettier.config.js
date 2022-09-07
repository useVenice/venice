/**
 * @type {import('prettier').Config}
 */
module.exports = {
  arrowParens: 'always',
  bracketSameLine: true,
  bracketSpacing: false,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@ledger-sync/(.*)$', '^[./]'],
  importOrderCaseInsensitive: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderSeparation: true, // Very important to make sure register files are imported first...
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
