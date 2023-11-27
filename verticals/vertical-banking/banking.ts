import * as rxjs from 'rxjs'
import * as Rx from 'rxjs/operators'
import type {Link} from '@usevenice/cdk'
import type {components as Plaid} from '@usevenice/connector-plaid/plaid.oas'
import {z} from '@usevenice/vdk'

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
      // Do soemthing...
    }
    if (op.data.entityName === 'plaid_transaction') {
      const entity = op.data.entity as Plaid['schemas']['Transaction']
      // Do soemthing...
    }
    return rxjs.of(op)
  })
}
