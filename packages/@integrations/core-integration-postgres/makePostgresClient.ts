import {createInterceptors} from 'slonik-interceptor-preset'
import type {PrimitiveValueExpression} from 'slonik/dist/src/types'

import type {MaybeArray} from '@ledger-sync/util'
import {
  defineProxyFn,
  fromMaybeArray,
  isPlainObject,
  memoize,
  R,
  snakeCase,
  z,
  zFunction,
} from '@ledger-sync/util'

export const $slonik = defineProxyFn<() => typeof import('slonik')>('slonik')
export const $slonikMigrator =
  defineProxyFn<() => typeof import('@slonik/migrator')>('@slonik/migrator')

export const zPgConfig = z.object({
  databaseUrl: z.string(),
  migrationsPath: z.string().optional(),
  migrationTableName: z.string().optional(),
  runMigration: z.boolean().optional(),
})

export const makePostgresClient = zFunction(
  zPgConfig,
  ({databaseUrl, migrationsPath, migrationTableName, runMigration}) => {
    const {createPool, sql, createTypeParserPreset} = $slonik()
    const {SlonikMigrator} = $slonikMigrator()
    const getPool = memoize(
      async () => {
        const pool = await createPool(databaseUrl, {
          interceptors: createInterceptors({
            logQueries: true, // TODO: Use roarr-cli to make things better
            normaliseQueries: true,
            // Inverse of what we are doing in `upsertByIdQuery` method
            // This is not guaranteed to work so very important to have extra validation on top of
            // the field values returned
            transformFieldNames: true,
            benchmarkQueries: false,
          }),
          statementTimeout: 'DISABLE_TIMEOUT', // Not supported by pgBouncer
          idleInTransactionSessionTimeout: 'DISABLE_TIMEOUT', // Not supported by pgBouncer
          maximumPoolSize: 10,
          // Should lower this on cloud functions, which scales by processes. Though this
          // is unlikely to be an issue as the only function using this for the moment is only handling
          // one document at a time...
          connectionTimeout: 60 * 1000, // Long timeout
          typeParsers: [
            ...createTypeParserPreset(),
            // Default slonik parsers aren't great.
            // and parses timestamptz into a number
            // https://share.cleanshot.com/5Dqx8C
            // Until we update typegen we are gonna treat timestamp
            // as string
            {
              name: 'timestamptz',
              parse: (d) => new Date(d).toISOString(),
            },
          ],
        })
        if (runMigration) {
          console.log('Will migrate with', {migrationsPath})
          const migrator = new SlonikMigrator({
            migrationsPath: migrationsPath ?? __dirname + '/migrations',
            migrationTableName: migrationTableName ?? 'migrations',
            slonik: pool,
            logger: console,
          })
          await migrator.up()
        }
        return pool
      },
      {isPromise: true},
    )

    async function upsertById(...args: Parameters<typeof upsertByIdQuery>) {
      const pool = await getPool()
      const query = upsertByIdQuery(...args)
      if (!query) {
        return
      }
      await pool.query(query)
    }
    return {getPool, sql, upsertById}
  },
)

/**
 * First row is used for type inference. Will need to support explicit columns later
 * Expects an `id` and `updated_at` column to exist in db
 * Will automatically snake_case
 * TODOs: 1) Support JSON patching
 * 2) Supports explict column definition
 *
 * https://blog.sequin.io/airtable-sync-process/
 * insert into public.products (id,created_time,name,size,color)
 * values $1, $2, $3, $4, $5
 * on conflict (id) do update set
 * id=excluded.id, created_time=excluded.created_time, name=excluded.name, size=excluded.size, color=excluded.color
 * where (created_time, name, size, color) is distinct from (excluded.created_time, excluded.name, excluded.size, excluded.color)
 *
 */
export function upsertByIdQuery(
  tableName: string,
  _valueMaps: MaybeArray<{id: string; [k: string]: unknown}>,
) {
  // console.log('[upsertByIdQuery]', {tableName, valueMaps})
  const valueMaps = fromMaybeArray(_valueMaps)
  const firstValueMap = valueMaps[0]
  if (!firstValueMap) {
    return null
  }

  const {sql} = $slonik()
  const table = sql.identifier([tableName])

  const kUpdatedAt = 'updatedAt'
  // `undefined` is not supported by postgres and we make it mean `set to null` for now.
  const keys = R.keys({...firstValueMap, [kUpdatedAt]: null}).filter(
    (k) => k === kUpdatedAt || firstValueMap[k] !== undefined,
  )

  const cols = keys.map((k) => sql.identifier([snakeCase(k)]))
  const valLists = valueMaps.map((vmap) =>
    keys.map((k) => {
      if (k === kUpdatedAt) {
        return sql.literalValue('now()')
      }
      const v = vmap[k]
      return isPlainObject(v) || Array.isArray(v)
        ? sql.jsonb(v as any)
        : (v as PrimitiveValueExpression)
    }),
  )

  const query = sql`
    INSERT INTO ${table} (${sql.join(cols, sql`, `)})
    VALUES (${sql.join(
      valLists.map((vals) => sql.join(vals, sql`, `)),
      sql`), (`,
    )})
    ON CONFLICT (id) DO UPDATE SET
      ${sql.join(
        cols
          .filter((c) => !c.names.includes('id'))
          .map((c) => sql`${c} = excluded.${c}`),
        sql`, \n`,
      )}
    WHERE
      ${sql.join(
        cols
          .filter((c) => !c.names.includes('id'))
          .filter((c) => !c.names.includes('updated_at'))
          .map((c) => sql`${table}.${c} IS DISTINCT FROM excluded.${c}`),
        sql` OR \n`,
      )};
  `
  return query
}
