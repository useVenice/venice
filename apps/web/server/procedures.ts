import '@usevenice/app-config/register.node'

import {
  backendEnv,
  makePostgresClient,
} from '@usevenice/app-config/backendConfig'
import type {NonEmptyArray} from '@usevenice/util'
import {makeUlid} from '@usevenice/util'

import {xPatAppMetadataKey} from '@usevenice/app-config/constants'
import type {Id} from '@usevenice/cdk-core'
import {makeId} from '@usevenice/cdk-core'

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
      SELECT raw_app_meta_data ->> ${xPatAppMetadataKey} FROM auth.users
      WHERE id = ${userId} AND starts_with (raw_app_meta_data ->> ${xPatAppMetadataKey}, 'key_')
    `)

    if (!pat) {
      pat = `key_${makeUlid()}`
      await trxn.query(
        sql`
          UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data ||
            ${sql.jsonb({[xPatAppMetadataKey]: pat})}
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
    const postgresResoIds = await trxn
      .anyFirst<Id['reso']>(
        sql`SELECT id FROM resource WHERE creator_id = ${userId} AND provider_name = 'postgres'`,
      )
      .then(async (ids) => {
        if (ids.length > 0) {
          return ids as NonEmptyArray<Id['reso']>
        }
        const ledgerId = makeId('reso', 'postgres', userId)
        await trxn.query(
          sql`INSERT INTO resource (id, creator_id) VALUES (${ledgerId}, ${userId})`,
        )
        return [ledgerId] as NonEmptyArray<Id['reso']>
      })
    if (options?.heronIntegrationId) {
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
              r.creator_id = ${userId}
              AND r.provider_name = 'heron'
          `,
        )
        .then(async (rows) => {
          const heronResoId = makeId('reso', 'heron', userId)
          console.log('rows', rows)

          if (!rows.length) {
            await trxn.query(
              sql`INSERT INTO resource (id, creator_id) VALUES (${heronResoId}, ${userId})`,
            )
          }
          if (!rows.some((r) => r.direction === 'from_heron')) {
            await trxn.query(
              sql`INSERT INTO pipeline (id, source_id, destination_id) VALUES (${makeId(
                'pipe',
                'heron_source_' + userId,
              )}, ${heronResoId}, ${postgresResoIds[0]})`,
            )
          }
          if (!rows.some((r) => r.direction === 'to_heron')) {
            await trxn.query(
              sql`INSERT INTO pipeline (id, source_id, destination_id) VALUES (${makeId(
                'pipe',
                'heron_destination_' + userId,
              )}, ${postgresResoIds[0]}, ${heronResoId})`,
            )
          }
        })
    }
    return postgresResoIds
  })
}
