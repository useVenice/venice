import {z} from 'zod'
import type {MetaBase, MetaTable} from '@ledger-sync/cdk-core'
import {zKVStore} from '@ledger-sync/cdk-core'
import type {JsonObject} from '@ledger-sync/util'
import {zCast} from '@ledger-sync/util'
import {memoize, zFunction} from '@ledger-sync/util'
import {makePostgresClient, zPgConfig} from './makePostgresClient'
import {MetaRead} from './schemas'

const _getDeps = memoize((databaseUrl: string) => {
  const client = makePostgresClient({databaseUrl})
  const sqlMeta = client.sql.type(MetaRead)
  const ret = {...client, sqlMeta}
  return ret
})
type Deps = ReturnType<typeof _getDeps>

function metaTable<TID extends string, T extends Record<string, unknown>>(
  tableName: string,
  {sql, upsertById, getPool}: Deps,
): MetaTable<TID, T> {
  const table = sql.identifier([tableName])

  // TODO: Convert case from snake_case to camelCase
  return {
    list: (_args) =>
      getPool().then((pool) => pool.any(sql`SELECT * FROM ${table}`)),
    get: (id) =>
      getPool().then((pool) =>
        pool.maybeOne<T>(sql`SELECT * FROM ${table} where id = ${id}`),
      ),
    set: (id, data) => upsertById(tableName, id, data),
    delete: (id) =>
      getPool()
        .then((pool) => pool.query(sql`DELETE FROM ${table} WHERE id = ${id}`))
        .then(() => {}),
  }
}

export const makePostgresMetabase = zFunction(
  zPgConfig.pick({databaseUrl: true}),
  zCast<MetaBase>(),
  ({databaseUrl}) => ({
    connection: metaTable('connection', _getDeps(databaseUrl)),
    institution: metaTable('institution', _getDeps(databaseUrl)),
    integration: metaTable('integration', _getDeps(databaseUrl)),
    pipeline: metaTable('pipeline', _getDeps(databaseUrl)),
  }),
)

export const makePostgresKVStore = zFunction(
  zPgConfig.pick({databaseUrl: true}),
  zKVStore,
  ({databaseUrl}) => {
    // We are memoizing twice with getPool. Is is the right pattern?
    const getDeps = () => _getDeps(databaseUrl)

    // async function cleanup() {
    //   await db.destroy()
    // }

    const readJson = zFunction(z.string(), async function (id: string) {
      const {getPool, sqlMeta} = getDeps()
      const pool = await getPool()
      return pool
        .maybeOne(sqlMeta`SELECT * FROM meta where id = ${id}`)
        .then((r) => r?.data as Record<string, unknown>)
    })

    async function listJson() {
      const {getPool, sqlMeta} = getDeps()
      const pool = await getPool()
      return pool
        .any(sqlMeta`SELECT * FROM meta order by created_at asc limit 100`) // @deprecated...
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
