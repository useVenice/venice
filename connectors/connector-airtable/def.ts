import type {ConnectorDef, ConnectorSchemas} from '@usevenice/cdk'
import {connHelpers} from '@usevenice/cdk'
import type {EntityPayloadWithRaw} from '@usevenice/cdk'
import {z, zCast} from '@usevenice/util'

import {zAirtableResourceSettings} from './AirtableClient'

export const airtableSchemas = {
  name: z.literal('airtable'),
  resourceSettings: zAirtableResourceSettings,
  destinationInputEntity: zCast<EntityPayloadWithRaw>(),
} satisfies ConnectorSchemas

export const helpers = connHelpers(airtableSchemas)

export const airtableDef = {
  metadata: {
    categories: ['database'],
    logoUrl: '/_assets/logo-airtable.svg',
  },
  name: 'airtable',
  schemas: airtableSchemas,
} satisfies ConnectorDef<typeof airtableSchemas>

export default airtableDef
