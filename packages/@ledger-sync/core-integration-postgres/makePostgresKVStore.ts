import {zKVStore} from '@ledger-sync/core-sync'
import {
  defineProxyFn,
  JsonObject,
  memoize,
  z,
  zFunction,
  zJsonObject,
} from '@ledger-sync/util'
import {createInterceptors} from 'slonik-interceptor-preset'
// const {SlonikMigrator} = require('@slonik/migrator')

export const $slonik = defineProxyFn<() => typeof import('slonik')>('slonik')

export const zConn = z.object({
  databaseUrl: z.string(),
})

// TODO: Generate me from postgres schema...
const zMetaRow = z.object({
  id: z.string(),
  data: zJsonObject,
  updated_at: z.date().optional(), // Only optional for inserts...
  created_at: z.date().optional(),
})

type MetaRow = z.infer<typeof zMetaRow>
interface Metabase {
  meta: MetaRow
}

export const makePostgresKVStore = zFunction(
  zConn,
  zKVStore,
  ({databaseUrl}) => {
    const {createPool, sql} = $slonik()
    const getPool = memoize(
      () =>
        createPool(databaseUrl, {
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
        }),
      {isPromise: true},
    )

    // $path().join(__dirname, './migrations'),
    // async function connect() {
    //   const {error, results} = await migrator.migrateToLatest()
    //   results?.forEach((it) => {
    //     if (it.status === 'Success') {
    //       console.log(
    //         `migration "${it.migrationName}" was executed successfully`,
    //       )
    //     } else if (it.status === 'Error') {
    //       console.error(`failed to execute migration "${it.migrationName}"`)
    //     }
    //   })
    //   if (error) {
    //     throw error
    //   }
    // }
    // async function cleanup() {
    //   await db.destroy()
    // }

    async function readJson(id: string) {
      const pool = await getPool()
      return pool.maybeOneFirst(sql`
        SELECT data FROM meta where id = ${id}
      `)
    }
    async function listJson() {
      const pool = await getPool()
      return pool
        .many(sql`SELECT id, data FROM meta`)
        .then((rows) => rows.map((r) => [r['id'], r['data']]))
    }
    /**
     * https://blog.sequin.io/airtable-sync-process/
     * insert into public.products (id,created_time,name,size,color)
     * values $1, $2, $3, $4, $5
     * on conflict (id) do update set
     * id=excluded.id, created_time=excluded.created_time, name=excluded.name, size=excluded.size, color=excluded.color
     * where (created_time, name, size, color) is distinct from (excluded.created_time, excluded.name, excluded.size, excluded.color)
     */
    async function writeJson(id: string, data: JsonObject) {
      const pool = await getPool()
      // Next: Handle patching json
      await pool.query(sql`
        INSERT INTO meta (id, data, updated_at)
        VALUES (${id}, ${sql.jsonb(data)}, now())
        ON CONFLICT (id) DO UPDATE SET
          data = excluded.data,
          id = excluded.id,
          updated_at = excluded.updated_at
        WHERE meta.data IS DISTINCT FROM excluded.data
      `)
    }

    // await migrator.migrateToLatest(pathToMigrationsFolder)
    return {
      get: readJson,
      list: listJson,
      set: (id, data) => writeJson(id, data as any),
    }
  },
)
