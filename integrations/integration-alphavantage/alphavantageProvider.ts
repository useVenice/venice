import {makeSyncProvider} from '@usevenice/cdk-core'
import {veniceProviderBase} from '@usevenice/cdk-ledger'
import {z} from '@usevenice/util'

import {zConfig} from './alphavantageClient'

const _def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('alphavantage'),
  integrationConfig: zConfig,
  sourceOutputEntity: z.object({
    id: z.string(),
    entityName: z.literal('commodity'),
    entity: z.any(), // TODO Replace with correct type
  }),
})

export const alphavantageProviderDef = makeSyncProvider.def.helpers(_def)

// TODO: convert the old provider with the current format
