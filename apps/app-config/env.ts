import {debugProvider, makeId} from '@ledger-sync/cdk-core'
import {airtableProvider} from '@ledger-sync/core-integration-airtable'
import {firebaseProvider} from '@ledger-sync/core-integration-firebase'
import {fsProvider} from '@ledger-sync/core-integration-fs'
import {mongodbProvider} from '@ledger-sync/core-integration-mongodb'
import {corePostgresProvider} from '@ledger-sync/core-integration-postgres'
import {beancountProvider} from '@ledger-sync/integration-beancount'
import {foreceiptProvider} from '@ledger-sync/integration-foreceipt'
import {importProvider} from '@ledger-sync/integration-import'
import {oneBrickProvider} from '@ledger-sync/integration-onebrick'
import {plaidProvider} from '@ledger-sync/integration-plaid'
import {postgresProvider} from '@ledger-sync/integration-postgres'
import {rampProvider} from '@ledger-sync/integration-ramp'
import {splitwiseProvider} from '@ledger-sync/integration-splitwise'
import {stripeProvider} from '@ledger-sync/integration-stripe'
import {tellerProvider} from '@ledger-sync/integration-teller'
import {togglProvider} from '@ledger-sync/integration-toggl'
import {wiseProvider} from '@ledger-sync/integration-wise'
import {yodleeProvider} from '@ledger-sync/integration-yodlee'
import {filterObject, R, z, zEnvVars, zFlattenForEnv} from '@ledger-sync/util'

// MARK: - Env vars

export const zCommonEnv = zEnvVars({
  NEXT_PUBLIC_SERVER_URL: z
    .string()
    .default(
      // Explicitly webpack defined in next.config.js so should work client side too...
      process.env['VERCEL_URL'] ? 'https://' + process.env['VERCEL_URL'] : '/',
    )
    // Should we default to request url?
    // https://stackoverflow.com/questions/23319033/how-to-get-the-port-number-in-node-js-when-a-request-is-processed
    .describe(
      `Fully qualified url your venice next.js app used for redirects, webhooks and server-side rendering.
      e.g. https://connect.example.com or http://localhost:3000 for development. Defaults to https://$VERCEL_URL if not provided
      @see https://vercel.com/docs/concepts/projects/environment-variables
      Providing this explicitly is still preferrred as $VERCEL_URL does not account for custom domain`,
    ),
})

export const zBackendEnv = zEnvVars({
  POSTGRES_URL: z
    .string()
    .describe('Primary database used for metadata and user data storage'),
  JWT_SECRET_OR_PUBLIC_KEY: z
    .string()
    .optional()
    .describe('Used for validating authenticity of accessToken'),
})

// MARK: - Integration env vars

export const DOCUMENTED_PROVIDERS = [plaidProvider] as const

export const PROVIDERS = [
  ...DOCUMENTED_PROVIDERS,
  // Core
  debugProvider,
  fsProvider,
  firebaseProvider,
  mongodbProvider,
  corePostgresProvider,
  airtableProvider,
  // Ledger
  beancountProvider,
  importProvider,
  oneBrickProvider,
  tellerProvider,
  stripeProvider,
  rampProvider,
  wiseProvider,
  togglProvider,
  foreceiptProvider,
  yodleeProvider,
  splitwiseProvider,
  postgresProvider,
] as const

/** We would prefer to use `.` but vercel env var name can only be number, letter and underscore... */
const separator = '__'
const getPrefix = (name: string) => makeId('int', name, '')

export const zFlatConfigByProvider = R.mapToObj(DOCUMENTED_PROVIDERS, (p) => [
  p.name,
  zFlattenForEnv(p.def.integrationConfig ?? z.unknown(), {
    prefix: getPrefix(p.name),
    separator,
  }),
])

export const zIntegrationEnv = zEnvVars(
  R.pipe(
    zFlatConfigByProvider,
    R.values,
    R.map((schema) => schema.innerType().shape),
    R.mergeAll,
  ) as {},
)

export const zAllEnv = zCommonEnv.merge(zBackendEnv).merge(zIntegrationEnv)

// MARK: - Parsing integration configs

export function parseIntConfigsFromEnv(
  env: Record<string, string | undefined>,
) {
  return R.pipe(
    R.mapValues(zFlatConfigByProvider, (zFlatConfig, name) => {
      try {
        const subEnv = filterObject(env, (k) => k.startsWith(getPrefix(name)))
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return zFlatConfig.optional().parse(subEnv)
      } catch (err) {
        if (err instanceof z.ZodError && err.issues[0]) {
          const issue = err.issues[0]
          // const msg = issue.code === 'invalid_type' && issue.message === 'Required' ? ``
          throw new Error(
            `Failed to configure "${name}" provider due to invalid env var "${issue.path.join(
              separator,
            )}": ${issue.message} [${issue.code}]`,
          )
        }
      }
    }),
    (configMap) => filterObject(configMap, (_, val) => val !== undefined),
  ) as {
    [k in typeof PROVIDERS[number]['name']]?: Extract<
      typeof PROVIDERS[number],
      {name: k}
    >['def']['_types']['integrationConfig']
  }
}
