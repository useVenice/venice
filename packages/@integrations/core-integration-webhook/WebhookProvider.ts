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
    let entities: Array<
      typeof webhookProviderDef['_types']['destinationInputEntity']
    > = []

    return handlersLink({
      data: (op) => {
        entities.push(op.data)
        return rxjs.of(op)
      },
      commit: async (op) => {
        if (entities.length > 0) {
          await http.post('', {entities})
          // Add retries here...
          entities = []
        }
        return op
      },
    })
  },
})
