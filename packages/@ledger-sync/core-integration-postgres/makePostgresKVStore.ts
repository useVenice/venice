import {zKVStore} from '@ledger-sync/core-sync'
import {JsonObject, zFunction} from '@ledger-sync/util'
import {makePostgresClient, zPgConfig} from './makePostgresClient'
import {MetaRead} from './schemas'

export const makePostgresKVStore = zFunction(
  zPgConfig,
  zKVStore,
  ({databaseUrl}) => {
    const [getPool, sql] = makePostgresClient({databaseUrl})

    // async function cleanup() {
    //   await db.destroy()
    // }

    const sqlMeta = sql.type(MetaRead)

    async function readJson(id: string) {
      const pool = await getPool()
      return pool
        .maybeOneFirst(sqlMeta`SELECT data FROM meta where id = ${id}`)
        .then((r) => r as Record<string, unknown>)
    }
    async function listJson() {
      const pool = await getPool()
      return pool
        .many(sqlMeta`SELECT id, data FROM meta`)
        .then((rows) =>
          rows.map((r) => [r.id, r.data as Record<string, unknown>] as const),
        )
    }
    /**
     * https://blog.sequin.io/airtable-sync-process/
     * insert into public.products (id,created_time,name,size,color)
     * values $1, $2, $3, $4, $5
     * on conflict (id) do update set
     * id=excluded.id, created_time=excluded.created_time, name=excluded.name, size=excluded.size, color=excluded.color
     * where (created_time, name, size, color) is distinct from (excluded.created_time, excluded.name, excluded.size, excluded.color)
     */
    async function writeJson(id: string, data: JsonObject) {
      const pool = await getPool()
      // Next: Handle patching json
      await pool.query(sql`
        INSERT INTO meta (id, data, updated_at)
        VALUES (${id}, ${sql.jsonb(data)}, now())
        ON CONFLICT (id) DO UPDATE SET
          data = excluded.data,
          id = excluded.id,
          updated_at = excluded.updated_at
        WHERE meta.data IS DISTINCT FROM excluded.data
      `)
    }

    // await migrator.migrateToLatest(pathToMigrationsFolder)
    return {
      get: readJson,
      list: listJson,
      set: (id, data) => writeJson(id, data as any),
    }
  },
)
