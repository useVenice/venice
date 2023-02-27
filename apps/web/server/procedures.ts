import '@usevenice/app-config/register.node'

import {
  backendEnv,
  makePostgresClient,
} from '@usevenice/app-config/backendConfig'
import type {NonEmptyArray} from '@usevenice/util'
import {makeUlid} from '@usevenice/util'

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

export async function runAsAdmin<T>(fn: TransactionFunction<T>) {
  const pool = await getPool()
  return pool.transaction<T>(fn)
}

export const dbUser = (userId: string) => sql.identifier([`usr_${userId}`])

export async function runAsUser<T>(userId: string, fn: TransactionFunction<T>) {
  const pool = await getPool()
  const usr = dbUser(userId)
  return pool.transaction(async (trxn) => {
    await trxn.query(sql`SET ROLE ${usr}`)
    const res = await fn(trxn)
    await trxn.query(sql`RESET ROLE`)
    return res
  })
}

export async function dropDbUser(userId: string) {
  const usr = dbUser(userId)
  await runAsAdmin(async (trxn) => {
    await trxn.query(
      sql`REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM ${usr}`,
    )
    await trxn.query(sql`REVOKE USAGE ON SCHEMA public FROM ${usr}`)
    await trxn.query(sql`DROP USER ${usr}`)
    await trxn.query(
      sql`UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data - 'apiKey' WHERE id = ${userId}`,
    )
  })
}

export async function ensureDatabaseUser(userId: string) {
  console.log('[ensureDatabaseUser] for', userId)

  return runAsAdmin(async (trxn) => {
    const username = `usr_${userId}`
    // eslint-disable-next-line prefer-const
    let [apiKey, pgUserExists] = await Promise.all([
      trxn.maybeOneFirst<string>(sql`
        SELECT
          raw_user_meta_data ->> 'apiKey'
        FROM
          auth.users
        WHERE
          id = ${userId}
          AND starts_with (raw_user_meta_data ->> 'apiKey', 'key_')
      `),
      trxn.oneFirst<boolean>(
        sql`SELECT EXISTS (SELECT 1 FROM pg_user WHERE usename = ${username})`,
      ),
    ])
    // TODO: Maybe also check for existance of user too? Although it's a bit tricky because
    // we would also need to recursively check that all the permissions are correct on said user
    // better to re-create more proactively, to delete user simply delete the apiKey
    // but that still has an issue where the old databaseUrl will continue to work until
    // ensureDatabaseUser gets called
    const adminUrl = new URL(backendEnv.POSTGRES_OR_WEBHOOK_URL)
    const getUrl = () =>
      `${adminUrl.protocol}//${username}:${apiKey}@${adminUrl.hostname}:${adminUrl.port}${adminUrl.pathname}`
    if (apiKey && pgUserExists) {
      // console.log('UNSAFE_DEBUG_DATABASE_URL', {databaseUrl: getUrl()})
      return {usr: username, apiKey, databaseUrl: getUrl()}
    }

    const usr = sql.identifier([username])

    apiKey = `key_${makeUlid()}`
    // Proactively drop so we can recreate,
    // todo: Differentiate between user not existing error vs other error
    await dropDbUser(userId).catch(() => null)

    await trxn.query(
      sql`CREATE USER ${usr} PASSWORD ${sql.literalValue(apiKey)}`,
    )
    await trxn.query(
      sql`GRANT ${usr} TO ${sql.identifier([adminUrl.username])}`,
    )
    await trxn.query(sql`GRANT USAGE ON SCHEMA public TO ${usr}`)
    await trxn.query(
      sql`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${usr}`,
    )
    await trxn.query(
      sql`REVOKE ALL PRIVILEGES ON public.migrations FROM ${usr}`,
    )
    await trxn.query(
      sql`REVOKE ALL PRIVILEGES ON public.integration FROM ${usr}`,
    )
    await trxn.query(
      sql`UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || ${sql.jsonb(
        {apiKey},
      )} WHERE id = ${userId}`,
    )
    const databaseUrl = getUrl()
    // console.log('UNSAFE_DEBUG_DATABASE_URL', {databaseUrl})
    return {usr, apiKey, databaseUrl}
  })
}

export async function ensurePersonalAccessToken(userId: string) {
  console.log('[ensurePersonalAccessToken] for', userId)

  return runAsAdmin(async (trxn) => {
    let pat = await trxn.maybeOneFirst<string>(sql`
      SELECT raw_user_meta_data ->> 'apiKey' FROM auth.users
      WHERE id = ${userId} AND starts_with (raw_user_meta_data ->> 'apiKey', 'key_')
    `)

    if (!pat) {
      pat = `key_${makeUlid()}`
      await trxn.query(
        sql`
          UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data ||
            ${sql.jsonb({apiKey: pat})}
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

export async function getDatabaseInfo(userId: string) {
  const info = await ensureDatabaseUser(userId)
  return runAsUser(userId, async (trxn) => {
    const tables = await trxn.any<{table_name: string; table_type: string}>(
      sql`
        SELECT
          "table_name",
          table_type
        FROM
          information_schema.tables
        WHERE
          table_schema = 'public'
        ORDER BY
          table_type DESC,
          "table_name"
      `,
    )
    return {...info, tables}
  })
}

// TODO: Sync roles with users, and reset to latest permissions, ensure this is sync'ed with ensureDatabaseUser
export async function autoRepairRoles() {
  await runAsAdmin((trxn) =>
    trxn.query(
      sql`
        DO $$
          DECLARE
            ele record;
          BEGIN
            FOR ele IN
            SELECT
              usename
            FROM
              pg_user
            WHERE
              starts_with (usename, 'usr_')
              LOOP
                EXECUTE format('
        GRANT %I to postgres;
        GRANT SELECT, UPDATE, DELETE ON public.transaction, public.posting TO %I;
          ', ele.usename, ele.usename);
              END LOOP;
          END;
          $$;
      `,
    ),
  )
}
