import type {
  CreatorIdResultRow,
  MetaService,
  MetaTable,
  ZRaw,
} from '@usevenice/cdk-core'
import {memoize, R, zFunction} from '@usevenice/util'

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
    list: ({ids, creatorId, keywords, ...rest}) =>
      getPool().then((pool) => {
        const conditions = R.compact([
          ids && sql`id = ANY(${sql.array(ids, 'varchar')})`,
          creatorId && sql`creator_id = ${creatorId}`,
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
      institution: metaTable('institution', _getDeps(databaseUrl)),
      integration: metaTable('integration', _getDeps(databaseUrl)),
      // Go into airbyte
      resource: metaTable('resource', _getDeps(databaseUrl)),
      pipeline: metaTable('pipeline', _getDeps(databaseUrl)),
    }
    return {
      tables,
      searchCreatorIds: ({keywords, ...rest}) => {
        const {getPool, sql} = _getDeps(databaseUrl)
        const where = keywords
          ? sql`WHERE creator_id ILIKE ${'%' + keywords + '%'}`
          : sql``
        const query = applyLimitOffset(
          sql`
            SELECT
              creator_id as id,
              count(*) AS resource_count,
              min(created_at) AS first_created_at,
              max(updated_at) AS last_updated_at
            FROM
              resource
            ${where}
            GROUP BY creator_id
          `,
          rest,
        )
        return getPool().then((pool) => pool.any<CreatorIdResultRow>(query))
      },
      searchInstitutions: ({keywords, providerNames, ...rest}) => {
        const {getPool, sql} = _getDeps(databaseUrl)
        const conditions = R.compact([
          providerNames &&
            sql`provider_name = ANY(${sql.array(providerNames, 'varchar')})`,
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

      findPipelines: ({resourceIds, secondsSinceLastSync}) => {
        const {getPool, sql} = _getDeps(databaseUrl)
        const ids = resourceIds && sql.array(resourceIds, 'varchar')
        const conditions = R.compact([
          ids && sql`(source_id = ANY(${ids}) OR destination_id = ANY(${ids}))`,
          secondsSinceLastSync &&
            sql`
              (now() - COALESCE(last_sync_completed_at, to_timestamp(0)))
              >= (interval '1 second' * ${secondsSinceLastSync})
            `,
        ])
        const where =
          conditions.length > 0
            ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
            : sql``
        return getPool().then((pool) =>
          pool.any(sql`SELECT * FROM pipeline ${where}`),
        )
      },
    }
  },
)
