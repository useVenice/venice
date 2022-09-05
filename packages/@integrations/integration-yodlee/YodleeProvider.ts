import {
  getYodleeAccountBalance,
  getYodleeAccountName,
  getYodleeAccountType,
} from './yodlee-utils'
import {
  type YodleeAccount,
  type YodleeTransaction,
  zAccessToken,
  zProviderAccount,
  zUser,
  zYodleeProvider,
} from './yodlee.types'
import {makeYodleeClient, zCfg, zCreds, zYodleeEnvName} from './YodleeClient'
import {YodleeFastLink} from './YodleeFastLink'
import {makeSyncProvider, useScript} from '@ledger-sync/cdk-core'
import {ledgerSyncProviderBase, makePostingsMap} from '@ledger-sync/cdk-ledger'
import {A, objectFromObject, parseDateTime, z, zCast} from '@ledger-sync/util'

export const zYodleeConfig = z.record(
  zYodleeEnvName,
  zCfg.omit({envName: true}),
)

const zSettings = zCreds.extend({
  envName: zYodleeEnvName,
  /** Used to be _id */
  providerAccountId: z.string(),
  // Cache
  accessToken: zAccessToken.nullish(),
  user: zUser.nullish(),
  provider: zYodleeProvider.nullish(),
  providerAccount: zProviderAccount.nullish(),
})

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('yodlee'),
  integrationConfig: zYodleeConfig,
  connectionSettings: zSettings,
  // Will be addressed again for reconnection
  preConnectInput: zSettings.pick({envName: true, loginName: true}),
  connectInput: zSettings.pick({accessToken: true}),
  connectOutput: zSettings.pick({
    envName: true, // How do make these not needed?
    loginName: true, // How do make these not needed?
    providerAccountId: true,
  }),
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
  getPreConnectInputs: ({envName, ledgerId}) => [
    def._preConnOption({
      key: envName,
      label: envName,
      options: {envName, loginName: ledgerId},
    }),
  ],

  preConnect: async ({envName, loginName}, config) => {
    const accessToken = await makeYodleeClient(
      {...config[envName]!, envName},
      {loginName},
    ).generateAccessToken(loginName)
    return {accessToken}
  },
  useConnectHook: (_type) => {
    const loaded = useScript('//cdn.yodlee.com/fastlink/v4/initialize.js')
    return async () => {
      // TO something useful here...
      await loaded
      const Comp = YodleeFastLink({envName: 'sandbox', fastlinkToken: ''})
      console.log('Comp', Comp)
      throw new Error('Need to show dialog here of YodleeFastLink')
      // return {envName}
    }
  },

  // useConnectHook: (_a: undefined) =>
  //   new Deferred<typeof def['_types']['connectOutput']>().promise,

  // postConnect: async (input, config) => {
  //   const settings = def._type('connectionSettings', {
  //     ...input,
  //   })

  //   const source$: rxjs.Observable<YodleeSyncOperation> =
  //     yodleeProviderNext.sourceSync({settings, config, options: {}})
  //   return {
  //     externalId: input.providerAccountId,
  //     settings,
  //     source$,
  //   }
  // },
  // sourceSync: ({config, settings}) => {
  //   async function* iterateEntities() {
  //     const accessToken = await makeYodleeClient({
  //       ...settings,
  //       config,
  //     }).generateAccessToken({
  //       ...settings,
  //       envName: settings.envName,
  //       loginName: settings.loginName,
  //     })

  //     const client = makeYodleeClient({
  //       ...settings,
  //       config,
  //       accessToken,
  //     })
  //     const [accounts, holdings] = await Promise.all([
  //       client.getAccounts({
  //         envName: settings.envName,
  //         providerAccountId: settings._id,
  //       }),
  //       SHOULD_SYNC_HOLDINGS
  //         ? client.getHoldingsWithSecurity({
  //             envName: settings.envName,
  //             params: {providerAccountId: settings._id},
  //           })
  //         : [],
  //     ])

  //     yield [
  //       ...accounts.map((a) =>
  //         def._opData(
  //           'account',
  //           `${a.id}` as Id.external,
  //           parseAccountData(a, holdings),
  //         ),
  //       ),
  //     ]
  //     const accountIds = accounts.map((a) => a.id)

  //     let offset = 0
  //     let count = 100
  //     const start = DateTime.fromMillis(0)
  //     const end = DateTime.local().plus({days: 1})
  //     while (true) {
  //       let transactions = await client.getTransactions({
  //         params: {
  //           accountId: accountIds.join(','),
  //           skip: offset,
  //           top: count,
  //           fromDate: start.toISODate(),
  //           toDate: end.toISODate(),
  //         },
  //         envName: settings.envName,
  //       })

  //       if (transactions.length === 0) {
  //         break
  //       }
  //       transactions = transactions.filter((t) => {
  //         if (!SHOULD_SYNC_INVESTMENT_TRANSACTIONS) {
  //           return t.CONTAINER !== 'investment'
  //         }
  //         return true
  //       })
  //       offset += transactions.length
  //       count = 500

  //       yield transactions.map((t) =>
  //         def._opData('transaction', `${t.id}` as Id.external, t),
  //       )
  //     }
  //   }

  //   return rxjs
  //     .from(iterateEntities())
  //     .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, def._op('commit')])))
  // },
})

// const SHOULD_SYNC_HOLDINGS = false
// const SHOULD_SYNC_INVESTMENT_TRANSACTIONS = false
