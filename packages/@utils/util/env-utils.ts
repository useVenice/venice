import {sort} from 'fast-sort'
import {z} from 'zod'

import {R} from './data-utils'
import {setAt} from './object-utils'
import {zGuard} from './zod-utils'

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

/** We would prefer to use `.` but vercel env var name can only be number, letter and underscore... */
const separator = '__'

export function zFlatten<T extends z.ZodTypeAny>(schema: T) {
  const flatSchema = z.object(flattenZObject(schema, []))

  return flatSchema.transform(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    zGuard((input) => schema.parse(unflattenEnv(input))),
  )
}

function flattenZObject<T extends z.ZodTypeAny>(
  schema: T,
  prefixes: string[],
): z.ZodRawShape {
  // console.log('flattenZObject', schema, prefixes)
  // if (!schema) {
  //   return {}
  // }
  // Need better solution here...
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return flattenZObject(schema.unwrap(), prefixes)
  }
  if (schema instanceof z.ZodObject || schema instanceof z.ZodRecord) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const shape: z.ZodRawShape =
      schema instanceof z.ZodObject
        ? schema.shape
        : R.pipe(
            schema.keySchema,
            (ks) => (ks instanceof z.ZodEnum ? (ks.options as string[]) : []),
            R.mapToObj((key) => [
              key,
              (schema.valueSchema as z.ZodTypeAny).optional(),
            ]),
          )
    return R.pipe(
      shape,
      R.toPairs,
      R.map(([key, value]) => flattenZObject(value, [...prefixes, key])),
      R.mergeAll,
    ) as z.ZodRawShape
  }
  // console.log('schema def', prefixes, schema._def)

  return {
    [prefixes.join(separator)]: z
      .string()
      .optional()
      .describe(
        `${schema.isOptional() ? '[Optional]' : '<Required>'} ${
          schema.description ?? ''
        }`,
      ),
  }
}

function unflattenEnv(env: Record<string, string | undefined>) {
  const nested = {}
  // Sorting keys such that we set the deepest paths first
  // So plaid="" will always override plaid.client_id="id..."
  for (const [key, value] of sort(R.toPairs(env)).desc(([k]) => k.length)) {
    // Remove empty strings...
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    setAt(nested, key.split(separator).join('.'), value?.trim() || undefined)
  }
  return nested
}

// MARK: - Deprecated...

/** @deprecated */
export function getEnvVars(): Record<string, string | undefined> {
  return (
    (typeof window !== 'undefined' && window.localStorage) ||
    (typeof process !== 'undefined' && process.env) ||
    {}
  )
}

/** @deprecated */
export function getEnvVar(key: string): string | undefined {
  return getEnvVars()[key] ?? undefined
}
