import {defineProxyFn, memoize, z, zFunction} from '@ledger-sync/util'
import {SlonikMigrator} from '@slonik/migrator'
import {createInterceptors} from 'slonik-interceptor-preset'

export const $slonik = defineProxyFn<() => typeof import('slonik')>('slonik')

export const zPgConfig = z.object({
  databaseUrl: z.string(),
})

export const makePostgresClient = zFunction(zPgConfig, ({databaseUrl}) => {
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
      const migrator = new SlonikMigrator({
        migrationsPath: __dirname + '/migrations',
        migrationTableName: 'migrations',
        slonik: pool,
        logger: console,
      })
      await migrator.up()
      return pool
    },
    {isPromise: true},
  )
  return [getPool, sql] as const
})
