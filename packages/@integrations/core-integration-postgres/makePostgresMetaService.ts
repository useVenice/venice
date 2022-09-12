import type {
  LedgerIdResultRow,
  MetaService,
  MetaTable,
  ZRaw,
} from '@ledger-sync/cdk-core'
import {compact, memoize, zFunction} from '@ledger-sync/util'

import {
  applyLimitOffset,
  makePostgresClient,
  zPgConfig,
} from './makePostgresClient'

const _getDeps = memoize((databaseUrl: string) =>
  makePostgresClient({databaseUrl}),
)
type Deps = ReturnType<typeof _getDeps>

function metaTable<TID extends string, T extends Record<string, unknown>>(
  tableName: keyof ZRaw,
  {sql, upsertById, getPool}: Deps,
): MetaTable<TID, T> {
  const table = sql.identifier([tableName])

  //  const sqlType = sql.type(zRaw[tableName])

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
        return pool.any(
          applyLimitOffset(sql`SELECT * FROM ${table} ${where}`, rest),
        )
      }),
    get: (id) =>
      getPool().then((pool) =>
        pool.maybeOne<T>(sql`SELECT * FROM ${table} where id = ${id}`),
      ),
    set: (id, data) => upsertById(tableName, {...data, id}),
    patch: (id, data) =>
      upsertById(tableName, {...data, id}, {mergeJson: 'shallow'}),
    delete: (id) =>
      getPool()
        .then((pool) => pool.query(sql`DELETE FROM ${table} WHERE id = ${id}`))
        .then(() => {}),
  }
}

export const makePostgresMetaService = zFunction(
  zPgConfig.pick({databaseUrl: true}),
  ({databaseUrl}): MetaService => {
    const tables: MetaService['tables'] = {
      // Delay calling of __getDeps until later..
      connection: metaTable('connection', _getDeps(databaseUrl)),
      institution: metaTable('institution', _getDeps(databaseUrl)),
      integration: metaTable('integration', _getDeps(databaseUrl)),
      pipeline: metaTable('pipeline', _getDeps(databaseUrl)),
    }
    return {
      tables,
      searchLedgerIds: ({keywords, ...rest}) => {
        const {getPool, sql} = _getDeps(databaseUrl)
        const where = keywords
          ? sql`WHERE ledger_id ILIKE ${'%' + keywords + '%'}`
          : sql``
        const query = applyLimitOffset(
          sql`
            SELECT
              ledger_id as id,
              count(*) AS connection_count,
              min(created_at) AS first_created_at,
              max(updated_at) AS last_updated_at
            FROM
              connection
            ${where}
            GROUP BY ledger_id
          `,
          rest,
        )
        return getPool().then((pool) => pool.any<LedgerIdResultRow>(query))
      },
      searchInstitutions: ({keywords, providerNames, ...rest}) => {
        const {getPool, sql} = _getDeps(databaseUrl)
        const conditions = compact([
          // TODO: Generate provider_name column in postgres and index it
          providerNames &&
            sql`split_part(id, '_', 2) = ANY(${sql.array(
              providerNames,
              'varchar',
            )})`,
          keywords && sql`standard->>'name' ILIKE ${'%' + keywords + '%'}`,
        ])
        const where =
          conditions.length > 0
            ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
            : sql``
        return getPool().then((pool) =>
          pool.any(
            applyLimitOffset(sql`SELECT * FROM institution ${where}`, rest),
          ),
        )
      },

      findPipelines: ({connectionIds}) => {
        const {getPool, sql} = _getDeps(databaseUrl)
        const ids = sql.array(connectionIds, 'varchar')
        return getPool().then((pool) =>
          pool.any(sql`
            SELECT * FROM pipeline
            WHERE source_id = ANY(${ids}) OR destination_id = ANY(${ids})
          `),
        )
      },
    }
  },
)
