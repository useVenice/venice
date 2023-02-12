import {rxjs, z} from '@usevenice/util'

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
  sourceSync: () => rxjs.EMPTY,
  destinationSync: () => logLink({prefix: 'debug', verbose: true}),
  handleWebhook: (input) => ({
    resourceUpdates: [],
    response: {body: {echo: input}},
  }),
  // Temporary hack to workaround assertion in mapStandardEntityLink when using debugProvider
  // as a source. However we should do something so this workaround is not needed in the first place
  extension: {sourceMapEntity: {}},
})
