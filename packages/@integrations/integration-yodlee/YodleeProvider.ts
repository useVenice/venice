import {makeSyncProvider} from '@ledger-sync/cdk-core'
import {ledgerSyncProviderBase, makePostingsMap} from '@ledger-sync/cdk-ledger'
import {
  A,
  DateTime,
  objectFromObject,
  parseDateTime,
  Rx,
  rxjs,
  z,
  zCast,
} from '@ledger-sync/util'
import {
  getYodleeAccountBalance,
  getYodleeAccountName,
  getYodleeAccountType,
  parseAccountData,
  YodleeAccount,
  YodleeTransaction,
} from './yodlee-utils'
import {makeYodleeClient, zConfig, zYodleeSettings} from './YodleeClient'

type YodleeSyncOperation = typeof def['_opType']

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('yodlee'),
  integrationConfig: zConfig,
  connectionSettings: zYodleeSettings.omit({config: true}).extend({
    _id: z.string(),
  }),
  connectInput: zYodleeSettings.omit({config: true}).extend({
    _id: z.string(),
  }),
  connectOutput: zYodleeSettings.omit({config: true}).extend({
    _id: z.string(),
  }),
  // preConnectInput: z.object({
  //   envName: z.string(),
  // }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<YodleeAccount>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<YodleeTransaction>(),
    }),
  ]),
})

export const yodleeProviderNext = makeSyncProvider({
  ...ledgerSyncProviderBase(def, {
    sourceMapEntity: {
      account: ({entity: a}, extConn) => ({
        id: `${a.id}`,
        entityName: 'account',
        entity: {
          name: getYodleeAccountName(a),
          lastFour: a.accountNumber?.slice(-4) ?? null,
          type: getYodleeAccountType(a),
          institutionName: extConn.provider?.name,
          removed: a.isDeleted ?? false,
          informationalBalances: {
            available: getYodleeAccountBalance(a, 'availableBalance'),
            current: getYodleeAccountBalance(a, 'balance'),
          },
          defaultUnit: a.currentBalance?.currency as Unit,
          balancesMap: objectFromObject(
            a._balancesMap ?? {},
            (_, val): Standard.Balance => {
              if (val.holdings.length > 0) {
                return {
                  autoShiftPaddingDate: true,
                  holdings: [
                    // Not all holdings come back with a symbol
                    ...val.holdings.map((h): Standard.Holding | null =>
                      h.symbol
                        ? {
                            unit: h.symbol as Unit,
                            quantity: h.quantity,
                            costBasis: h.costBasis
                              ? A(h.costBasis.amount, h.costBasis.currency)
                              : null,
                            lastQuote: h.price
                              ? A(h.price.amount, h.price.currency)
                              : null,
                            lastQuoteDate: parseDateTime(
                              h.lastUpdated,
                            ).toISODate(),
                          }
                        : null,
                    ),
                    // Must add cash value which is not included in holdings.
                    val.balances.cash?.amount
                      ? A(val.balances.cash.amount, val.balances.cash.currency)
                      : null,
                  ].filter((h): h is NonNullable<typeof h> => !!h),
                }
              }
              const current = getYodleeAccountBalance(
                {
                  accountType: a.accountType,
                  CONTAINER: a.CONTAINER,
                  ...val.balances,
                },
                'balance',
              )
              return {
                holdings: current ? [current] : [],
                autoShiftPaddingDate: true,
                disabled: true,
              }
            },
          ),
        },
      }),
      transaction: ({entity: t}) => {
        const accountExternalId = `${t.accountId}` as Id.external
        const sign = t.baseType === 'DEBIT' ? -1 : 1
        const currAmount = A(t.amount.amount * sign, t.amount.currency)

        const isStockTrade =
          t.CONTAINER === 'investment' &&
          (t.type === 'BUY' || t.type === 'SELL') &&
          t.quantity &&
          t.symbol

        const stockSign = t.type === 'SELL' ? -1 : 1

        const stockAmount = isStockTrade
          ? A((t.quantity ?? 0) * stockSign, t.symbol ?? '')
          : undefined
        return {
          id: `${t.id}`,
          entityName: 'transaction',
          entity: {
            date: t.date,
            description: t.description.simple || t.description.original || '',
            payee: t.merchant?.name,

            labelsMap: {},
            externalCategory: t.category,
            externalStatus:
              t.status.toLowerCase() as BrandedString<'externalStatus'>,
            postingsMap: makePostingsMap(
              {main: {accountExternalId, amount: currAmount}},
              // https://stackoverflow.com/questions/38578339/no-way-to-get-per-transaction-commission-fee-in-new-yodlee-api-ysl-restserver
              // How do we get fees from yodlee transaction?
              {trade: stockAmount && {amount: stockAmount, accountExternalId}},
            ),
            removed: t.isDeleted,
          },
        }
      },
    },
  }),
  // getPreConnectInputs: (_) =>
  //   zEnvName.options.map((envName) =>
  //     def._preConnOption({
  //       key: envName,
  //       label: envName,
  //       options: {
  //         envName,
  //       },
  //     }),
  //   ),

  // useConnectHook: (_a: undefined) =>
  //   new Deferred<typeof def['_types']['connectOutput']>().promise,

  postConnect: async (input, config) => {
    const settings = def._type('connectionSettings', {
      ...input,
    })

    const source$: rxjs.Observable<YodleeSyncOperation> =
      yodleeProviderNext.sourceSync({settings, config, options: {}})
    return {
      connectionId: `conn_yodlee_${input._id}`,
      settings,
      source$,
    }
  },
  sourceSync: ({settings, config}) => {
    async function* iterateEntities() {
      const accessToken = await await makeYodleeClient({
        ...settings,
        config,
      }).generateAccessToken({
        ...settings,
        envName: settings.envName,
        loginName: settings.loginName,
      })

      const client = makeYodleeClient({
        ...settings,
        config,
        accessToken,
      })
      const [accounts, holdings] = await Promise.all([
        client.getAccounts({
          envName: settings.envName,
          providerAccountId: settings._id,
        }),
        SHOULD_SYNC_HOLDINGS
          ? client.getHoldingsWithSecurity({
              envName: settings.envName,
              params: {providerAccountId: settings._id},
            })
          : [],
      ])

      yield [
        ...accounts.map((a) =>
          def._opData(
            'account',
            `${a.id}` as Id.external,
            parseAccountData(a, holdings),
          ),
        ),
      ]
      const accountIds = accounts.map((a) => a.id)

      let offset = 0
      let count = 100
      const start = DateTime.fromMillis(0)
      const end = DateTime.local().plus({days: 1})
      while (true) {
        let transactions = await client.getTransactions({
          params: {
            accountId: accountIds.join(','),
            skip: offset,
            top: count,
            fromDate: start.toISODate(),
            toDate: end.toISODate(),
          },
          envName: settings.envName,
        })

        if (transactions.length === 0) {
          break
        }
        transactions = transactions.filter((t) => {
          if (!SHOULD_SYNC_INVESTMENT_TRANSACTIONS) {
            return t.CONTAINER !== 'investment'
          }
          return true
        })
        offset += transactions.length
        count = 500

        yield transactions.map((t) =>
          def._opData('transaction', `${t.id}` as Id.external, t),
        )
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, def._op('commit')])))
  },
})

const SHOULD_SYNC_HOLDINGS = false
const SHOULD_SYNC_INVESTMENT_TRANSACTIONS = false
