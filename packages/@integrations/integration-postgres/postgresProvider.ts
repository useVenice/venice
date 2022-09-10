import {handlersLink, makeSyncProvider} from '@ledger-sync/cdk-core'
import type {EntityPayloadWithExternal} from '@ledger-sync/cdk-ledger'
import {
  makePostgresClient,
  upsertByIdQuery,
  zPgConfig,
} from '@ledger-sync/core-integration-postgres'
import {R, rxjs, z, zCast} from '@ledger-sync/util'

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('postgres'),
  connectionSettings: zPgConfig.pick({databaseUrl: true}),
  destinationInputEntity: zCast<EntityPayloadWithExternal>(),
})

export const postgresProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def,
  destinationSync: ({settings: {databaseUrl}}) => {
    console.log('Will makePostgresClient', {
      databaseUrl,
      migrationsPath: __dirname + '/migrations',
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
        const batch = batches[entityName] ?? []
        batches[entityName] = batch
        batch.push({
          id,
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
