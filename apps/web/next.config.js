const path = require('node:path')
const webpack = require('webpack')
const {withSentryConfig} = require('@sentry/nextjs')

/**
 * Meta: change from `@type` to @satisfies once ts 5.0 is out
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  transpilePackages: [
    path.resolve(__dirname, '../app-config'),
    path.resolve(__dirname, '../../integrations/core-integration-airtable'),
    path.resolve(__dirname, '../../integrations/core-integration-firebase'),
    path.resolve(__dirname, '../../integrations/core-integration-fs'),
    path.resolve(__dirname, '../../integrations/core-integration-mongodb'),
    path.resolve(__dirname, '../../integrations/core-integration-postgres'),
    path.resolve(__dirname, '../../integrations/core-integration-redis'),
    path.resolve(__dirname, '../../integrations/core-integration-webhook'),
    path.resolve(__dirname, '../../integrations/integration-alphavantage'),
    path.resolve(__dirname, '../../integrations/integration-beancount'),
    path.resolve(__dirname, '../../integrations/integration-expensify'),
    path.resolve(__dirname, '../../integrations/integration-foreceipt'),
    path.resolve(__dirname, '../../integrations/integration-import'),
    path.resolve(__dirname, '../../integrations/integration-lunchmoney'),
    path.resolve(__dirname, '../../integrations/integration-moota'),
    path.resolve(__dirname, '../../integrations/integration-onebrick'),
    path.resolve(__dirname, '../../integrations/integration-plaid'),
    path.resolve(__dirname, '../../integrations/integration-postgres'),
    path.resolve(__dirname, '../../integrations/integration-qbo'),
    path.resolve(__dirname, '../../integrations/integration-ramp'),
    path.resolve(__dirname, '../../integrations/integration-splitwise'),
    path.resolve(__dirname, '../../integrations/integration-saltedge'),
    path.resolve(__dirname, '../../integrations/integration-stripe'),
    path.resolve(__dirname, '../../integrations/integration-teller'),
    path.resolve(__dirname, '../../integrations/integration-toggl'),
    path.resolve(__dirname, '../../integrations/integration-venmo'),
    path.resolve(__dirname, '../../integrations/integration-wise'),
    path.resolve(__dirname, '../../integrations/integration-yodlee'),
    path.resolve(__dirname, '../../packages/cdk-core'),
    path.resolve(__dirname, '../../packages/cdk-ledger'),
    path.resolve(__dirname, '../../packages/engine-backend'),
    path.resolve(__dirname, '../../packages/engine-frontend'),
    path.resolve(__dirname, '../../packages/standard'),
    path.resolve(__dirname, '../../packages/ui'),
    path.resolve(__dirname, '../../packages/util'),
  ],
  env: {NEXT_PUBLIC_NODE_ENV: process.env['NODE_ENV']},
  reactStrictMode: true,
  rewrites: async () => ({
    beforeFiles: [
      // Proxy metrics requests to Posthog.
      // TODO: Where is this used? and rename to _posthog to be consistent with _sentry
      {source: '/metrics/:p*', destination: 'https://app.posthog.com/:p*'},
    ],
    afterFiles: [],
    fallback: [],
  }),

  swcMinify: true,
  typescript: {ignoreBuildErrors: true},
  eslint: {ignoreDuringBuilds: true},
  webpack: (config) => {
    config.module.exprContextCritical = false
    config.module.unknownContextCritical = false
    config.module.rules.push({
      test: /\.node$/,
      use: [{loader: 'node-loader'}],
    })
    config.resolve.fallback = {
      fs: false,
      child_process: false, // Reference: https://stackoverflow.com/questions/54459442/module-not-found-error-cant-resolve-child-process-how-to-fix
      // For mongodb, Refs: https://stackoverflow.com/questions/54275069/module-not-found-error-cant-resolve-net-in-node-modules-stompjs-lib
      tls: false,
      net: false,
      dns: false,
    }
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp:
          /^(encoding|bson-ext|kerberos|@mongodb-js\/zstd|snappy|snappy\/package\.json|aws4|mongodb-client-encryption)$/,
      }),
    )
    return config
  },
  images: {
    domains: ['yodlee-1.hs.llnwd.net'],
  },

  productionBrowserSourceMaps: true, // Let's see if this helps with Sentry... We are OSS anyways so doesn't matter too much if source code is "leaked" to client
}

/**
 * @type {import('next').NextConfig}
 */
module.exports = withSentryConfig(
  {
    ...nextConfig,
    sentry: {
      // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
      // for client-side builds. (This will be the default starting in
      // `@sentry/nextjs` version 8.0.0.) See
      // https://webpack.js.org/configuration/devtool/ and
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
      // for more information.
      hideSourceMaps: true,
      tunnelRoute: '/_sentry',
    },
  },
  {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore

    silent: false, // true to suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
  },
)
