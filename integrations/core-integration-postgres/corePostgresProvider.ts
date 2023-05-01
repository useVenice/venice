import type {AnyEntityPayload} from '@usevenice/cdk-core'
import {handlersLink, makeSyncProvider} from '@usevenice/cdk-core'
import {z, zCast} from '@usevenice/util'

import {makePostgresClient, zPgConfig} from './makePostgresClient'

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('core-postgres'),
  resourceSettings: zPgConfig,
  destinationInputEntity: zCast<AnyEntityPayload>(),
})

export const corePostgresProvider = makeSyncProvider({
  metadata: {status: 'hidden'},
  ...makeSyncProvider.defaults,
  def,
  destinationSync: ({settings: {databaseUrl}}) => {
    const {upsertById} = makePostgresClient({databaseUrl})
    return handlersLink({
      data: async (op) => {
        // prettier-ignore
        const {data: {id, entityName, entity}} = op
        await upsertById('meta', [{id: `${entityName}_${id}`, data: entity}])
        return op
      },
    })
  },
})
