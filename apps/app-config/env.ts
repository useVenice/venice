import {makeId, zEnvName} from '@usevenice/cdk-core'
import {R, z, zEnvVars, zFlattenForEnv} from '@usevenice/util'

import type {PROVIDERS} from './providers'
import {DOCUMENTED_PROVIDERS} from './providers'

// MARK: - Env vars

export const zCommonEnv = zEnvVars({
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_WRITEKEY: z.string().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  NEXT_PUBLIC_CLERK_SUPABASE_JWT_TEMPLATE_NAME: z.string().default('supabase'),

  // Deprecated
  // TODO: Deprecate me? prefix with NEXT_PUBLIC please
  DEFAULT_CONNECT_ENV: zEnvName.default('sandbox'),

  // TODO: Make use of me... prefix with NEXT_PUBLIC please
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

  CLERK_SECRET_KEY: z.string(),

  SENTRY_CRON_MONITOR_ID: z
    .string()
    .optional()
    .describe('Used to monitor the schedule syncs cron job'),
})

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
