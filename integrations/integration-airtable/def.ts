import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk-core'
import {intHelpers} from '@usevenice/cdk-core'
import type {EntityPayloadWithExternal} from '@usevenice/cdk-ledger'
import {z, zCast} from '@usevenice/util'

import {zAirtableResourceSettings} from './AirtableClient'

export const airtableSchemas = {
  name: z.literal('airtable'),
  resourceSettings: zAirtableResourceSettings,
  destinationInputEntity: zCast<EntityPayloadWithExternal>(),
} satisfies IntegrationSchemas

export const helpers = intHelpers(airtableSchemas)

export const airtableDef = {
  metadata: {
    categories: ['database'],
    logoUrl: '/_assets/logo-airtable.svg',
  },
  name: 'airtable',
  schemas: airtableSchemas,
} satisfies IntegrationDef<typeof airtableSchemas>

export default airtableDef
