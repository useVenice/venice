import * as rxjs from 'rxjs'
import * as Rx from 'rxjs/operators'
import type {AnyEntityPayload, Link} from '@usevenice/cdk'
import type {components as Plaid} from '@usevenice/connector-plaid/plaid.oas'
import type {postgresHelpers} from '@usevenice/connector-postgres'
import type {StrictObj} from '@usevenice/types'
import {applyMapper, mapper, z, zCast} from '@usevenice/vdk'

// import {QBO} from '@usevenice/connector-qbo/qbo'

export const zBanking = {
  transaction: z.object({
    id: z.string(),
    date: z.string().datetime(),
    description: z.string().nullish(),
    category: z.string().nullish(),
    amount: z.number(),
    currency: z.string(),
    merchant_id: z.string().nullish(),
    merchant_name: z.string().nullish(),
    account_id: z.string().nullish(),
    account_name: z.string().nullish(),
  }),
  account: z.object({
    id: z.string(),
    name: z.string(),
  }),
  merchant: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().nullish(),
  }),
}

export const zBankingEntityName = z.enum(
  Object.keys(zBanking) as [keyof typeof zBanking],
)

export type ZBanking = {
  [k in keyof typeof zBanking]: z.infer<(typeof zBanking)[k]>
}

type PostgresInputPayload =
  (typeof postgresHelpers)['_types']['destinationInputEntity']

export function bankingLink(): Link<AnyEntityPayload, PostgresInputPayload> {
  return Rx.mergeMap((op) => {
    if (op.type !== 'data') {
      return rxjs.of(op)
    }

    if (op.data.entityName === 'qbo_purchase') {
      const mapped = applyMapper(
        mappers.qbo_purchase,
        op.data.entity as QBO.Purchase,
      )
      return rxjs.of({
        ...op,
        data: {
          id: mapped.id,
          entityName: 'banking_transaction',
          entity: {raw: op.data.entity, unified: mapped},
        } satisfies PostgresInputPayload,
      })
    }
    if (op.data.entityName === 'plaid_transaction') {
      const mapped = applyMapper(
        mappers.plaid_transaction,
        op.data.entity as Plaid['schemas']['Transaction'],
      )
      return rxjs.of({
        ...op,
        data: {
          id: mapped.id,
          entityName: 'banking_transaction',
          entity: {raw: op.data.entity, unified: mapped},
        } satisfies PostgresInputPayload,
      })
    }
    // Do not allow any other entities to pass through
    return rxjs.EMPTY
  })
}

const mappers = {
  // Should be able to have input and output entity types in here also.

  qbo_purchase: mapper(zCast<StrictObj<QBO.Purchase>>(), zBanking.transaction, {
    id: 'Id',
    amount: 'TotalAmt',
    currency: 'CurrencyRef.value',
    date: 'TxnDate',
    account_id: 'AccountRef.value',
    account_name: 'AccountRef.name',
    category: (p) => p.Line[0]?.AccountBasedExpenseLineDetail?.AccountRef.name,
    description: 'PrivateNote', // Is this right?
    merchant_id: 'EntityRef.value',
    merchant_name: 'EntityRef.name',
  }),
  plaid_transaction: mapper(
    zCast<StrictObj<Plaid['schemas']['Transaction']>>(),
    zBanking.transaction,
    {
      id: 'transaction_id',
      amount: 'amount',
      currency: 'iso_currency_code',
      date: 'date',
      account_id: 'account_id',
      category: (p) =>
        [
          p.personal_finance_category?.primary,
          p.personal_finance_category?.detailed,
        ]
          .filter((c) => !!c)
          .join('/'),
      description: 'original_description',
      merchant_id: 'merchant_entity_id',
      merchant_name: 'merchant_name',
    },
  ),
}
