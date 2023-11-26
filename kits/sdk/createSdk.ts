import type {oas30, oas31} from 'openapi3-ts'
import {createClient} from '@usevenice/openapi-client'

export type OpenAPISpec = oas30.OpenAPIObject | oas31.OpenAPIObject

// export interface SdkTypes {
//   components: unknown
//   external: unknown
//   operations: unknown
//   paths: unknown
//   webhooks: unknown
// }

/** Get this from openapi */
export interface SdkDefinition<Paths extends {}> {
  _types: {paths: Paths}
  oas: OpenAPISpec
}

// This is necessary because we cannot publish inferred type otherwise
// @see https://share.cleanshot.com/06NvskP0
export type SDK<Paths extends {}> = ReturnType<typeof createClient<Paths>> & {
  // This should be made optional to keep the bundle size small
  // company should be able to opt-in for things like validation
  oas: OpenAPISpec
}

export function createSdk<Paths extends {}>(
  sdkDef: SdkDefinition<Paths>,
): SDK<Paths> {
  const {oas} = sdkDef
  const client = createClient<Paths>()
  return {...client, oas}
}
