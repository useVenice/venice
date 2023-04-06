import {debugProvider, makeId, zEnvName} from '@usevenice/cdk-core'
import {airtableProvider} from '@usevenice/core-integration-airtable'
import {firebaseProvider} from '@usevenice/core-integration-firebase'
import {fsProvider} from '@usevenice/core-integration-fs'
import {mongodbProvider} from '@usevenice/core-integration-mongodb'
import {corePostgresProvider} from '@usevenice/core-integration-postgres'
import {webhookProvider} from '@usevenice/core-integration-webhook'
import {beancountProvider} from '@usevenice/integration-beancount'
import {foreceiptProvider} from '@usevenice/integration-foreceipt'
import {importProvider} from '@usevenice/integration-import'
import {lunchmoneyProvider} from '@usevenice/integration-lunchmoney'
import {mootaProvider} from '@usevenice/integration-moota'
import {oneBrickProvider} from '@usevenice/integration-onebrick'
import {plaidProvider} from '@usevenice/integration-plaid'
import {postgresProvider} from '@usevenice/integration-postgres'
import {QBOProvider} from '@usevenice/integration-qbo'
import {rampProvider} from '@usevenice/integration-ramp'
import {saltedgeProvider} from '@usevenice/integration-saltedge'
import {splitwiseProvider} from '@usevenice/integration-splitwise'
import {stripeProvider} from '@usevenice/integration-stripe'
import {tellerProvider} from '@usevenice/integration-teller'
import {togglProvider} from '@usevenice/integration-toggl'
import {venmoProvider} from '@usevenice/integration-venmo'
import {wiseProvider} from '@usevenice/integration-wise'
import {yodleeProvider} from '@usevenice/integration-yodlee'
import {mergeImpl} from '@usevenice/integration-merge'
import {R, z, zEnvVars, zFlattenForEnv} from '@usevenice/util'

// MARK: - Env vars

export const zCommonEnv = zEnvVars({
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_WRITEKEY: z.string().optional(),

  // TODO: Deprecate me?
  DEFAULT_CONNECT_ENV: zEnvName.default('sandbox'),

  // TODO: Make use of me...
  NODE_ENV: z
    .string()
    .optional()
    .default(process.env['NEXT_PUBLIC_NODE_ENV'] ?? process.env.NODE_ENV),
})

export const zBackendEnv = zEnvVars({
  POSTGRES_OR_WEBHOOK_URL: z.string().describe(`
  Pass a valid postgres(ql):// url for stateful mode. Will be used Primary database used for metadata and user data storage
  Pass a valid http(s):// url for stateless mode. Sync data and metadata be sent to provided URL and you are responsible for your own persistence`),
  JWT_SECRET_OR_PUBLIC_KEY: z
    .string()
    .trim()
    .describe('Used for validating authenticity of accessToken'),

  SENTRY_CRON_MONITOR_ID: z
    .string()
    .optional()
    .describe('Used to monitor the schedule syncs cron job'),
})

// MARK: - Integration env vars

export {plaidProvider, fsProvider}

export const DOCUMENTED_PROVIDERS = [
  // plaidProvider,
  mergeImpl as unknown as typeof plaidProvider,
] as const

export const PROVIDERS = [
  ...DOCUMENTED_PROVIDERS,
  // Core
  debugProvider,
  fsProvider,
  firebaseProvider,
  mongodbProvider,
  corePostgresProvider,
  airtableProvider,
  webhookProvider,
  // Ledger
  yodleeProvider,
  beancountProvider,
  importProvider,
  lunchmoneyProvider,
  oneBrickProvider,
  tellerProvider,
  stripeProvider,
  rampProvider,
  wiseProvider,
  togglProvider,
  foreceiptProvider,

  splitwiseProvider,
  postgresProvider,
  mootaProvider,
  QBOProvider,
  saltedgeProvider,
  venmoProvider,
  // New ones
  mergeImpl as unknown as typeof venmoProvider, // Hack for now...
] as const

/** We would prefer to use `.` but vercel env var name can only be number, letter and underscore... */
const separator = '__'
const getPrefix = (name: string) => makeId('int', name, '')

// Should this be all providers or only dcoumented ones?

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

/**
 * Input env must be raw, so means most likely we are parsing the flatConfig input twice
 * for the moment unfortunately... But we need this to support transforms in flatConfig
 */
export function parseIntConfigsFromRawEnv(
  env: Record<string, string | undefined> = process.env,
) {
  return R.pipe(
    R.mapValues(zFlatConfigByProvider, (zFlatConfig, name) => {
      const subEnv = R.pipe(
        R.pickBy(env, (_v, k) => k.startsWith(getPrefix(name))),
        (e) => (R.keys(e).length ? e : undefined), // To get .optional() to work
      )
      try {
        return zFlatConfig.optional().parse(subEnv)
      } catch (err) {
        if (err instanceof z.ZodError && err.issues[0]) {
          const issue = err.issues[0]
          // const msg = issue.code === 'invalid_type' && issue.message === 'Required' ? ``
          // console.log('subEnv', subEnv, issue)
          throw new Error(
            `Failed to configure "${name}" provider due to invalid env var "${issue.path.join(
              separator,
            )}": ${issue.message} [${issue.code}]`,
          )
        }
      }
    }),
    (configMap) => R.pickBy(configMap, (val) => val !== undefined),
  ) as {
    [k in (typeof PROVIDERS)[number]['name']]?: Extract<
      (typeof PROVIDERS)[number],
      {name: k}
    >['def']['_types']['integrationConfig']
  }
}
