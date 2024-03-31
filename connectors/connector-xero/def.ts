import type {
  ConnectorDef,
  ConnectorSchemas,
  EntityPayloadWithRaw,
} from '@usevenice/cdk'
import {connHelpers} from '@usevenice/cdk'
import {z, zCast} from '@usevenice/util'

export const xeroSchemas = {
  name: z.literal('xero'),
  resourceSettings: z.object({
    access_token: z.string(),
  }),
  destinationInputEntity: zCast<EntityPayloadWithRaw>(),
} satisfies ConnectorSchemas

export const helpers = connHelpers(xeroSchemas)

export const xeroDef = {
  metadata: {
    categories: ['accounting'],
    logoUrl: '/_assets/logo-xero.svg',
    displayName: 'Xero',
    stage: 'alpha',
    nangoProvider: 'xero',
  },
  name: 'xero',
  schemas: xeroSchemas,
} satisfies ConnectorDef<typeof xeroSchemas>

export default xeroDef
