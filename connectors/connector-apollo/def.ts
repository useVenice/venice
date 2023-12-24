import oas from '@opensdks/sdk-apollo/apollo.oas.json'
import type {ConnectorDef, ConnectorSchemas, OpenApiSpec} from '@usevenice/cdk'
import {connHelpers} from '@usevenice/cdk'
import {z} from '@usevenice/util'

export const apolloSchemas = {
  name: z.literal('apollo'),
  // Should get this from apollo sdk def...
  resourceSettings: z.object({
    api_key: z.string(),
  }),
} satisfies ConnectorSchemas

export const apolloHelpers = connHelpers(apolloSchemas)

export const apolloDef = {
  name: 'apollo',
  schemas: apolloSchemas,
  metadata: {
    categories: ['sales-engagement'],
    displayName: 'Apollo',
    stage: 'beta',
    logoUrl: '/_assets/logo-apollo.svg',
    openapiSpec: {proxied: oas as OpenApiSpec},
  },
} satisfies ConnectorDef<typeof apolloSchemas>

export default apolloDef
