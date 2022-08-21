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
    const [getPool, sql] = makePostgresClient({
      databaseUrl,
      migrationsPath: __dirname + '/migrations',
      migrationTableName: 'ls_migrations',
    })
    return handlersLink({
      data: async (op) => {
        const {
          data: {id, entityName, providerName, connectionId, ...data},
        } = op
        const pool = await getPool()
        const table = sql.identifier([entityName])
        const standard = sql.jsonb(data.entity as any)
        const external = sql.jsonb(data.external as any)
        await pool.query(sql`
INSERT INTO ${table} (id, standard, external, updated_at)
VALUES (${id}, ${standard}, ${external}, now())
ON CONFLICT (id) DO UPDATE SET
  standard = excluded.standard,
  external = excluded.external,
  id = excluded.id,
  updated_at = excluded.updated_at
WHERE ${table}.standard IS DISTINCT FROM excluded.standard
  OR ${table}.external IS DISTINCT FROM excluded.external
`)
        return op
      },
    })
  },
})
