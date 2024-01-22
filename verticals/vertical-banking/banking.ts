import * as rxjs from 'rxjs'
import * as Rx from 'rxjs/operators'
import type {AnyEntityPayload, Id, Link} from '@usevenice/cdk'
import type {PlaidSDKTypes} from '@usevenice/connector-plaid'
import type {postgresHelpers} from '@usevenice/connector-postgres'
import type {QBO} from '@usevenice/connector-qbo'
import type {StrictObj} from '@usevenice/types'
import {applyMapper, mapper, z, zCast} from '@usevenice/vdk'

type Plaid = PlaidSDKTypes['oas']['components']

export const zBanking = {
  transaction: z.object({
    id: z.string(),
    date: z.string().datetime(),
    description: z.string().nullish(),
    category_id: z.string().nullish(),
    category_name: z.string().nullish(),
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
    current_balance: z.number().optional(),
    currency: z.string().optional(),
  }),
  merchant: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().nullish(),
  }),
  category: z.object({
    id: z.string(),
    name: z.string(),
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

export function bankingLink(ctx: {
  source: {id: Id['reso']; connectorConfig: {connectorName: string}}
}): Link<AnyEntityPayload, PostgresInputPayload> {
  return Rx.mergeMap((op) => {
    if (op.type !== 'data') {
      return rxjs.of(op)
    }
    if (ctx.source.connectorConfig.connectorName === 'qbo') {
      if (op.data.entityName === 'purchase') {
        const mapped = applyMapper(
          mappers.qbo.purchase,
          op.data.entity as QBO['Purchase'],
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
      if (op.data.entityName === 'account') {
        const entity = op.data.entity as QBO['Account']
        if (
          entity.Classification === 'Revenue' ||
          entity.Classification === 'Expense'
        ) {
          const mapped = applyMapper(
            mappers.qbo.category,
            op.data.entity as QBO['Account'],
          )
          return rxjs.of({
            ...op,
            data: {
              id: mapped.id,
              entityName: 'banking_category',
              entity: {raw: op.data.entity, unified: mapped},
            } satisfies PostgresInputPayload,
          })
        } else {
          const mapped = applyMapper(
            mappers.qbo.account,
            op.data.entity as QBO['Account'],
          )
          return rxjs.of({
            ...op,
            data: {
              id: mapped.id,
              entityName: 'banking_account',
              entity: {raw: op.data.entity, unified: mapped},
            } satisfies PostgresInputPayload,
          })
        }
      }
      if (op.data.entityName === 'vendor') {
        const mapped = applyMapper(
          mappers.qbo.vendor,
          op.data.entity as QBO['Vendor'],
        )
        return rxjs.of({
          ...op,
          data: {
            id: mapped.id,
            entityName: 'banking_merchant',
            entity: {raw: op.data.entity, unified: mapped},
          } satisfies PostgresInputPayload,
        })
      }
    }
    if (ctx.source.connectorConfig.connectorName === 'plaid') {
      if (op.data.entityName === 'transaction') {
        const mapped = applyMapper(
          mappers.plaid.transaction,
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
      if (op.data.entityName === 'account') {
        const mapped = applyMapper(
          mappers.plaid.account,
          op.data.entity as Plaid['schemas']['AccountBase'],
        )
        return rxjs.of({
          ...op,
          data: {
            id: mapped.id,
            entityName: 'banking_account',
            entity: {raw: op.data.entity, unified: mapped},
          } satisfies PostgresInputPayload,
        })
      }
    }
    // Do not allow any other entities to pass through
    return rxjs.EMPTY
  })
}

const mappers = {
  // Should be able to have input and output entity types in here also.
  qbo: {
    purchase: mapper(
      zCast<StrictObj<QBO['Purchase']>>(),
      zBanking.transaction,
      {
        id: 'Id',
        amount: 'TotalAmt',
        currency: 'CurrencyRef.value',
        date: 'TxnDate',
        account_id: 'AccountRef.value',
        account_name: 'AccountRef.name',
        // This is a significant approximation, as there can also be ItemBasedLineDetail as well as
        // multiple lines... However we sit with it for now...
        category_id: (p) =>
          p.Line[0]?.AccountBasedExpenseLineDetail?.AccountRef.value,
        category_name: (p) =>
          p.Line[0]?.AccountBasedExpenseLineDetail?.AccountRef.name,
        description: (p) => p.Line[0]?.Description,
        merchant_id: 'EntityRef.value',
        merchant_name: 'EntityRef.name',
      },
    ),
    account: mapper(zCast<StrictObj<QBO['Account']>>(), zBanking.account, {
      id: 'Id',
      name: 'FullyQualifiedName',
    }),
    category: mapper(zCast<StrictObj<QBO['Account']>>(), zBanking.category, {
      id: 'Id',
      name: 'FullyQualifiedName',
    }),
    vendor: mapper(zCast<StrictObj<QBO['Vendor']>>(), zBanking.merchant, {
      id: 'Id',
      name: 'DisplayName',
    }),
  },
  plaid: {
    transaction: mapper(
      zCast<StrictObj<Plaid['schemas']['Transaction']>>(),
      zBanking.transaction,
      {
        id: 'transaction_id',
        amount: 'amount',
        currency: 'iso_currency_code',
        date: 'date',
        account_id: 'account_id',
        category_name: (p) =>
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
    account: mapper(
      zCast<StrictObj<Plaid['schemas']['AccountBase']>>(),
      zBanking.account,
      {
        id: 'account_id',
        name: 'name',
        current_balance: (a) => a.balances.current ?? undefined,
        currency: (a) => a.balances.iso_currency_code ?? undefined,
      },
    ),
  },
}
