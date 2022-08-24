const withTM = require('next-transpile-modules')([
  '@ledger-sync/accounting',
  '@ledger-sync/id',
  '@ledger-sync/standard',
  '@ledger-sync/util',
  '@ledger-sync/config',
  '@ledger-sync/core-sync',
  '@ledger-sync/core-sync-frontend',
  '@ledger-sync/core-integration-fs',
  '@ledger-sync/core-integration-firebase',
  '@ledger-sync/core-integration-postgres',
  '@ledger-sync/core-integration-redis',
  '@ledger-sync/core-integration-mongodb',
  '@ledger-sync/ledger-sync',
  '@ledger-sync/integration-plaid',
  '@ledger-sync/integration-beancount',
  '@ledger-sync/integration-onebrick',
  '@ledger-sync/integration-teller',
  '@ledger-sync/integration-stripe',
  '@ledger-sync/integration-ramp',
  '@ledger-sync/integration-wise',
  '@ledger-sync/integration-toggl',
  '@ledger-sync/integration-import',
  '@ledger-sync/integration-foreceipt',
  '@ledger-sync/integration-yodlee',
  '@ledger-sync/integration-splitwise',
  '@ledger-sync/integration-postgres',
])

/**
 * @type {import('next').NextConfig}
 */
module.exports = withTM(
  /** @type {import('next').NextConfig} */ ({
    reactStrictMode: true,
    typescript: {
      ignoreBuildErrors: true,
    },
    experimental: {
      esmExternals: false,
    },
    webpack: (config) => {
      config.resolve.fallback = {
        fs: false,
        child_process: false, // Reference: https://stackoverflow.com/questions/54459442/module-not-found-error-cant-resolve-child-process-how-to-fix
        // For mongodb, Refs: https://stackoverflow.com/questions/54275069/module-not-found-error-cant-resolve-net-in-node-modules-stompjs-lib
        tls: false,
        net: false,
        dns: false,
      }
      return config
    },
    images: {
      domains: ['yodlee-1.hs.llnwd.net'],
    },
  }),
)
