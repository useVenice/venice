import type {
  EndUserResultRow,
  Id,
  MetaService,
  MetaTable,
  Viewer,
  ZRaw,
} from '@usevenice/cdk-core'
import {zViewer} from '@usevenice/cdk-core'
import {R, memoize, zFunction} from '@usevenice/util'

import type {TransactionFunction} from 'slonik/dist/src/types'
import {
  applyLimitOffset,
  makePostgresClient,
  zPgConfig,
} from './makePostgresClient'

const getPostgreClient = memoize((databaseUrl: string) =>
  makePostgresClient({databaseUrl}),
)

/** This determines the identity that gets used for every request to db! So be very careful */
function localGucForViewer(viewer: Viewer) {
  switch (viewer.role) {
    case 'anon':
      return {role: 'anon'}
    case 'user':
      return {role: 'authenticated', 'request.jwt.claim.sub': viewer.userId}
    case 'end_user':
      return {
        role: 'end_user',
        'endUser.id': viewer.endUserId,
        'endUser.workspaceId': viewer.workspaceId,
      }
    case 'workspace':
      return {role: 'workspace', 'workspace.id': viewer.workspaceId}
    case 'system':
      return {}
    default:
      throw new Error(`Unknown viewer role: ${(viewer as Viewer).role}`)
  }
}

type Deps = ReturnType<typeof _getDeps>
const _getDeps = (opts: {databaseUrl: string; viewer: Viewer}) => {
  const {viewer, databaseUrl} = opts
  const client = getPostgreClient(databaseUrl)
  const {sql, getPool} = client
  return {
    ...client,
    runQueries: async <T>(handler: TransactionFunction<T>) => {
      const pool = await getPool()
      return pool.transaction(async (trxn) => {
        for (const [key, value] of Object.entries(localGucForViewer(viewer))) {
          await trxn.query(sql`SELECT set_config(${key}, ${value}, true)`)
        }
        return handler(trxn)
      })
    },
  }
}

export const makePostgresMetaService = zFunction(
  zPgConfig.pick({databaseUrl: true}).extend({viewer: zViewer}),
  (opts): MetaService => {
    const tables: MetaService['tables'] = {
      // Delay calling of __getDeps until later..
      workspace: metaTable('workspace', _getDeps(opts)),
      workspaceMember: metaTable('workspaceMember', _getDeps(opts)),
      resource: metaTable('resource', _getDeps(opts)),
      institution: metaTable('institution', _getDeps(opts)),
      integration: metaTable('integration', _getDeps(opts)),
      pipeline: metaTable('pipeline', _getDeps(opts)),
    }
    return {
      tables,
      searchEndUsers: ({keywords, ...rest}) => {
        const {runQueries, sql} = _getDeps(opts)
        const where = keywords
          ? sql`WHERE end_user_id ILIKE ${'%' + keywords + '%'}`
          : sql``
        const query = applyLimitOffset(
          sql`
            SELECT
              end_user_id as id,
              count(*) AS resource_count,
              min(created_at) AS first_created_at,
              max(updated_at) AS last_updated_at
            FROM
              resource
            ${where}
            GROUP BY end_user_id
          `,
          rest,
        )
        return runQueries((pool) => pool.any<EndUserResultRow>(query))
      },
      searchInstitutions: ({keywords, providerNames, ...rest}) => {
        const {runQueries, sql} = _getDeps(opts)
        const conditions = R.compact([
          providerNames &&
            sql`provider_name = ANY(${sql.array(providerNames, 'varchar')})`,
          keywords && sql`standard->>'name' ILIKE ${'%' + keywords + '%'}`,
        ])
        const where =
          conditions.length > 0
            ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
            : sql``
        return runQueries((pool) =>
          pool.any(
            applyLimitOffset(sql`SELECT * FROM institution ${where}`, rest),
          ),
        )
      },

      findPipelines: ({resourceIds, secondsSinceLastSync}) => {
        const {runQueries, sql} = _getDeps(opts)
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
        return runQueries((pool) =>
          pool.any(sql`SELECT * FROM pipeline ${where}`),
        )
      },
      listIntegrationIds: () => {
        const {runQueries, sql} = _getDeps(opts)
        return runQueries((pool) =>
          pool.anyFirst<Id['int']>(sql`SELECT id FROM integration`),
        )
      },
    }
  },
)

function metaTable<TID extends string, T extends Record<string, unknown>>(
  tableName: keyof ZRaw,
  {sql, upsertById, runQueries}: Deps,
): MetaTable<TID, T> {
  const table = sql.identifier([tableName])

  //  const sqlType = sql.type(zRaw[tableName])

  // TODO: Convert case from snake_case to camelCase
  return {
    list: ({ids, endUserId, keywords, ...rest}) =>
      runQueries((pool) => {
        const conditions = R.compact([
          ids && sql`id = ANY(${sql.array(ids, 'varchar')})`,
          endUserId && sql`end_user_id = ${endUserId}`,
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
      runQueries((pool) =>
        pool.maybeOne<T>(sql`SELECT * FROM ${table} where id = ${id}`),
      ),
    set: (id, data) => upsertById(tableName, {...data, id}),
    patch: (id, data) =>
      upsertById(tableName, {...data, id}, {mergeJson: 'shallow'}),
    delete: (id) =>
      runQueries((pool) =>
        pool.query(sql`DELETE FROM ${table} WHERE id = ${id}`),
      ).then(() => {}),
  }
}
