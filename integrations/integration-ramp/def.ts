import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk-core'
import {intHelpers, zIntAuth} from '@usevenice/cdk-core'
import {makePostingsMap} from '@usevenice/cdk-ledger'
import {A, R, z} from '@usevenice/util'

import {
  businessResponseSchema,
  transactionResponseItemSchema,
} from './RampClient'

export const rampSchemas = {
  name: z.literal('ramp'),
  integrationConfig: zIntAuth.oauth,
  resourceSettings: z.object({
    accessToken: z.string().nullish(),
    startAfterTransactionId: z.string().nullish(),
  }),
  connectInput: z.object({
    accessToken: z.string().nullish(),
  }),
  connectOutput: z.object({
    accessToken: z.string().nullish(),
    clientId: z.string().nullish(),
    clientSecret: z.string().nullish(),
  }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: businessResponseSchema,
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: transactionResponseItemSchema,
    }),
  ]),
  sourceState: z.object({
    startAfterTransactionId: z.string().nullish(),
    accessToken: z.string().nullish(),
    clientId: z.string().nullish(),
    clientSecret: z.string().nullish(),
  }),
} satisfies IntegrationSchemas

export const rampHelpers = intHelpers(rampSchemas)

export const rampDef = {
  name: 'ramp',
  def: rampSchemas,
  metadata: {
    categories: ['banking', 'expense-management'],
    logoUrl: '/_assets/logo-ramp.png',
    stage: 'beta',
  },
  extension: {
    sourceMapEntity: {
      account: ({entity: a}) => ({
        id: a.id,
        entityName: 'account',
        entity: {
          name: `${a.business_name_on_card}`,
          type: 'asset/bank',
          institutionName: a.business_name_legal,
        },
      }),
      transaction: ({entity: t}) => ({
        id: t.id,
        entityName: 'transaction',
        entity: {
          date: t.user_transaction_time,
          description: t.merchant_descriptor ?? '',
          payee: t.merchant_name,
          externalCategory: t.sk_category_name ?? '',
          postingsMap: makePostingsMap({
            main: {
              amount: A(-1 * t.amount, 'USD' as Unit),
              memo:
                t.memo ??
                R.compact([
                  `${t.card_holder.first_name} ${t.card_holder.last_name}`,
                  t.merchant_category_code,
                ]).join('/'),
              subAccountKey: t.state.toLowerCase() ?? undefined,
            },
          }),
          custom: {
            user: `${t.card_holder.first_name} ${t.card_holder.last_name}`,
          },
        },
      }),
    },
  },
} satisfies IntegrationDef<typeof rampSchemas>

export default rampDef
