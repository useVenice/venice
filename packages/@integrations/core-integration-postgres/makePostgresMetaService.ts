import type {MetaService, MetaTable, ZRaw} from '@ledger-sync/cdk-core'
import {compact, memoize, zFunction} from '@ledger-sync/util'

import {makePostgresClient, zPgConfig} from './makePostgresClient'

const _getDeps = memoize((databaseUrl: string) =>
  makePostgresClient({databaseUrl}),
)
type Deps = ReturnType<typeof _getDeps>

function metaTable<TID extends string, T extends Record<string, unknown>>(
  tableName: keyof ZRaw,
  {sql, upsertById, getPool}: Deps,
): MetaTable<TID, T> {
  const table = sql.identifier([tableName])

  // TODO: Convert case from snake_case to camelCase
  return {
    list: ({ids, ledgerId, keywords, ...rest}) =>
      getPool().then((pool) => {
        const conditions = compact([
          ids && sql`id = ANY(${sql.array(ids, 'varchar')})`,
          ledgerId && sql`ledger_id = ${ledgerId}`,
          // Temp solution, shall use fts and make this work for any table...
          keywords &&
            tableName === 'institution' &&
            sql`standard->>'name' ILIKE ${'%' + keywords + '%'}`,
        ])
        const where =
          conditions.length > 0
            ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
            : sql``
        const limit = rest.limit ? sql`LIMIT ${rest.limit}` : sql``
        const offset = rest.offset ? sql`OFFSET ${rest.offset}` : sql``
        return pool.any(sql`SELECT * FROM ${table} ${where} ${limit} ${offset}`)
      }),
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

export const makePostgresMetaService = zFunction(
  zPgConfig.pick({databaseUrl: true}),
  ({databaseUrl}): MetaService => {
    const getTables = (): MetaService['tables'] => ({
      // Delay calling of __getDeps until later..
      connection: metaTable('connection', _getDeps(databaseUrl)),
      institution: metaTable('institution', _getDeps(databaseUrl)),
      integration: metaTable('integration', _getDeps(databaseUrl)),
      pipeline: metaTable('pipeline', _getDeps(databaseUrl)),
    })
    return {
      get tables() {
        return getTables()
      },
      searchInstitutions: (opts) =>
        getTables().institution.list({limit: 10, ...opts}),

      findPipelines: ({connectionId}) => {
        const {getPool, sql} = _getDeps(databaseUrl)
        return getPool().then((pool) =>
          pool.any(
            sql`SELECT * from pipeline where source_id = ${connectionId} OR destination_id =  ${connectionId}`,
          ),
        )
      },
    }
  },
)
