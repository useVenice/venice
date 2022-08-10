import {
  $fs,
  $path,
  defineProxyFn,
  JsonObject,
  z,
  zFunction,
  zJsonObject,
} from '@alka/util'
import {zKVStore} from '@ledger-sync/core-sync'
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
  sql,
} from 'kysely'
import type {Pool} from 'pg'

export const $pgPool = defineProxyFn<() => typeof Pool>('pgPool')

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
    const Pool = $pgPool()
    // You'd create one of these when you start your app.
    const db = new Kysely<Metabase>({
      // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: databaseUrl,
          ssl: databaseUrl.includes('ssl=true'),
        }),
      }),
      log: ['error'], // ['query', 'error'],
    })

    const migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs: $fs(),
        path: $path(),
        migrationFolder: $path().join(__dirname, './migrations'),
      }),
    })
    async function connect() {
      const {error, results} = await migrator.migrateToLatest()
      results?.forEach((it) => {
        if (it.status === 'Success') {
          console.log(
            `migration "${it.migrationName}" was executed successfully`,
          )
        } else if (it.status === 'Error') {
          console.error(`failed to execute migration "${it.migrationName}"`)
        }
      })
      if (error) {
        throw error
      }
    }
    // async function cleanup() {
    //   await db.destroy()
    // }

    async function readJson(id: string) {
      await connect()
      return await db
        .selectFrom('meta')
        .selectAll()
        .where('id', '=', id)
        .castTo<MetaRow>() // Not sure why this is not working, let's fix me
        .executeTakeFirst()
        .then((r) => r?.data)
    }
    async function listJson() {
      await connect()
      return await db
        .selectFrom('meta')
        .selectAll()
        .castTo<MetaRow>() // Not sure why this is not working, let's fix me
        .execute()
        .then((res) => res.map((r) => [r.id, r?.data] as const))
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
      await connect()
      await db
        .insertInto('meta')
        .values({id, data})
        .onConflict((oc) =>
          oc
            .column('id')
            .doUpdateSet({
              data: (eb) => eb.ref('excluded.data'),
            })
            // TODO: Test if this actually works, especially with patch methods...
            .where(sql`meta.data is distinct from excluded.data`),
        )
        .executeTakeFirstOrThrow()
    }

    // await migrator.migrateToLatest(pathToMigrationsFolder)
    return {
      get: readJson,
      list: listJson,
      set: (id, data) => writeJson(id, data as any),
    }
  },
)
