import {debugProvider} from '@ledger-sync/cdk-core'
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
import {
  compact,
  filterObject,
  R,
  z,
  zEnvVars,
  zFlatten,
} from '@ledger-sync/util'

// MARK: - Dependencies

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

export const zFlatConfigByProvider = R.mapToObj(DOCUMENTED_PROVIDERS, (p) => [
  p.name,
  zFlatten(p.def.integrationConfig ?? z.unknown()),
])

// MARK: - Env vars

export const zCommonEnv = zEnvVars({
  NEXT_PUBLIC_API_URL: z
    .string()
    .default('/api')
    .describe(
      `Fully qualified url your venice api used for webhooks and server-side rendering.
      Normally this is $SERVER_HOSTNAME/api. e.g. https://connect.example.com/api`,
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

export const zIntegrationEnv = zEnvVars(
  R.pipe(
    zFlatConfigByProvider,
    R.toPairs,
    // R.map((p) => flattenZObject(p.def.integrationConfig, [`int_${p.name}`])),
    R.map(([name, schema]) =>
      R.mapKeys(schema.innerType().shape, (k) =>
        compact([`int_${name}`, k]).join('__'),
      ),
    ),
    R.mergeAll,
  ) as {},
)

export const zAllEnv = zCommonEnv.merge(zBackendEnv).merge(zIntegrationEnv)

// MARK: - Parsing env vars

export function parseIntConfigsFromEnv(
  env: Record<string, string | undefined>,
) {
  return R.pipe(
    R.mapValues(zFlatConfigByProvider, (zFlatConfig, name) => {
      try {
        const subEnv = R.pipe(
          filterObject(env, (key) => key.startsWith(`int_${name}`)),
          R.mapKeys((key) => key.split('__').slice(1).join('__')),
          (sEnv) => (Object.keys(sEnv).length ? sEnv : undefined),
        )
        // console.log('Parsing', name, subEnv)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return zFlatConfig.optional().parse(subEnv)
      } catch (err) {
        if (err instanceof z.ZodError && err.issues[0]) {
          const issue = err.issues[0]

          // const msg = issue.code === 'invalid_type' && issue.message === 'Required' ? ``
          throw new Error(
            `Failed to configure "${name}" provider due to invalid env var "${[
              `int_${name}`,
              ...issue.path,
            ].join('__')}": ${issue.message} [${issue.code}]`,
          )
        }
      }
    }),
    (configMap) => filterObject(configMap, (_, val) => val !== undefined),
  )
}

// loadEnv()
// const env = zParser(zAllEnv).parseUnknown(process.env)
// const configs = parseIntConfigs(env)
// console.log(env, configs)
// beancount: undefined,
// onebrick: getEnv('ONEBRICK_CREDENTIALS'),
// alka: {
//   baseDir: './data',
//   // serviceAccountJson: safeJSONParse(
//   //   process.env['FIREBASE_SERVICE_ACCOUNT_STAGING'],
//   // ),
//   // envName: 'staging',
// },
