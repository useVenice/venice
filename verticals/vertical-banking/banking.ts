import * as rxjs from 'rxjs'
import * as Rx from 'rxjs/operators'
import type {AnyEntityPayload, Id, Link} from '@usevenice/cdk'
import type {PlaidSDKTypes} from '@usevenice/connector-plaid'
import type {postgresHelpers} from '@usevenice/connector-postgres'
import type {QBO} from '@usevenice/connector-qbo'
import type {Oas_accounting} from '@usevenice/connector-xero'
import type {StrictObj} from '@usevenice/types'
import type {RouterMap, RouterMeta, VerticalRouterOpts} from '@usevenice/vdk'
import {
  applyMapper,
  mapper,
  proxyCallRemote,
  z,
  zCast,
  zPaginationParams,
} from '@usevenice/vdk'

type Plaid = PlaidSDKTypes['oas']['components']
type Xero = Oas_accounting['components']['schemas']

export const zBanking = {
  transaction: z
    .object({
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
    })
    .openapi({ref: 'banking.transaction'}),
  account: z
    .object({
      id: z.string(),
      name: z.string(),
      current_balance: z.number().optional(),
      currency: z.string().optional(),
    })
    .openapi({ref: 'banking.account'}),
  merchant: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string().nullish(),
    })
    .openapi({ref: 'banking.merchant'}),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .openapi({ref: 'banking.category'}),
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
  source: {
    id: Id['reso']
    connectorConfig: {connectorName: string}
    metadata?: unknown
  }
}): Link<AnyEntityPayload, PostgresInputPayload> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const categories: Record<string, boolean> =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    (ctx.source.metadata as any)?.categories ?? {}

  return Rx.mergeMap((op) => {
    if (op.type !== 'data') {
      return rxjs.of(op)
    }

    if (ctx.source.connectorConfig.connectorName === 'xero') {
      if (op.data.entityName === 'Account') {
        const entity = op.data.entity as Xero['Account']
        if (entity.Class === 'REVENUE' || entity.Class === 'EXPENSE') {
          const mapped = applyMapper(
            mappers.xero.category,
            op.data.entity as Xero['Account'],
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
            mappers.xero.account,
            op.data.entity as Xero['Account'],
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
      if (op.data.entityName === 'BankTransaction') {
        // TODO: Dedupe from  qbo.purchase later
        const mapped = applyMapper(
          mappers.xero.bank_transaction,
          op.data.entity as Xero['BankTransaction'],
        )
        // TODO: Make this better, should at the minimum apply to both Plaid & QBO, options are
        // 1) Banking link needs to take input parameters to determine if by default
        // transactions should go through if metadata is missing or not
        // 2) Banking vertical should include abstraction for account / category selection UI etc.
        // 3) Extract this into a more generic filtering link that works for ANY entity.
        // In addition, will need to handle incremental sync state reset when we change stream filtering
        // parameter like this, as well as deleting the no longer relevant entities in destination
        if (
          // Support both name and ID
          !categories[mapped.category_name ?? ''] &&
          !categories[mapped.category_id ?? '']
        ) {
          console.log(
            `[banking] skip txn ${mapped.id} in ${mapped.category_id}: ${mapped.category_name}`,
          )
          return rxjs.EMPTY
        } else {
          console.log(
            `[banking] allow txn ${mapped.id} in ${mapped.category_id}: ${mapped.category_name}`,
          )
        }
        return rxjs.of({
          ...op,
          data: {
            id: mapped.id,
            entityName: 'banking_transaction',
            entity: {raw: op.data.entity, unified: mapped},
          } satisfies PostgresInputPayload,
        })
      }
    }
    if (ctx.source.connectorConfig.connectorName === 'qbo') {
      if (op.data.entityName === 'purchase') {
        const mapped = applyMapper(
          mappers.qbo.purchase,
          op.data.entity as QBO['Purchase'],
        )
        // TODO: Make this better, should at the minimum apply to both Plaid & QBO, options are
        // 1) Banking link needs to take input parameters to determine if by default
        // transactions should go through if metadata is missing or not
        // 2) Banking vertical should include abstraction for account / category selection UI etc.
        // 3) Extract this into a more generic filtering link that works for ANY entity.
        // In addition, will need to handle incremental sync state reset when we change stream filtering
        // parameter like this, as well as deleting the no longer relevant entities in destination
        if (
          // Support both name and ID
          !categories[mapped.category_name ?? ''] &&
          !categories[mapped.category_id ?? '']
        ) {
          console.log(
            `[banking] skip txn ${mapped.id} in ${mapped.category_id}: ${mapped.category_name}`,
          )
          return rxjs.EMPTY
        } else {
          console.log(
            `[banking] allow txn ${mapped.id} in ${mapped.category_id}: ${mapped.category_name}`,
          )
        }
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
  xero: {
    account: mapper(zCast<StrictObj<Xero['Account']>>(), zBanking.account, {
      id: 'AccountID',
      name: 'Name',
    }),
    category: mapper(zCast<StrictObj<Xero['Account']>>(), zBanking.account, {
      id: 'AccountID',
      name: 'Name',
    }),
    bank_transaction: mapper(
      zCast<StrictObj<Xero['BankTransaction']>>(),
      zBanking.transaction,
      {
        id: 'BankTransactionID',
        amount: 'Total',
        currency: 'CurrencyCode',
        date: 'DateString' as 'Date', // empirically works https://share.cleanshot.com/0c6dlNsF
        account_id: 'BankAccount.AccountID',
        account_name: 'BankAccount.Name',
        merchant_id: 'Contact.ContactID',
        merchant_name: 'Contact.Name',
        category_id: (t) => t.LineItems[0]?.AccountID ?? '',
        description: (t) => t.LineItems[0]?.Description ?? '',
        // Don't have data readily available for these...
        // category_name is not readily available, only ID is provided
      },
    ),
  },
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

function oapi(meta: NonNullable<RouterMeta['openapi']>): RouterMeta {
  const vertical = 'banking'
  return {openapi: {...meta, path: `/verticals/${vertical}${meta.path}`}}
}

export function createBankingRouter(opts: VerticalRouterOpts) {
  const router = opts.trpc.router({
    listCategories: opts.remoteProcedure
      .meta(oapi({method: 'GET', path: '/category'}))
      .input(zPaginationParams.nullish())
      .output(
        z.object({
          hasNextPage: z.boolean(),
          items: z.array(
            zBanking.category.extend({_raw: z.unknown().optional()}),
          ),
        }),
      )
      .query(async ({input, ctx}) => proxyCallRemote({input, ctx, opts})),
  })

  return router
}

export type BankingRouter = ReturnType<typeof createBankingRouter>
export type VerticalBanking<TOpts> = RouterMap<BankingRouter, TOpts>
