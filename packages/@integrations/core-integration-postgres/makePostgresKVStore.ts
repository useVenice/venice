import {zKVStore} from '@ledger-sync/cdk-core'
import {JsonObject, memoize, zFunction} from '@ledger-sync/util'
import {makePostgresClient, zPgConfig} from './makePostgresClient'
import {MetaRead} from './schemas'

export const makePostgresKVStore = zFunction(
  zPgConfig,
  zKVStore,
  ({databaseUrl}) => {
    // We are memoizing twice with getPool. Is is the right pattern?
    const getDeps = memoize(() => {
      const client = makePostgresClient({databaseUrl})
      const sqlMeta = client.sql.type(MetaRead)
      const ret = {...client, sqlMeta}
      return ret
    })

    // async function cleanup() {
    //   await db.destroy()
    // }

    async function readJson(id: string) {
      const {getPool, sqlMeta} = getDeps()
      const pool = await getPool()
      return pool
        .maybeOneFirst(sqlMeta`SELECT data FROM meta where id = ${id}`)
        .then((r) => r as Record<string, unknown>)
    }
    async function listJson() {
      const {getPool, sqlMeta} = getDeps()
      const pool = await getPool()
      return pool
        .any(sqlMeta`SELECT id, data FROM meta`)
        .then((rows) =>
          rows.map((r) => [r.id, r.data as Record<string, unknown>] as const),
        )
    }

    async function writeJson(id: string, data: JsonObject) {
      const {upsertById} = getDeps()
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
