/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {extractId, handlersLink, makeSyncProvider} from '@usevenice/cdk-core'
import type {EntityPayloadWithExternal, ZCommon} from '@usevenice/cdk-ledger'
import {
  makePostgresClient,
  upsertByIdQuery,
  zPgConfig,
} from '@usevenice/core-integration-postgres'
import {R, Rx, rxjs, z, zCast} from '@usevenice/util'

export {makePostgresClient} from '@usevenice/core-integration-postgres'

const _def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('postgres'),
  // TODO: Should postgres use integration config or resourceSettings?
  // if it's resourceSettings then it doesn't make as much sense to configure
  // in the list of integrations...
  // How do we create default resources for integrations that are basically single resource?
  resourceSettings: zPgConfig.pick({databaseUrl: true}).extend({
    // gotta make sourceQueries a Textarea
    sourceQueries: z
      .object({
        invoice: z.string().nullish(),
      })
      .nullish(),
  }),
  destinationInputEntity: zCast<EntityPayloadWithExternal>(),
  sourceOutputEntity: zCast<EntityPayloadWithExternal | ZCommon['Entity']>(),
})

const def = makeSyncProvider.def.helpers(_def)

export const postgresProvider = makeSyncProvider({
  metadata: {
    categories: ['database'],
    logoUrl: '/_assets/logo-postgres.png',
    stage: 'production',
  },
  ...makeSyncProvider.defaults,
  def,
  standardMappers: {
    resource: (_settings) => ({
      displayName: 'Postgres',
      status: 'healthy',
    }),
  },
  // TODO:
  // 1) Implement pagination
  // 2) Impelemnt incremental Sync
  // 3) Improve type safety
  // 4) Implement parallel runs
  sourceSync: ({endUser, settings: {databaseUrl, sourceQueries}}) => {
    const {getPool, sql} = makePostgresClient({
      databaseUrl,
      migrationsPath: __dirname + '/migrations',
      migrationTableName: 'ls_migrations',
    })
    // TODO: Never let slonik transform the field names...
    const rawClient = makePostgresClient({
      databaseUrl,
      transformFieldNames: false,
    })

    async function* iterateEntities() {
      const pool = await getPool()

      for (const entityName of ['account', 'transaction'] as const) {
        const res = await pool.query<{
          created_at: string
          external: any
          id: string
          end_user_id: string | null
          provider_name: string
          source_id: string | null
          standard: any
          updated_at: string
        }>(
          sql`SELECT * FROM ${sql.identifier([
            'raw_' + entityName,
          ])} WHERE end_user_id = ${endUser?.id ?? null}`,
        )
        yield res.rows.map((row) =>
          def._op('data', {
            data: {
              entityName,
              entity: row.standard,
              external: row.external,
              id: row.id,
              providerName: 'postgres',
              sourceId: row.source_id ?? undefined,
              externalId: extractId(row.id as any)[2],
            },
          }),
        )
      }

      const rawPool = await rawClient.getPool()
      for (const [_entityName, query] of Object.entries(sourceQueries ?? {})) {
        const entityName = _entityName as keyof NonNullable<
          typeof sourceQueries
        >
        if (!query) {
          return
        }

        const res = await rawPool.query(
          rawClient.sql([query] as unknown as TemplateStringsArray),
        )
        yield res.rows.map((row) =>
          def._op('data', {
            data: {entityName, id: `${row['id']}`, entity: row},
          }),
        )
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, def._op('commit')])))
  },
  destinationSync: ({endUser, settings: {databaseUrl}}) => {
    console.log('[destinationSync] Will makePostgresClient', {
      // databaseUrl,
      // migrationsPath: __dirname + '/migrations',
      endUser,
    })
    const {getPool} = makePostgresClient({
      databaseUrl,
      migrationsPath: __dirname + '/migrations',
      migrationTableName: 'ls_migrations',
    })
    let batches: Record<string, Array<{id: string; [k: string]: unknown}>> = {}

    return handlersLink({
      data: (op) => {
        const {
          data: {id, entityName, providerName, sourceId = null, ...data},
        } = op
        const tableName = `raw_${entityName}`
        const batch = batches[tableName] ?? []
        batches[tableName] = batch
        batch.push({
          id,
          end_user_id: endUser?.id ?? null,
          standard: data.entity,
          external: data.external,
          source_id: sourceId,
        })
        return rxjs.of(op)
      },
      commit: async (op) => {
        const size = R.values(batches)
          .map((b) => b.length)
          .reduce((a, b) => a + b, 0)
        if (size === 0) {
          return op
        }
        const pool = await getPool()
        console.log(`[postgres] Will commit ${size} entities`)
        await pool.transaction((client) =>
          Promise.all(
            R.pipe(
              batches,
              R.toPairs,
              R.map(([eName, batch]) => upsertByIdQuery(eName, batch)),
              R.compact,
              R.map((query) => client.query(query)),
            ),
          ),
        )
        batches = {}
        console.log(`[postgres] Did commit ${size} entities`)
        return op
      },
    })
  },
})
