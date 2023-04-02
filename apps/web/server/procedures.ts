import '@usevenice/app-config/register.node'

import {
  backendEnv,
  makePostgresClient,
} from '@usevenice/app-config/backendConfig'
import type {NonEmptyArray} from '@usevenice/util'
import {makeUlid} from '@usevenice/util'

import type {Id} from '@usevenice/cdk-core'
import {makeId} from '@usevenice/cdk-core'
import {xPatAppMetadataKey} from '@usevenice/app-config/constants'

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

export async function ensureDefaultLedger(userId: string) {
  return runAsAdmin(async (trxn) => {
    const ids = await trxn.anyFirst<Id['reso']>(
      sql`SELECT id FROM resource WHERE creator_id = ${userId} AND provider_name = 'postgres'`,
    )
    console.log('[ensureDefaultLedger] ids', ids)
    if (ids.length > 0) {
      return ids as NonEmptyArray<Id['reso']>
    }
    const ledgerId = makeId('reso', 'postgres', userId)
    await trxn.query(
      sql`INSERT INTO resource (id, creator_id) VALUES (${ledgerId}, ${userId})`,
    )
    return [ledgerId] as NonEmptyArray<Id['reso']>
  })
}
