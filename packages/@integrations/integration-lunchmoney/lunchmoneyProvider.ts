import {makeSyncProvider} from '@usevenice/cdk-core'
import {makePostingsMap, veniceProviderBase} from '@usevenice/cdk-ledger'
import {A, compact, parseMoney, Rx, rxjs, z} from '@usevenice/util'

import {
  assetSchema,
  categorySchema,
  makeLunchmoneyClient,
  transactionSchema,
  zConfig,
} from './lunchmoneyClient'

const _def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('lunchmoney'),
  integrationConfig: zConfig,
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: z.discriminatedUnion('_type', [
        assetSchema.extend({_type: z.literal('asset')}),
        categorySchema.extend({_type: z.literal('category')}),
      ]),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: transactionSchema,
    }),
  ]),
})

export const lunchmoneyProviderDef = makeSyncProvider.def.helpers(_def)

export const lunchmoneyProvider = makeSyncProvider({
  ...veniceProviderBase(lunchmoneyProviderDef, {
    sourceMapEntity: {
      account: ({entity: a}) => ({
        id: `${a.id}`,
        entityName: 'account',
        entity:
          a._type === 'asset'
            ? {
                name: compact([a.display_name, a.name]).join(' '),
                institutionName: a.institution_name,
                informationalBalances: {
                  current: A(parseMoney(a.balance), a.currency.toUpperCase()),
                },
                type: (() => {
                  switch (a.subtype_name) {
                    case 'brokerage':
                      return 'asset/brokerage'
                    // TODO: Add more types from LunchMoney
                    default:
                      return 'asset'
                  }
                })(),
              }
            : {
                name: a.name,
                type: a.is_income ? 'income' : 'expense',
              },
      }),
      transaction: ({entity: t}) => ({
        id: `${t.id}`,
        entityName: 'transaction',
        entity: {
          date: t.date,
          // TODO: Verify this logic is correct in a general case.
          // @see https://share.cleanshot.com/TmXwqa
          description:
            t.payee && t.payee !== t.original_name ? '' : t.original_name,
          payee: t.payee,
          notes: t.notes,
          postingsMap: makePostingsMap({
            main: {
              accountExternalId: `${
                t.asset_id ?? t.plaid_account_id
              }` as Id.external,
              amount: A(parseMoney(t.amount), t.currency.toUpperCase()),
            },
            remainder: {
              accountExternalId: `${t.category_id}` as Id.external,
              // TODO: Make this logic better, shouldn't infer something is `main` just because it has external id
              type: 'category',
            },
          }),
        },
      }),
    },
  }),
  sourceSync: ({config}) => {
    const lunchmoney = makeLunchmoneyClient(config)
    async function* iterateEntities() {
      const assets = await lunchmoney.getAssets()
      const categories = await lunchmoney.getCategories()
      yield assets.map((a) =>
        lunchmoneyProviderDef._opData('account', `${a.id}`, {
          ...a,
          _type: 'asset',
        }),
      )

      yield categories.map((c) =>
        lunchmoneyProviderDef._opData('account', `${c.id}`, {
          ...c,
          _type: 'category',
        }),
      )

      for await (const transactions of lunchmoney.iterateAllTransactions({
        debit_as_negative: true,
      })) {
        yield transactions.map((t) =>
          lunchmoneyProviderDef._opData('transaction', `${t.id}`, t),
        )
      }
    }
    return rxjs
      .from(iterateEntities())
      .pipe(
        Rx.mergeMap((ops) =>
          rxjs.from([...ops, lunchmoneyProviderDef._op('commit')]),
        ),
      )
  },
})
