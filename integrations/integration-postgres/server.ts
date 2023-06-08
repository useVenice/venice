/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type {IntegrationServer} from '@usevenice/cdk-core'
import {extractId, handlersLink} from '@usevenice/cdk-core'
import {
  makePostgresClient,
  upsertByIdQuery,
} from '@usevenice/core-integration-postgres'
import {R, Rx, rxjs} from '@usevenice/util'

import type {postgresSchemas} from './def'
import {postgresHelpers} from './def'

export {makePostgresClient} from '@usevenice/core-integration-postgres'

export const postgresServer = {
  // TODO:
  // 1) Implement pagination
  // 2) Impelemnt incremental Sync
  // 3) Improve type safety
  // 4) Implement parallel runs
  sourceSync: ({
    endUser,
    settings: {databaseUrl, sourceQueries},
    state = {},
  }) => {
    const {getPool, sql, getMigrator} = makePostgresClient({
      databaseUrl,
      migrationsPath: __dirname + '/migrations',
      migrationTableName: '_migrations',
    })
    // TODO: Never let slonik transform the field names...
    const rawClient = makePostgresClient({
      databaseUrl,
      transformFieldNames: false,
    })

    async function* iterateEntities() {
      const handlebars = await import('handlebars')

      const pool = await getPool()

      // Side effects to ensure files are packaged by webpack
      // Make sure to update this list when we run migrations
      import('./migrations/2023-05-17_1630-ulid-function')
      import('./migrations/2023-05-17_1649-create_tables')
      const migrator = await getMigrator()
      await migrator.up()

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
            entityName,
          ])} WHERE end_user_id = ${endUser?.id ?? null}`,
        )
        yield res.rows.map((row) =>
          postgresHelpers._op('data', {
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
      for (const [_entityName, _query] of Object.entries(sourceQueries ?? {})) {
        const entityName = _entityName as keyof NonNullable<
          typeof sourceQueries
        >
        const queryState = state[_entityName as keyof typeof state]
        if (!_query) {
          return
        }
        // If schema is known, we can use prepared statements instead. But in this case
        // we do not know the schema
        const query = handlebars.compile(_query)({
          ...queryState,
          endUserId: endUser?.id,
        })

        const res = await rawPool.query<{id?: string; modifiedAt?: string}>(
          rawClient.sql([query] as unknown as TemplateStringsArray),
        )
        const lastRow = res.rows[res.rows.length - 1]

        yield R.compact([
          ...res.rows.map((row) =>
            postgresHelpers._op('data', {
              data: {entityName, id: `${row.id}`, entity: row},
            }),
          ),
          lastRow?.modifiedAt &&
            lastRow.id &&
            (postgresHelpers._opState({
              invoice: {
                lastModifiedAt: lastRow.modifiedAt,
                lastRowId: lastRow.id,
              },
            }) as never), // Temp hack...
        ])
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(
        Rx.mergeMap((ops) =>
          rxjs.from([...ops, postgresHelpers._op('commit')]),
        ),
      )
  },
  destinationSync: ({endUser, settings: {databaseUrl}}) => {
    console.log('[destinationSync] Will makePostgresClient', {
      // databaseUrl,
      // migrationsPath: __dirname + '/migrations',
      endUser,
    })
    // TODO: Probably need to require these sql files to work... turn them into js files

    const {getPool, getMigrator} = makePostgresClient({
      databaseUrl,
      migrationsPath: __dirname + '/migrations',
      migrationTableName: '_migrations',
    })
    let batches: Record<string, Array<{id: string; [k: string]: unknown}>> = {}

    return handlersLink({
      data: (op) => {
        const {
          data: {id, entityName, providerName, sourceId = null, ...data},
        } = op
        const tableName = entityName
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
        const migrator = await getMigrator()
        // TODO: Make it so that we don't need to run migrations on every commit
        const migrations = await migrator.up()
        console.log('[postgres] migrations ran', migrations)
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
} satisfies IntegrationServer<typeof postgresSchemas>

export default postgresServer
