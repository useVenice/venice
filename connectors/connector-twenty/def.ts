import type {
  ConnectorDef,
  ConnectorSchemas,
  EntityPayloadWithRaw,
} from '@usevenice/cdk'
import {connHelpers} from '@usevenice/cdk'
import {z, zCast} from '@usevenice/util'

export const twentySchemas = {
  name: z.literal('twenty'),
  resourceSettings: z.object({
    access_token: z.string(),
  }),
  destinationInputEntity: zCast<EntityPayloadWithRaw>(),
} satisfies ConnectorSchemas

export const helpers = connHelpers(twentySchemas)

export const twentyDef = {
  metadata: {
    categories: ['crm'],
    logoUrl: '/_assets/logo-twenty.svg',
  },
  name: 'twenty',
  schemas: twentySchemas,
} satisfies ConnectorDef<typeof twentySchemas>

export default twentyDef
