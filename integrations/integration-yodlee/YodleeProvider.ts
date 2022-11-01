import {makeSyncProvider} from '@usevenice/cdk-core'
import {makePostingsMap, veniceProviderBase} from '@usevenice/cdk-ledger'
import type {Standard} from '@usevenice/standard'
import type {Brand} from '@usevenice/util'
import {
  A,
  objectFromObject,
  parseDateTime,
  Rx,
  rxjs,
  z,
  zCast,
} from '@usevenice/util'

import {useYodleeConnect} from './useYodleeConnect'
import {
  getYodleeAccountBalance,
  getYodleeAccountName,
  getYodleeAccountType,
} from './yodlee-utils'
import {
  zProviderAccount,
  zUser,
  zYodleeInstitution,
  zYodleeProvider,
  type YodleeAccount,
  type YodleeTransaction,
} from './yodlee.types'
import type {YodleeEnvName} from './YodleeClient'
import {
  makeYodleeClient,
  zAccessToken,
  zConfig,
  zUserCreds,
  zYodleeId,
} from './YodleeClient'

const zSettings = zUserCreds.extend({
  /** Used to be _id */
  providerAccountId: zYodleeId,
  // Cache
  user: zUser.nullish(),
  provider: zYodleeProvider.nullish(),
  providerAccount: zProviderAccount.nullish(),
})

const _def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('yodlee'),
  integrationConfig: zConfig,
  connectionSettings: zSettings,
  institutionData: zYodleeInstitution,
  // Should accessToken be cached based on provider / ledgerId?
  connectInput: z.object({accessToken: zAccessToken}),
  connectOutput: z.object({
    providerAccountId: zYodleeId,
    providerId: zYodleeId, // Technically optional
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

  // Should the mappers be in here instead? Or a separate function?
})
export const yodleeProviderDef = makeSyncProvider.def.helpers(_def)

export const yodleeProvider = makeSyncProvider({
  ...veniceProviderBase(yodleeProviderDef, {
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
                            lastQuoteDate:
                              parseDateTime(h.lastUpdated)?.toISODate() ?? null,
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
        const accountExternalId = `${t.accountId}` as ExternalId
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
            externalStatus: t.status.toLowerCase() as Brand<
              string,
              'externalStatus'
            >,
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
      logoUrl: ins.logo,
      loginUrl: ins.loginUrl,
      name: ins.name ?? `<${ins.id}>`,
      envName: ins._envName,
    }),
    connection: (settings) => ({
      id: `${settings.providerAccountId}`,
      displayName:
        settings.provider?.name ?? `Unnamed <${settings.providerAccountId}>`,
      status: (() => {
        switch (settings.providerAccount?.status) {
          case 'SUCCESS':
            return 'healthy'
          case 'USER_INPUT_REQUIRED':
            return 'disconnected'
          case 'FAILED':
            // Venmo refresh seems to run into this issue
            if (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              settings.providerAccount.dataset[0]?.updateEligibility ===
              'ALLOW_UPDATE_WITH_CREDENTIALS'
            ) {
              return 'disconnected'
            }
            return 'error'
          // TODO: Handle these three situations
          case 'IN_PROGRESS':
          case 'LOGIN_IN_PROGRESS':
          case 'PARTIAL_SUCCESS':
            return 'healthy'
          default:
            return undefined
        }
      })(),
    }),
  },
  // TODO: handle reconnecting scenario
  preConnect: async (config, {envName, ledgerId}) => {
    const loginName = ledgerId
    const accessToken = await makeYodleeClient(config, {
      role: 'admin',
      envName,
    }).generateAccessToken(loginName)
    return {accessToken}
  },
  // Without closure we get type issues in venice.config.ts, not sure why
  // https://share.cleanshot.com/X3cQDA
  useConnectHook: (scope) => useYodleeConnect(scope),
  postConnect: async (
    {providerAccountId, providerId},
    config,
    {envName, ledgerId: loginName},
  ) => {
    const yodlee = makeYodleeClient(config, {role: 'user', envName, loginName})
    const [providerAccount, provider, user] = await Promise.all([
      yodlee.getProviderAccount(providerAccountId),
      yodlee.getProvider(providerId),
      yodlee.getUser(),
    ])

    return {
      connectionExternalId: providerAccountId,
      settings: {
        envName,
        loginName,
        providerAccountId,
        provider,
        providerAccount,
        user,
        accessToken: yodlee.accessToken,
      },
      institution: provider
        ? {id: providerId, data: {...provider, _envName: envName}}
        : undefined,
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
        ...accounts.map((a) =>
          yodleeProviderDef._opData('account', `${a.id}`, a),
        ),
        ...holdings.map(
          // Need to check on if to use h.id or h.security.id
          (h) => yodleeProviderDef._opData('commodity', `${h.id}`, h),
        ),
      ]
      // TODO(P2): How does yodlee handle pending transactions
      // TODO: Implement incremental sync
      for await (const transactions of yodlee.iterateAllTransactions({
        skipInvestmentTransactions: !SHOULD_SYNC_INVESTMENT_TRANSACTIONS,
        accountId: accounts.map((a) => a.id).join(','),
      })) {
        yield transactions.map((t) =>
          yodleeProviderDef._opData('transaction', `${t.id}`, t),
        )
      }
    }
    return rxjs
      .from(iterateEntities())
      .pipe(
        Rx.mergeMap((ops) =>
          rxjs.from([...ops, yodleeProviderDef._op('commit')]),
        ),
      )
  },

  metaSync: ({config}) => {
    // console.log('[yodlee.metaSync]', config)
    // TODO: Should environment name be part of the yodlee institution id itself?
    const envName: YodleeEnvName = 'sandbox'
    const yodlee = makeYodleeClient(config, {role: 'admin', envName})
    return rxjs.from(yodlee.iterateInstitutions()).pipe(
      Rx.mergeMap((institutions) => rxjs.from(institutions)),
      Rx.map((ins) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        yodleeProviderDef._insOpData(ins.id!, {...ins, _envName: envName}),
      ),
    )
  },
})

const SHOULD_SYNC_HOLDINGS = false
const SHOULD_SYNC_INVESTMENT_TRANSACTIONS = true
