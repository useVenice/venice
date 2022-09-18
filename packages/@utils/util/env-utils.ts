import {sort} from 'fast-sort'
import {compact} from 'remeda'
import {z} from 'zod'

import {R} from './data-utils'
import {
  javascriptStringify,
  safeJSONParse,
  safeJSONStringify,
} from './json-utils'
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

/** Flatten a zod schema for loading from env... */
export function zFlattenForEnv<T extends z.ZodTypeAny>(
  schema: T,
  {
    prefix,
    separator = '.',
  }: {
    prefix?: string
    separator?: string
  },
) {
  const flatSchema = z.object(
    flattenShapeForEnv(schema, {prefixes: prefix ? [prefix] : [], separator}),
  )

  return flatSchema.transform(
    zGuard((input) => {
      const nested: Record<string, unknown> = unflattenEnv(input, {separator})
      // console.log('beforeafter', input, nested, prefix)
      // Notably this does not work with optional...
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return schema.parse(prefix ? nested[prefix] : nested)
    }),
  )
}

/** Get a flat shape suitable for passing into z.object  */
function flattenShapeForEnv<T extends z.ZodTypeAny>(
  schema: T,
  {
    prefixes,
    separator,
  }: {
    prefixes: string[]
    separator: string
  },
): z.ZodRawShape {
  // console.log('flattenZObject', schema, prefixes)
  // if (!schema) {
  //   return {}
  // }
  // Need better solution here...
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return flattenShapeForEnv(
      (schema.unwrap() as z.ZodTypeAny).describe(
        // TODO: Get '(required)' working too , right now this is only ever optional...
        `${schema.isOptional() ? '(Optional)' : '(Required)'} ${
          schema.description ?? ''
        }`,
      ),
      {separator, prefixes},
    )
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
      R.map(([key, value]) =>
        flattenShapeForEnv(value, {separator, prefixes: [...prefixes, key]}),
      ),
      R.mergeAll,
    ) as z.ZodRawShape
  }

  const hint = schemaHint(schema)
  return {
    [prefixes.join(separator)]: z
      .string()
      .optional()
      // Handle things like array etc.
      .transform((str) => safeJSONParse(str) ?? str)
      .describe(
        compact([
          hint && '`',
          hint,
          hint && '`',
          hint && schema.description && ' - ',
          schema.description,
        ]).join(''),
      ),
  }
}

function schemaHint(schema: z.ZodTypeAny): string {
  if (schema instanceof z.ZodEnum) {
    return schema.options.join(' | ')
  } else if (schema instanceof z.ZodNativeEnum) {
    return Object.values(schema.enum).join(' | ')
  } else if (schema instanceof z.ZodString) {
    return 'string'
  } else if (schema instanceof z.ZodNumber) {
    return 'number'
  } else if (schema instanceof z.ZodBoolean) {
    return 'boolean'
  } else if (schema instanceof z.ZodOptional) {
    return schemaHint(schema.unwrap()) + ' | undefined'
  } else if (schema instanceof z.ZodNullable) {
    return schemaHint(schema.unwrap()) + ' | null'
  } else if (schema instanceof z.ZodArray) {
    return `Array<${schemaHint(schema.element)}>`
  } else if (schema instanceof z.ZodDefault) {
    return (
      schemaHint(schema.removeDefault()) +
      ` = ${
        safeJSONStringify(schema._def.defaultValue()) ??
        javascriptStringify(schema._def.defaultValue())
      }`
    )
  }
  return ''
}

/** Prepare env for parsing into nested json from simple values */
function unflattenEnv(
  env: Record<string, string | undefined>,
  {separator}: {separator: string},
) {
  const nested = {}
  // Sorting keys such that we set the deepest paths first
  // So plaid="" will always override plaid.client_id="id..."
  for (const [key, v] of sort(R.toPairs(env)).desc(([k]) => k.length)) {
    // Remove empty strings...
    setAt(
      nested,
      key.split(separator).join('.'),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      (typeof v === 'string' ? v.trim() : v) || undefined,
    )
  }
  return nested
}

// MARK: - Unsafe env access

/** Do not use together with webpack Define plugin (including NEXT_PUBLIC_...) */
export function getEnvVars(): Record<string, string | undefined> {
  return (
    (typeof window !== 'undefined' && window.localStorage) ||
    (typeof process !== 'undefined' && process.env) ||
    {}
  )
}

/** Do not use together with webpack Define plugin (including NEXT_PUBLIC_...) */
export function getEnvVar<OptJson extends boolean>(
  key: string,
  opts?: {json?: OptJson},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): OptJson extends true ? any : string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return R.pipe(getEnvVars()[key] ?? undefined, (val) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    opts?.json ? safeJSONParse(val) : val,
  )
}
