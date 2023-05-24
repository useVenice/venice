import '@usevenice/app-config/register.node'

import {
  backendEnv,
  makePostgresClient,
} from '@usevenice/app-config/backendConfig'
import {kApikeyMetadata} from '@usevenice/app-config/constants'
import {makeId} from '@usevenice/cdk-core'
import {makeUlid} from '@usevenice/util'

export const {getPool, sql} = makePostgresClient({
  databaseUrl: backendEnv.POSTGRES_OR_WEBHOOK_URL,
  transformFieldNames: false,
})

type DatabaseTransactionConnection = Parameters<
  Parameters<Awaited<ReturnType<typeof getPool>>['transaction']>[0]
>[0]

type TransactionFunction<T = unknown> = (
  conn: DatabaseTransactionConnection,
) => Promise<T>

/** TODO: create runAsAnon and runAsUser when ready @see https://share.cleanshot.com/bWFNwsWh */
export async function runAsAdmin<T>(fn: TransactionFunction<T>) {
  const pool = await getPool()
  return pool.transaction<T>(fn)
}

export async function ensurePersonalAccessToken(userId: string) {
  console.log('[ensurePersonalAccessToken] for', userId)

  return runAsAdmin(async (trxn) => {
    let pat = await trxn.maybeOneFirst<string>(sql`
      SELECT raw_app_meta_data ->> ${kApikeyMetadata} FROM auth.users
      WHERE id = ${userId} AND starts_with (raw_app_meta_data ->> ${kApikeyMetadata}, 'key_')
    `)

    if (!pat) {
      pat = `key_${makeUlid()}`
      await trxn.query(
        sql`
          UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data ||
            ${sql.jsonb({[kApikeyMetadata]: pat})}
          WHERE id = ${userId}
        `,
      )
    }
    return pat
  })
}

export async function ensureDefaultResourceAndPipelines(
  userId: string,
  /** Temporary, need to think where is the right abstraction for this  */
  options?: {heronIntegrationId?: string},
) {
  return runAsAdmin(async (trxn) => {
    const postgresResoId = '' // TODO: Get the current org postgres resource id and re-enable me once fixed...
    // Also need to think more clearly through orchestration
    if (options?.heronIntegrationId && postgresResoId) {
      await trxn
        .any<{direction: 'from_heron' | 'to_heron'}>(
          sql`
            SELECT
              r.id AS resource_id,
              p.id AS pipeline_id,
              CASE WHEN r.id = p.source_id THEN
                'from_heron'
              ELSE
                'to_heron'
              END AS "direction"
            FROM
              resource r
              LEFT JOIN pipeline p ON (r.id = p.source_id
                  OR r.id = p.destination_id)
            WHERE
              r.end_user_id = ${userId}
              AND r.provider_name = 'heron'
          `,
        )
        .then(async (rows) => {
          const heronResoId = makeId('reso', 'heron', userId)

          if (!rows.length) {
            await trxn.query(
              sql`INSERT INTO resource (id, end_user_id) VALUES (${heronResoId}, ${userId})`,
            )
          }
          if (!rows.some((r) => r.direction === 'from_heron')) {
            await trxn.query(
              sql`INSERT INTO pipeline (id, source_id, destination_id) VALUES (${makeId(
                'pipe',
                'heron_source_' + userId,
              )}, ${heronResoId}, ${postgresResoId})`,
            )
          }
          if (!rows.some((r) => r.direction === 'to_heron')) {
            await trxn.query(
              sql`INSERT INTO pipeline (id, source_id, destination_id) VALUES (${makeId(
                'pipe',
                'heron_destination_' + userId,
              )}, ${postgresResoId}, ${heronResoId})`,
            )
          }
        })
    }
  })
}
