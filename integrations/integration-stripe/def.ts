import type {IntegrationDef} from '@usevenice/cdk-core'
import {defHelpers} from '@usevenice/cdk-core'
import {veniceProviderBase, zCommon} from '@usevenice/cdk-ledger'
import {z, zCast} from '@usevenice/util'

import type {components} from './stripe.gen'

export const stripeDef = {
  name: z.literal('stripe'),
  integrationConfig: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
  }),
  resourceSettings: z.object({secretKey: z.string()}),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<components['schemas']['account']>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<components['schemas']['balance_transaction']>(),
    }),
  ]),
  sourceState: veniceProviderBase.def.sourceState
    .removeDefault()
    .extend({transactionSyncCursor: z.string().nullish()})
    .default({}),
  destinationInputEntity: zCommon.Entity,
} satisfies IntegrationDef

export const helpers = defHelpers(stripeDef)

export default stripeDef
