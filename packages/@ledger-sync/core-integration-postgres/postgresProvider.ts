import {
  AnyEntityPayload,
  handlersLink,
  makeSyncProvider,
} from '@ledger-sync/core-sync'
import {z, zCast} from '@ledger-sync/util'
import {makePostgresKVStore} from './makePostgresKVStore'

const zWatchPathsInput = z.object({
  databaseUrl: z.string(),
})

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('postgres'),
  connectionSettings: zWatchPathsInput,
  destinationInputEntity: zCast<AnyEntityPayload>(),
})

export const postgresProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def,
  destinationSync: ({settings: {databaseUrl}}) =>
    handlersLink({
      data: ({data}) => {
        makePostgresKVStore({databaseUrl}).set(
          `${data.entityName}-${data.id}`, // TODO: Check why teller transaction cannot be imported as well as the other data from source providers
          data as any,
        )
      },
    }),
})
