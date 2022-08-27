import {handlersLink, makeSyncProvider} from '@ledger-sync/cdk-core'
import type {EntityPayloadWithExternal} from '@ledger-sync/cdk-ledger'
import {
  makePostgresClient,
  zPgConfig,
} from '@ledger-sync/core-integration-postgres'
import {z, zCast} from '@ledger-sync/util'

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('postgres'),
  connectionSettings: zPgConfig.pick({databaseUrl: true}),
  destinationInputEntity: zCast<EntityPayloadWithExternal>(),
})

export const postgresProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def,
  destinationSync: ({settings: {databaseUrl}}) => {
    console.log('Will makePostgresClient', {
      databaseUrl,
      migrationsPath: __dirname + '/migrations',
    })
    const {upsertById} = makePostgresClient({
      databaseUrl,
      migrationsPath: __dirname + '/migrations',
      migrationTableName: 'ls_migrations',
    })
    return handlersLink({
      data: async (op) => {
        const {
          data: {id, entityName, providerName, sourceId = null, ...data},
        } = op
        await upsertById(entityName, id, {
          standard: data.entity,
          external: data.external,
          source_id: sourceId,
          // Do we still need provider_name in the presence of source_id?
          provider_name: providerName,
        })
        return op
      },
    })
  },
})
