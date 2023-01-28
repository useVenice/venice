import {z} from '@usevenice/util'

import {logLink} from './base-links'
import {makeSyncProvider, zWebhookInput} from './makeSyncProvider'

const debugProviderDef = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('debug'),
  webhookInput: zWebhookInput,
  resourceSettings: z.unknown(),
  integrationConfig: z.unknown(),
  sourceOutputEntity: z.unknown(),
  institutionData: z.unknown(),
})

export const debugProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def: debugProviderDef,
  destinationSync: () => logLink({prefix: 'debug', verbose: true}),
  handleWebhook: (input) => ({
    resourceUpdates: [],
    response: {body: {echo: input}},
  }),
})
