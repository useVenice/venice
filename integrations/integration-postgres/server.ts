/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {sql} from 'slonik'
import type {DatabasePool} from 'slonik'

import type {IntegrationServer} from '@usevenice/cdk-core'
import {extractId, handlersLink} from '@usevenice/cdk-core'
import {R, Rx, rxjs, snakeCase} from '@usevenice/util'

import type {postgresSchemas} from './def'
import {postgresHelpers} from './def'
import {makePostgresClient, upsertByIdQuery} from './makePostgresClient'

async function setupTable({
  pool,
  schema: _schema,
  tableName: _tableName,
}: {
  pool: DatabasePool
  schema?: string
  tableName: string
}) {
  const schema = snakeCase(_schema)
  const tableName = snakeCase(_tableName)
  const table = sql.identifier(schema ? [schema, tableName] : [tableName])

  await pool.query(sql`
    CREATE TABLE IF NOT EXISTS ${table} (
      source_id VARCHAR NOT NULL,
      id VARCHAR NOT NULL,
      standard jsonb,
      external jsonb DEFAULT '{}'::jsonb NOT NULL,
      end_user_id VARCHAR,
      created_at timestamp with time zone DEFAULT now() NOT NULL,
      updated_at timestamp with time zone DEFAULT now() NOT NULL,
      provider_name VARCHAR GENERATED ALWAYS AS (split_part((source_id)::text, '_'::text, 2)) STORED NOT NULL,
      CONSTRAINT ${sql.identifier([
        `pk_${tableName}`,
      ])} PRIMARY KEY ("source_id", "id")
    );
  `)
  // NOTE: Should we add org_id?
  // NOTE: Rename `standard` to `unified` and `external` to `raw` or `remote` or `original`
  // NOTE: add prefix check would be nice
  for (const col of [
    'id',
    'source_id',
    'provider_name',
    'created_at',
    'updated_at',
    'end_user_id',
  ]) {
    await pool.query(sql`
      CREATE INDEX IF NOT EXISTS ${sql.identifier([
        `${tableName}_${col}`,
      ])} ON ${table} (${sql.identifier([col])});
    `)
  }
}

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
    const {getPool} = makePostgresClient({databaseUrl})
    // TODO: Never let slonik transform the field names...
    const rawClient = makePostgresClient({
      databaseUrl,
      transformFieldNames: false,
    })

    async function* iterateEntities() {
      const handlebars = await import('handlebars')

      const pool = await getPool()
      // Where do we want to put data? Not always public...
      await setupTable({pool, tableName: 'account'})
      await setupTable({pool, tableName: 'transaction'})

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

    const {getPool} = makePostgresClient({
      databaseUrl,
      migrationsPath: __dirname + '/migrations',
      migrationTableName: '_migrations',
    })
    let batches: Record<string, Array<{id: string; [k: string]: unknown}>> = {}

    const migrationRan: Record<string, boolean> = {}
    async function runMigration(pool: DatabasePool, tableName: string) {
      console.log('will run migration for', tableName)
      if (migrationRan[tableName]) {
        return
      }
      migrationRan[tableName] = true
      // Where do we want to put data? Not always public...
      await setupTable({pool, tableName})
    }

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
        await Promise.all(
          Object.keys(batches).map((eName) => runMigration(pool, eName)),
        )

        console.log(`[postgres] Will commit ${size} entities`)
        await pool.transaction((client) =>
          Promise.all(
            R.pipe(
              batches,
              R.toPairs,
              R.map(([eName, batch]) =>
                upsertByIdQuery(eName, batch, {
                  primaryKey: ['id', 'source_id'],
                }),
              ),
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
