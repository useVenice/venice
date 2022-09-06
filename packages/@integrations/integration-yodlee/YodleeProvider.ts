import {
  getYodleeAccountBalance,
  getYodleeAccountName,
  getYodleeAccountType,
} from './yodlee-utils'
import {
  type YodleeAccount,
  type YodleeTransaction,
  zProviderAccount,
  zUser,
  zYodleeProvider,
} from './yodlee.types'
import {
  makeYodleeClient,
  zAccessToken,
  zCfg,
  zCreds,
  zYodleeEnvName,
} from './YodleeClient'
import {YodleeFastLink} from './YodleeFastLink'
import {makeSyncProvider, useScript} from '@ledger-sync/cdk-core'
import {ledgerSyncProviderBase, makePostingsMap} from '@ledger-sync/cdk-ledger'
import type {Standard} from '@ledger-sync/standard'
import {
  A,
  Deferred,
  objectFromObject,
  parseDateTime,
  Rx,
  rxjs,
  z,
  zCast,
} from '@ledger-sync/util'

export const zYodleeConfig = z.record(
  zYodleeEnvName,
  zCfg.omit({envName: true}),
)

const zSettings = zCreds.extend({
  envName: zYodleeEnvName,
  /** Used to be _id */
  providerAccountId: z.number(),
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
    z.object({
      id: z.string(),
      entityName: z.literal('commodity'),
      entity: zCast<Yodlee.HoldingWithSecurity>(),
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
  // FIXME
  preConnect: async () => ({accessToken: {} as any}),
  // preConnect: async ({envName, loginName}, config) => {
  //   const accessToken = await makeYodleeClient(
  //     {...config[envName]!, envName},
  //     {loginName},
  //   ).generateAccessToken(loginName)
  //   return {accessToken}
  // },
  useConnectHook: (scope) => {
    const loaded = useScript('//cdn.yodlee.com/fastlink/v4/initialize.js')
    return async (_input) => {
      await loaded
      const deferred = new Deferred<typeof def['_types']['connectOutput']>()
      scope.openDialog(({hide}) =>
        YodleeFastLink({
          envName: 'sandbox',
          fastlinkToken: '',
          providerId: '',
          providerAccountId: '',
          onSuccess: (data) => {
            console.debug('[yodlee] Did receive successful response', data)
            hide()
            // FIXME
            // deferred.resolve({})
          },
          onError: (data) => {
            console.warn('[yodlee] Did receive an error', data)
            hide()
            deferred.reject(new Error(data.reason))
          },
          onClose: (data) => {
            console.debug('[yodlee] Did close', data)
            hide()
            // FIXME
            // defered.resolve({status: 'cancelled'})
          },
        }),
      )
      return deferred.promise
    }
  },

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

  sourceSync: ({config, settings: {envName, loginName, providerAccountId}}) => {
    const yodlee = makeYodleeClient({...config[envName]!, envName}, {loginName})
    async function* iterateEntities() {
      const [accounts, holdings] = await Promise.all([
        yodlee.getAccounts({providerAccountId}),
        SHOULD_SYNC_HOLDINGS
          ? yodlee.getHoldingsWithSecurity({providerAccountId})
          : Promise.resolve([]),
      ])

      yield [
        ...accounts.map((a) => def._opData('account', `${a.id}`, a)),
        ...holdings.map(
          // Need to check on if to use h.id or h.security.id
          (h) => def._opData('commodity', `${h.id}`, h),
        ),
      ]
      // TODO(P2): How does yodlee handle pending transactions
      // TODO: Implement incremental sync
      for await (const transactions of yodlee.iterateAllTransactions({
        skipInvestmentTransactions: !SHOULD_SYNC_INVESTMENT_TRANSACTIONS,
        accountId: accounts.map((a) => a.id).join(','),
      })) {
        yield transactions.map((t) => def._opData('transaction', `${t.id}`, t))
      }
    }
    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, def._op('commit')])))
  },
})

const SHOULD_SYNC_HOLDINGS = false
const SHOULD_SYNC_INVESTMENT_TRANSACTIONS = false
