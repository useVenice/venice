import type {
  AnyEntityPayload,
  IntegrationDef,
  IntegrationSchemas,
} from '@usevenice/cdk-core'
import {z, zCast} from '@usevenice/util'

export const zMongoConnection = z.object({
  databaseUrl: z.string(),
  databaseName: z.string(),
})

export const mongoSchemas = {
  name: z.literal('mongodb'),
  resourceSettings: zMongoConnection,
  destinationInputEntity: zCast<AnyEntityPayload>(),
} satisfies IntegrationSchemas

export const mongoDef = {
  name: 'mongodb',
  schemas: mongoSchemas,
  metadata: {categories: ['database'], logoUrl: '/_assets/logo-mongodb.png'},
} satisfies IntegrationDef<typeof mongoSchemas>

export default mongoDef
