import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk-core'
import {intHelpers, zIntOauthApikeyAuth} from '@usevenice/cdk-core'
import {
  makePostingsMap,
  veniceProviderBase,
  zCommon,
} from '@usevenice/cdk-ledger'
import {A, z, zCast} from '@usevenice/util'

import type {components} from './stripe.gen'

export const stripeSchemas = {
  name: z.literal('stripe'),
  integrationConfig: zIntOauthApikeyAuth,
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
} satisfies IntegrationSchemas

export const stripeDef = {
  def: stripeSchemas,
  name: 'stripe',
  metadata: {
    categories: ['commerce'],
    logoUrl: '/_assets/logo-stripe.png',
    stage: 'beta',
  },
  extension: {
    sourceMapEntity: {
      account: ({entity: a}) => ({
        id: a.id,
        entityName: 'account',
        entity: {
          name: a.settings?.dashboard.display_name ?? '',
          type: 'asset/digital_wallet',
          institutionName: a.settings?.payments.statement_descriptor,
          defaultUnit: a.default_currency?.toUpperCase() as Unit,
          // informationalBalances: {
          //   available: A(
          //     a.balance?.available[0]?.amount ?? 0,
          //     a.default_currency?.toUpperCase() as Unit,
          //   ),
          // },
        },
      }),
      transaction: ({entity: t}) => ({
        id: t.id,
        entityName: 'transaction',
        entity: {
          date: new Date(t.created).toISOString(),
          description: t.description ?? '',
          postingsMap: makePostingsMap({
            main: {
              accountExternalId: t.source as ExternalId,
              amount: A(t.amount, t.currency as Unit),
            },
          }),
        },
      }),
    },
  },
} satisfies IntegrationDef<typeof stripeSchemas>

export const helpers = intHelpers(stripeSchemas)

export default stripeDef
