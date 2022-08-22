import {
  makePostgresClient,
  zPgConfig,
} from '@ledger-sync/core-integration-postgres'
import {handlersLink, makeSyncProvider} from '@ledger-sync/core-sync'
import type {EntityPayloadWithExternal} from '@ledger-sync/ledger-sync'
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
    const {sql, upsertById} = makePostgresClient({
      databaseUrl,
      migrationsPath: __dirname + '/migrations',
      migrationTableName: 'ls_migrations',
    })
    return handlersLink({
      data: async (op) => {
        const {
          data: {id, entityName, providerName, connectionId = null, ...data},
        } = op
        await upsertById(entityName, id, {
          standard: sql.jsonb(data.entity as any),
          external: sql.jsonb(data.external as any),
          provider_name: providerName,
          connection_id: connectionId,
        })
        return op
      },
    })
  },
})
