import {z} from 'zod'

import {R} from './data-utils'

export function getEnvVars(): Record<string, string | undefined> {
  return (
    (typeof window !== 'undefined' && window.localStorage) ||
    (typeof process !== 'undefined' && process.env) ||
    {}
  )
}

export function getEnvVar(key: string): string | undefined {
  return getEnvVars()[key] ?? undefined
}

/** TODO: Consider making this work beyond envVars? */
export function zEnvVars<T extends z.ZodRawShape>(shape: T) {
  // Zod is super opinionated, therefore we do not have access to description
  // during error formattign :(
  // @see https://github.com/colinhacks/zod/pull/1241
  // At some point we probably want a custom zod.parse type anyways
  R.forEachObj.indexed(shape, (schema, _key) => {
    const key = _key.toString()
    const def = schema._def as z.ZodTypeDef
    def.errorMap = (_issue, ctx) => {
      if (_issue.code === 'invalid_type' && ctx.data == null) {
        return {message: `env.${key} is required`}
      }
      return {message: `env.${key}: ${ctx.defaultError}`}
    }
  })
  return z.object(shape)
}
