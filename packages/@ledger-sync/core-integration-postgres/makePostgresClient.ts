import {defineProxyFn, memoize, R, z, zFunction} from '@ledger-sync/util'
import {SlonikMigrator} from '@slonik/migrator'
import {createInterceptors} from 'slonik-interceptor-preset'

export const $slonik = defineProxyFn<() => typeof import('slonik')>('slonik')

export const zPgConfig = z.object({
  databaseUrl: z.string(),
  migrationsPath: z.string().optional(),
  migrationTableName: z.string().optional(),
})

export const makePostgresClient = zFunction(
  zPgConfig,
  ({databaseUrl, migrationsPath, migrationTableName}) => {
    const {createPool, sql} = $slonik()
    const getPool = memoize(
      async () => {
        const pool = await createPool(databaseUrl, {
          interceptors: createInterceptors({
            logQueries: true, // TODO: Use roar-cli to make things better
            normaliseQueries: true,
            transformFieldNames: false,
            benchmarkQueries: false,
          }),
          statementTimeout: 'DISABLE_TIMEOUT', // Not supported by pgBouncer
          idleInTransactionSessionTimeout: 'DISABLE_TIMEOUT', // Not supported by pgBouncer
          maximumPoolSize: 10,
          // Should lower this on cloud functions, which scales by processes. Though this
          // is unlikely to be an issue as the only function using this for the moment is only handling
          // one document at a time...
          connectionTimeout: 60 * 1000, // Long timeout
        })
        console.log('Will migrate with', {migrationsPath})
        const migrator = new SlonikMigrator({
          migrationsPath: migrationsPath ?? __dirname + '/migrations',
          migrationTableName: migrationTableName ?? 'migrations',
          slonik: pool,
          logger: console,
        })
        await migrator.up()
        return pool
      },
      {isPromise: true},
    )

    async function upsertById(...args: Parameters<typeof upsertByIdQuery>) {
      const pool = await getPool()
      const query = upsertByIdQuery(...args)
      await pool.query(query)
    }
    return {getPool, sql, upsertById}
  },
)

export function upsertByIdQuery(
  tableName: string,
  id: string,
  valueMap: Record<string, unknown>,
) {
  const {sql} = $slonik()
  const table = sql.identifier([tableName])
  const [cols, vals] = R.pipe(
    {...valueMap, updated_at: sql.literalValue('now()')},
    R.toPairs,
    R.map(([k, v]) => ({key: sql.identifier([k]), value: v})),
    (pairs) => [pairs.map((p) => p.key), pairs.map((p) => p.value)] as const,
  )
  const comma = sql`, `
  const equal = sql` = `
  const distinct = sql` IS DISTINCT FROM `

  const query = sql`
    INSERT INTO ${table} (id, ${sql.join(cols, comma)})
    VALUES (${id}, ${sql.join(vals, comma)})
    ON CONFLICT (id) DO UPDATE SET
      ${sql.join(
        cols.map((c) => sql.join([c, sql`excluded.${c}`], equal)),
        sql`, \n`,
      )}
    WHERE
      ${sql.join(
        cols
          .filter((c) => !c.names.includes('updated_at'))
          .map((c) =>
            sql.join([sql`${table}.${c}`, sql`excluded.${c}`], distinct),
          ),
        sql` OR \n`,
      )};
  `
  return query
}
