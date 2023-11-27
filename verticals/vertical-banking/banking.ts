import {zCast} from 'packages/util'
import * as rxjs from 'rxjs'
import * as Rx from 'rxjs/operators'
import type {AnyEntityPayload, Link} from '@usevenice/cdk'
import type {components as Plaid} from '@usevenice/connector-plaid/plaid.oas'
import {applyMapper, mapper, z} from '@usevenice/vdk'

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

export function bankingLink(): Link {
  return Rx.mergeMap((op) => {
    if (op.type !== 'data') {
      return rxjs.of(op)
    }

    if (op.data.entityName === 'qbo_purchase') {
      const entity = op.data.entity as QBO.Purchase
      const mapped = applyMapper(
        mappers.qbo_purchase,
        op.data.entity as QBO.Purchase,
      )
      return rxjs.of({
        ...op,
        data: {
          id: mapped.id,
          entityName: 'banking_transaction',
          entity: mapped,
        } satisfies AnyEntityPayload,
      })
    }
    if (op.data.entityName === 'plaid_transaction') {
      const mapped = applyMapper(
        mappers.plaid_transaction,
        op.data.entity as any,
      )
      return rxjs.of({
        ...op,
        data: {
          id: mapped.id,
          entityName: 'banking_transaction',
          entity: mapped,
        } satisfies AnyEntityPayload,
      })
    }
    return rxjs.of(op)
  })
}

const mappers = {
  // Should be able to have input and output entity types in here also.

  qbo_purchase: mapper(zCast<QBO.Purchase>(), zBanking.transaction, {
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

// TODO: Move these into a proper util package

/** This will break for all the `unknown` unfortunately. But it is desired to remove `[k: string]: unknown` */
type StrictKeyOf<T> = keyof {
  [k in keyof T as unknown extends T[k] ? never : k]: never
}
type StrictObj<T> = Pick<
  T,
  StrictKeyOf<T> extends keyof T ? StrictKeyOf<T> : never
>
