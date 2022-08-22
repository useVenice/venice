import {zKVStore} from '@ledger-sync/core-sync'
import {JsonObject, zFunction} from '@ledger-sync/util'
import {makePostgresClient, zPgConfig} from './makePostgresClient'
import {MetaRead} from './schemas'

export const makePostgresKVStore = zFunction(
  zPgConfig,
  zKVStore,
  ({databaseUrl}) => {
    const {getPool, sql, upsertById} = makePostgresClient({databaseUrl})

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

    async function writeJson(id: string, data: JsonObject) {
      // Next: Handle patching json
      await upsertById('meta', id, {data})
    }

    // await migrator.migrateToLatest(pathToMigrationsFolder)
    return {
      get: readJson,
      list: listJson,
      set: (id, data) => writeJson(id, data as any),
    }
  },
)
