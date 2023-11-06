import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk-core'
import {intHelpers} from '@usevenice/cdk-core'
import type {EntityPayloadWithExternal, ZCommon} from '@usevenice/cdk-ledger'
import {z, zCast} from '@usevenice/util'

export const zPgConfig = z.object({
  databaseUrl: z.string(),
  migrationsPath: z.string().optional(),
  migrationTableName: z.string().optional(),
  transformFieldNames: z.boolean().optional(),
})

export const postgresSchemas = {
  name: z.literal('postgres'),
  // TODO: Should postgres use integration config or resourceSettings?
  // if it's resourceSettings then it doesn't make as much sense to configure
  // in the list of integrations...
  // How do we create default resources for integrations that are basically single resource?
  resourceSettings: zPgConfig.pick({databaseUrl: true}).extend({
    // gotta make sourceQueries a Textarea

    sourceQueries: z
      .object({
        invoice: z
          .string()
          .nullish()
          .describe('Should order by lastModifiedAt and id descending'),
      })
      // .nullish() does not translate well to jsonSchema
      // @see https://share.cleanshot.com/w0KVx1Y2
      .optional(),
  }),
  destinationInputEntity: zCast<EntityPayloadWithExternal>(),
  sourceOutputEntity: zCast<EntityPayloadWithExternal | ZCommon['Entity']>(),
  sourceState: z
    .object({
      invoice: z
        .object({
          lastModifiedAt: z.string().optional(),
          lastRowId: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
} satisfies IntegrationSchemas

export const postgresHelpers = intHelpers(postgresSchemas)

export const postgresDef = {
  name: 'postgres',
  metadata: {
    categories: ['database'],
    logoUrl: '/_assets/logo-postgres.png',
    stage: 'ga',
  },

  schemas: postgresSchemas,
  standardMappers: {
    resource: (_settings) => ({
      displayName: 'Postgres',
      status: 'healthy',
    }),
  },
} satisfies IntegrationDef<typeof postgresSchemas>

export default postgresDef
