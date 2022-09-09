import type {MetaService, MetaTable} from '@ledger-sync/cdk-core'
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
      // Perhaps this should just be searchInstitutions? And when there are no terms
      // passed to search it becomes by default listing top ones...
      listTopInstitutions: () => getTables().institution.list({limit: 10}),
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
