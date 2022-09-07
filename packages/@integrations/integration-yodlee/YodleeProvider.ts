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
  zYodleeInstitution,
  zYodleeProvider,
} from './yodlee.types'
import {
  makeYodleeClient,
  zAccessToken,
  zConfig,
  zUserCreds,
} from './YodleeClient'
import {YodleeFastLink} from './YodleeFastLink'
import {
  CANCELLATION_TOKEN,
  makeSyncProvider,
  useScript,
} from '@ledger-sync/cdk-core'
import {ledgerSyncProviderBase, makePostingsMap} from '@ledger-sync/cdk-ledger'
import type {Standard} from '@ledger-sync/standard'
import type {MergeUnion} from '@ledger-sync/util'
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

const zSettings = zUserCreds.extend({
  /** Used to be _id */
  providerAccountId: z.number(),
  // Cache
  user: zUser.nullish(),
  provider: zYodleeProvider.nullish(),
  providerAccount: zProviderAccount.nullish(),
})

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('yodlee'),
  integrationConfig: zConfig,
  connectionSettings: zSettings,
  institutionData: zYodleeInstitution,
  // Will be addressed again for reconnection
  preConnectInput: zSettings.pick({envName: true, loginName: true}),
  // Should the concept of `ledger` be a thing?
  // Should accessToken be cached based on provider / ledgerId?
  connectInput: zSettings
    .pick({envName: true, loginName: true})
    .extend({accessToken: zAccessToken}),
  /** Should this be named postConnectInput? */
  connectOutput: zSettings
    .pick({
      envName: true, // How do make these not needed?
      loginName: true, // How do make these not needed?
      providerAccountId: true,
      // user / providerId are optional...
    })
    .extend({providerId: z.number()}),
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

  // Should the mappers be in here instead? Or a separate function?
})

export const yodleeProvider = makeSyncProvider({
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
  // is the `id` actually externalId?
  standardMappers: {
    institution: (ins) => ({
      id: `${ins.id}`,
      logoUrl: ins.logo!,
      loginUrl: ins.loginUrl,
      name: ins.name!,
      envName: undefined,
    }),
    connection: (settings) => ({
      id: `${settings.providerAccountId}`,
      displayName:
        settings.provider?.name ?? `Unnamed <${settings.providerAccountId}>`,
    }),
  },
  getPreConnectInputs: ({envName, ledgerId}) => [
    def._preConnOption({
      key: envName,
      label: envName,
      options: {envName, loginName: ledgerId},
    }),
  ],
  preConnect: async ({envName, loginName}, config) => {
    const accessToken = await makeYodleeClient(config, {
      role: 'admin',
      envName,
    }).generateAccessToken(loginName)
    return {accessToken, envName, loginName}
  },
  useConnectHook: (scope) => {
    const loaded = useScript('//cdn.yodlee.com/fastlink/v4/initialize.js')
    return async ({accessToken, envName, loginName}) => {
      await loaded
      const deferred = new Deferred<typeof def['_types']['connectOutput']>()
      scope.openDialog(({hide}) =>
        YodleeFastLink({
          envName,
          fastlinkToken: `Bearer ${accessToken.accessToken}`,
          // providerId: '',
          // providerAccountId: '',
          onSuccess: (data) => {
            console.debug('[yodlee] Did receive successful response', data)
            hide()
            deferred.resolve({
              envName,
              loginName,
              providerAccountId: data.providerAccountId,
              providerId: data.providerId,
            })
          },
          onError: (_data) => {
            const data = _data as MergeUnion<typeof _data>
            console.warn('[yodlee] Did receive an error', data)
            hide()
            deferred.reject(new Error(data.reason ?? data.message))
          },
          onClose: (data) => {
            console.debug('[yodlee] Did close', data)
            hide()
            deferred.reject(CANCELLATION_TOKEN)
          },
        }),
      )
      return deferred.promise
    }
  },

  postConnect: async (
    {envName, loginName, providerAccountId, providerId},
    config,
  ) => {
    const yodlee = makeYodleeClient(config, {role: 'user', envName, loginName})
    const [providerAccount, provider, user] = await Promise.all([
      yodlee.getProviderAccount(providerAccountId),
      yodlee.getProvider(providerId),
      yodlee.getUser(),
    ])

    const settings = def._type('connectionSettings', {
      envName,
      loginName,
      providerAccountId,
      provider,
      providerAccount,
      user,
      accessToken: yodlee.accessToken,
    })

    return {
      externalId: `${providerAccountId}`,
      settings,
      source$: rxjs.EMPTY,
    }
  },

  sourceSync: ({config, settings: {providerAccountId, ...settings}}) => {
    const yodlee = makeYodleeClient(config, {role: 'user', ...settings})
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

  metaSync: ({config}) => {
    const yodlee = makeYodleeClient(config, {role: 'admin', envName: 'sandbox'})
    return rxjs.from(yodlee.iterateInstutitions()).pipe(
      Rx.mergeMap((institutions) => rxjs.from(institutions)),
      Rx.map((ins) => def._insOpData(`${ins.id}`, ins)),
    )
  },
})

const SHOULD_SYNC_HOLDINGS = false
const SHOULD_SYNC_INVESTMENT_TRANSACTIONS = false
