/** @deprecated. We no longer initialize integration from ENVs, but maybe in clis still? */
import type {IntegrationSchemas, IntHelpers} from '@usevenice/cdk-core'
import {makeId} from '@usevenice/cdk-core'
import {R, z, zEnvVars, zFlattenForEnv} from '@usevenice/util'

import {defIntegrations} from './integrations/integrations.def'

/** We would prefer to use `.` but vercel env var name can only be number, letter and underscore... */
const separator = '__'
const getPrefix = (name: string) => makeId('int', name, '')

// Should this be all providers or only dcoumented ones?

export const zFlatConfigByProvider = R.mapValues(defIntegrations, (def, name) =>
  zFlattenForEnv(
    (def.schemas as IntegrationSchemas)?.integrationConfig ?? z.unknown(),
    {
      prefix: getPrefix(name),
      separator,
    },
  ),
)

export const zIntegrationEnv = zEnvVars(
  R.pipe(
    zFlatConfigByProvider,
    R.values,
    R.map((schema) => schema.innerType().shape),
    R.mergeAll,
  ) as {},
)

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
    [k in keyof typeof defIntegrations]?: GetIntConfig<
      IntHelpers<(typeof defIntegrations)[k]['schemas']>['_types']
    >
  }
}

/** Feels like bit of a hack... */
type GetIntConfig<T> = T extends {integrationConfig: unknown}
  ? T['integrationConfig']
  : {}
