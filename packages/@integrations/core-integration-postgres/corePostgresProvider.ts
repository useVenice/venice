import {
  AnyEntityPayload,
  handlersLink,
  makeSyncProvider,
} from '@ledger-sync/cdk-core'
import {z, zCast} from '@ledger-sync/util'
import {makePostgresClient, zPgConfig} from './makePostgresClient'

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('core-postgres'),
  connectionSettings: zPgConfig,
  destinationInputEntity: zCast<AnyEntityPayload>(),
})

export const corePostgresProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def,
  destinationSync: ({settings: {databaseUrl}}) => {
    const {upsertById} = makePostgresClient({databaseUrl})
    return handlersLink({
      data: async (op) => {
        // prettier-ignore
        const {data: {id, entityName, entity}} = op
        await upsertById('meta', `${entityName}_${id}`, {data: entity})
        return op
      },
    })
  },
})
