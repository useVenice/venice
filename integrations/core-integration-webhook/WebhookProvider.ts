import type {AnyEntityPayload} from '@usevenice/cdk-core'
import {handlersLink, makeSyncProvider} from '@usevenice/cdk-core'
import {createHTTPClient, rxjs, z, zCast} from '@usevenice/util'

const webhookProviderDef = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('webhook'),
  connectionSettings: z.object({
    destinationUrl: z.string(),
  }),
  destinationInputEntity: zCast<AnyEntityPayload>(),
})

export const webhookProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def: webhookProviderDef,
  destinationSync: ({settings: {destinationUrl}}) => {
    const http = createHTTPClient({baseURL: destinationUrl})
    let batch = {
      connUpdates: [] as unknown[],
      stateUpdates: [] as unknown[],
      entities: [] as Array<
        typeof webhookProviderDef['_types']['destinationInputEntity']
      >,
    }

    return handlersLink({
      data: (op) => {
        batch.entities.push(op.data)
        return rxjs.of(op)
      },
      connUpdate: (op) => {
        batch.connUpdates.push(op)
        return rxjs.of(op)
      },
      stateUpdate: (op) => {
        batch.stateUpdates.push(op)
        return rxjs.of(op)
      },
      commit: async (op) => {
        if (Object.values(batch).some((arr) => arr.length > 0)) {
          await http.post('', batch)
          // Add queuing and retries here...
          batch = {connUpdates: [], stateUpdates: [], entities: []}
        }
        return op
      },
    })
  },
})
