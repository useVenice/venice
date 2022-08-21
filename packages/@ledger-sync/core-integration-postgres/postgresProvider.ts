import {
  AnyEntityPayload,
  handlersLink,
  makeSyncProvider,
} from '@ledger-sync/core-sync'
import {z, zCast} from '@ledger-sync/util'
import {makePostgresClient, zPgConfig} from './makePostgresClient'

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('postgres'),
  connectionSettings: zPgConfig,
  destinationInputEntity: zCast<AnyEntityPayload>(),
})

export const postgresProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def,
  destinationSync: ({settings: {databaseUrl}}) => {
    const [getPool, sql] = makePostgresClient({databaseUrl})
    return handlersLink({
      data: async (op) => {
        const {
          data: {id, entityName, entity},
        } = op
        const pool = await getPool()
        const table = sql.identifier([entityName])
        await pool.query(sql`
INSERT INTO ${table} (id, data, updated_at)
VALUES (${id}, ${sql.jsonb(entity as any)}, now())
ON CONFLICT (id) DO UPDATE SET
  data = excluded.data,
  id = excluded.id,
  updated_at = excluded.updated_at
WHERE ${table}.data IS DISTINCT FROM excluded.data
`)
        return op
      },
    })
  },
})
