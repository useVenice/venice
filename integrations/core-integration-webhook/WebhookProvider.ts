import type {AnyEntityPayload} from '@usevenice/cdk-core'
import {handlersLink, makeSyncProvider} from '@usevenice/cdk-core'
import {createHTTPClient, rxjs, z, zCast} from '@usevenice/util'

const webhookProviderDef = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('webhook'),
  resourceSettings: z.object({
    destinationUrl: z.string(),
  }),
  destinationInputEntity: zCast<AnyEntityPayload>(),
})

export const webhookProvider = makeSyncProvider({
  metadata: {categories: ['streaming'], logoUrl: '/_assets/logo-webhook.png'},
  ...makeSyncProvider.defaults,
  def: webhookProviderDef,
  destinationSync: ({settings: {destinationUrl}}) => {
    const http = createHTTPClient({baseURL: destinationUrl})
    let batch = {
      resUpdates: [] as unknown[],
      stateUpdates: [] as unknown[],
      entities: [] as Array<
        (typeof webhookProviderDef)['_types']['destinationInputEntity']
      >,
    }

    return handlersLink({
      data: (op) => {
        batch.entities.push(op.data)
        return rxjs.of(op)
      },
      resoUpdate: (op) => {
        batch.resUpdates.push(op)
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
          batch = {resUpdates: [], stateUpdates: [], entities: []}
        }
        return op
      },
    })
  },
})
