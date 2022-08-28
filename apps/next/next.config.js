const withTM = require('next-transpile-modules')([
  '@ledger-sync/accounting',
  '@ledger-sync/app-config',
  '@ledger-sync/app',
  '@ledger-sync/cdk-core',
  '@ledger-sync/cdk-ledger',
  '@ledger-sync/core-integration-airtable',
  '@ledger-sync/core-integration-firebase',
  '@ledger-sync/core-integration-fs',
  '@ledger-sync/core-integration-mongodb',
  '@ledger-sync/core-integration-postgres',
  '@ledger-sync/core-integration-redis',
  '@ledger-sync/engine-frontend',
  '@ledger-sync/engine',
  '@ledger-sync/id',
  '@ledger-sync/integration-beancount',
  '@ledger-sync/integration-foreceipt',
  '@ledger-sync/integration-import',
  '@ledger-sync/integration-onebrick',
  '@ledger-sync/integration-plaid',
  '@ledger-sync/integration-postgres',
  '@ledger-sync/integration-ramp',
  '@ledger-sync/integration-splitwise',
  '@ledger-sync/integration-stripe',
  '@ledger-sync/integration-teller',
  '@ledger-sync/integration-toggl',
  '@ledger-sync/integration-wise',
  '@ledger-sync/integration-yodlee',
  '@ledger-sync/standard',
  '@ledger-sync/util',
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
