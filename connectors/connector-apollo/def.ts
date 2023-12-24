import type {ConnectorDef, ConnectorSchemas} from '@usevenice/cdk'
import {connHelpers} from '@usevenice/cdk'
import {z} from '@usevenice/util'

export const apolloSchemas = {
  name: z.literal('apollo'),
  resourceSettings: z.object({
    apiKey: z.string(),
  }),
} satisfies ConnectorSchemas

export const apolloHelpers = connHelpers(apolloSchemas)

export const apolloDef = {
  name: 'apollo',
  schemas: apolloSchemas,
  metadata: {
    displayName: 'Apollo',
    stage: 'beta',
    logoUrl: '/_assets/logo-apollo.svg',
  },
} satisfies ConnectorDef<typeof apolloSchemas>

export default apolloDef
