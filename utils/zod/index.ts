import * as z from 'zod'
import type {oas30, oas31} from 'zod-openapi'
import {createDocument, extendZodWithOpenApi} from 'zod-openapi'

extendZodWithOpenApi(z)

export {z}
export {extendZodWithOpenApi, createDocument}

export type OpenAPISpec = oas30.OpenAPIObject | oas31.OpenAPIObject

/** We use a super-set of JSON schema defined by the OpenAPI 3.1 spec */
export type Oas31Schema = oas31.SchemaObject & {$schema?: string}

/**
 * Convert to JSONSchema using OpenAPI 3.1 spec, which is a superset of JSONSchema Draft 2020-12
 * This is preferred over zod-to-json-schema because it allows for metadata such as title
 * and summary to be specified via the `.openapi()` method.
 */
export function zodToOas31Schema(
  zodSchema: z.ZodTypeAny,
  zodDefinitions?: Record<string, z.ZodTypeAny>,
): Oas31Schema {
  const oas = createDocument({
    openapi: '3.1.0', // Only 3.1 is basically fully compatible with JSON-schema
    info: {title: '', version: ''},
    components: {schemas: {...zodDefinitions, schema: zodSchema}},
  })
  const {schema, ...definitions} = oas.components?.schemas ?? {}
  return {
    ...schema,
    // Normally jsonschema uses an idiomatic `definitions` key,
    // but we use `components.schemas` to not need to modify any and all refs
    ...(Object.keys(definitions).length && {
      components: {schemas: definitions},
    }),
    /**
     * Superset of the [JSON Schema Specification Draft 2020-12](https://json-schema.org/draft/2020-12/schema)
     * Technically at https://spec.openapis.org/oas/3.1/dialect/base, but many tools don't support meta schemas
     * so we forget it for now.
     */
    // $schema: 'https://json-schema.org/draft/2020-12/schema,'
    // $schema: 'https://spec.openapis.org/oas/3.1/dialect/base',
  }
}

/** `zCast<TOut>()` standalone */
export const zCast = <T>(...args: Parameters<(typeof z)['unknown']>) =>
  z.unknown(...args) as z.ZodType<T, z.ZodTypeDef, unknown>

/** Alternative to zCast that only accepts Records as inputs */
export const zRecord = <T extends Record<string, unknown>>() =>
  z.record(z.unknown()) as z.ZodType<T, z.ZodTypeDef, Record<string, unknown>>

export const zObject = <T extends Record<string, unknown>>() =>
  z.object({}) as unknown as z.ZodType<T, z.ZodTypeDef, Record<string, unknown>>
