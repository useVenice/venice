import * as plaid from 'plaid'
import type {PlaidError} from 'plaid'
import React from 'react'
import type {
  PlaidAccount as PlaidLinkAccount,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOptions,
} from 'react-plaid-link'
import {usePlaidLink} from 'react-plaid-link'

import {
  CANCELLATION_TOKEN,
  makeSyncProvider,
  zWebhookInput,
} from '@usevenice/cdk-core'
import {
  makePostingsMap,
  makeStandardId,
  shouldSync,
  veniceProviderBase,
} from '@usevenice/cdk-ledger'
import type {
  DurationObjectUnits,
  IAxiosError,
  RequiredOnly,
} from '@usevenice/util'
import {DateTime} from '@usevenice/util'
import {A, Deferred, R, RateLimit, Rx, rxjs, z, zCast} from '@usevenice/util'

import {
  getPlaidAccountBalance,
  getPlaidAccountFullName,
  getPlaidAccountType,
  plaidUnitForCurrency,
} from './legacy/plaid-helpers'
import {inferPlaidEnvFromToken} from './plaid-utils'
import type {ErrorShape} from './plaid.types'
import {
  makePlaidClient,
  zCountryCode,
  zLanguage,
  zPlaidClientConfig,
  zProducts,
  zWebhook,
} from './PlaidClient'

const _def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('plaid'),
  // There is a mixing of cases here... Unfortunately...
  integrationConfig: zPlaidClientConfig.extend({
    clientName: z
      .string()
      .max(30)
      .default('This Application')
      .describe(
        `The name of your application, as it should be displayed in Link.
        Maximum length of 30 characters.
        If a value longer than 30 characters is provided, Link will display "This Application" instead.`,
      ),
    products: zProducts.array().default(['transactions']),
    countryCodes: zCountryCode.array().default(['US']),
    /**
     * When using a Link customization, the language configured
     * here must match the setting in the customization, or the customization will not be applied.
     */
    language: zLanguage.default('en'),
  }),
  connectionSettings: z.object({
    itemId: z.string().nullish(),
    accessToken: z.string(),
    institution: zCast<plaid.Institution | undefined>(),
    item: zCast<plaid.Item | undefined>(),
    status: zCast<plaid.ItemGetResponse['status'] | undefined>(),
    /** Comes from webhook */
    webhookItemError: zCast<ErrorShape>().nullish(),
  }),
  institutionData: zCast<plaid.Institution>(),
  connectInput: z.object({link_token: z.string()}),
  connectOutput: z.object({
    publicToken: z.string(),
    meta: zCast<PlaidLinkOnSuccessMetadata>().optional(),
  }),
  /** "Manually" extending for now, this will get better / safer */
  sourceState: veniceProviderBase.def.sourceState
    .removeDefault()
    .extend({
      transactionSyncCursor: z.string().nullish(),
      /** ISO8601 */
      investmentTransactionEndDate: z.string().nullish(),
    })
    .default({}),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<plaid.AccountBase | PlaidLinkAccount>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<plaid.Transaction | plaid.InvestmentTransaction>(),
    }),
  ]),
  webhookInput: zWebhookInput,
})
const def = makeSyncProvider.def.helpers(_def)

export const plaidProvider = makeSyncProvider({
  ...veniceProviderBase(def, {
    sourceMapEntity: {
      account: ({entity: a}, extConn) => ({
        id: 'account_id' in a ? a.account_id : a.id,
        entityName: 'account',
        entity: {
          name: getPlaidAccountFullName(a, extConn.institution),
          lastFour: a.mask,
          // TODO: Map Plaid account type properly
          type: getPlaidAccountType(a),
          institutionName: extConn.institution?.name,
          informationalBalances: {
            current: getPlaidAccountBalance(a, 'current'),
            available: getPlaidAccountBalance(a, 'available'),
            limit: getPlaidAccountBalance(a, 'limit'),
          },
          defaultUnit: (('balances' in a && a.balances.iso_currency_code) ??
            undefined) as Unit | undefined,
        },
      }),
      transaction: ({entity: t}) => {
        const curr = plaidUnitForCurrency(t)
        const currencyAmount = A(-1 * (t.amount ?? 0), curr)
        const accountExternalId = t.account_id as ExternalId
        if (isInvestmentTransaction(t)) {
          return {
            id: t.investment_transaction_id,
            entityName: 'transaction',
            // TODO: Finish the mapper
            entity: {date: t.date, description: t.name},
          }
        }

        const externalCategory = t.category?.join('/')
        return {
          id: t.transaction_id,
          entityName: 'transaction',
          entity: {
            date: t.date,
            pendingTransactionExternalId:
              t.pending_transaction_id as ExternalId | null,
            description: t.name || '',
            payee: t.merchant_name ?? undefined,
            postingsMap: makePostingsMap({
              main: {
                accountId: makeStandardId(
                  'acct',
                  def.name.value,
                  accountExternalId,
                ) as AccountId,
                accountExternalId,
                amount: currencyAmount,
              },
              // Are there any uncategorized at all for Plaid?
            }),
            externalCategory,
            externalStatus: t.pending ? 'pending' : undefined,
          },
        }
      },
    },
  }),
  // Should this run at runtime rather than sync time? That way we don't have to
  // keep resyncing the 10k institutions from Plaid to make this happen...
  standardMappers: {
    institution: (ins) => ({
      name: ins.name,
      logoUrl: ins.logo ? `data:image/png;base64,${ins.logo}` : undefined,
      loginUrl: ins.url ?? undefined,
      envName: undefined,
    }),
    connection: (settings) => {
      // TODO: Unify item.error and webhookItemError into a single field
      // so we know what the true status of the item is...
      const err =
        (settings.item?.error as PlaidError | null) ?? settings.webhookItemError
      return {
        id: `${settings.itemId}`,
        displayName: settings.institution?.name ?? '',
        status:
          err?.error_code === 'ITEM_LOGIN_REQUIRED'
            ? 'disconnected'
            : err
            ? 'error'
            : 'healthy',
        statusMessage: err?.error_message,
      }
    },
  },
  preConnect: (
    config,
    {envName, userId, connection, institutionExternalId, ...ctx},
  ) =>
    makePlaidClient(config)
      .linkTokenCreate(envName, {
        access_token: connection?.settings.accessToken, // Reconnecting
        institution_id: institutionExternalId
          ? `${institutionExternalId}`
          : undefined, // Probably doesn't work, but we wish it does...
        user: {client_user_id: userId},
        client_name: config.clientName,
        language: config.language,
        ...(!connection?.settings.accessToken && {products: config.products}),
        country_codes: config.countryCodes,
        // Webhook and redirect_uri would be part of the `connection` already.
        // redirect_uri: ctx.redirectUrl,
        webhook: ctx.webhookBaseUrl,
      })
      .then((res) => {
        console.log('willConnect response', res)
        return res
      }),

  useConnectHook: (_) => {
    const [state, setState] = React.useState<{
      options: RequiredOnly<PlaidLinkOptions, 'token'>
      res$: Deferred<(typeof def)['_types']['connectOutput']>
    } | null>(null)

    const plaidLink = usePlaidLink({
      token: null, // Null token prevent plaid from showing the UI but still allows script to be loaded for performance
      ...state?.options,
      // token: 'link-sandbox-49a06045-6ef6-4dfd-ab9a-33dc6380513d',
      // webhook: 'https://6b90-118-99-92-111.ngrok.io/api/webhook/plaid',
      // oauthRedirectUri: 'http://localhost:3000',
      onLoad: () => {
        console.log('[plaid] onLoad')
      },
      onEvent: (event, meta) => {
        console.log('[plaid] onEvent', event, meta)
      },
      onSuccess: (publicToken, meta) => {
        console.log('[plaid] onSuccess', {publicToken, meta})
        state?.res$.resolve({publicToken, meta})
        setState(null)
      },
      onExit: (err) => {
        console.log('[plaid] onExit', err)
        state?.res$.reject(err ?? CANCELLATION_TOKEN)
        setState(null)
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    ;(globalThis as any).plaidLink = plaidLink

    React.useEffect(() => {
      if (!plaidLink.ready || !state) {
        return
      }
      console.log('[plaid] Will open')
      plaidLink.open() // Unfortunately open gets called multiple times due to unmounting.
      // It is a bit of a no-op though, so we should be fine...
      return () => {
        console.log('[plaid] Did unmount...')
      }
    }, [plaidLink, state])

    return async (opts, {institutionExternalId}) => {
      console.log('[plaid] Will connect', opts, plaidLink)
      if (plaidLink.error) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw plaidLink.error
      }
      // TODO: Implement a dialog fallback to tell user to search for the needed
      // institution in the next screen to work around the problem that
      // plaid does not support instiutionId
      console.warn('[plaid] institutionExternalId not handled', {
        institutionExternalId,
      })
      const res$ = new Deferred<(typeof def)['_types']['connectOutput']>()
      setState({options: {token: opts.link_token}, res$})
      return res$.promise
    }
  },

  postConnect: async ({publicToken: public_token, meta}, config) => {
    const client = makePlaidClient(config)
    const envName = inferPlaidEnvFromToken(public_token)
    const [res, insRes] = await Promise.all([
      client.itemPublicTokenExchange({public_token}),
      meta?.institution?.institution_id && envName
        ? client.institutionsGetById(envName, {
            institution_id: meta.institution.institution_id,
            // Is this right? Get all country codes...
            country_codes: [
              'US',
              'GB',
              'ES',
              'NL',
              'FR',
              'IE',
              'CA',
              'DE',
              'IT',
            ],
            options: {include_optional_metadata: true},
          })
        : null,
    ])
    const settings = def._type('connectionSettings', {
      itemId: res.item_id,
      accessToken: res.access_token,
      institution: insRes?.institution,
    })

    // Emit itemId
    return {
      connectionExternalId: res.item_id,
      settings,
      institution: insRes?.institution && {
        externalId: insRes.institution.institution_id,
        data: insRes.institution,
      },
      source$: rxjs.from(
        (meta?.accounts ?? []).map((a) => def._opData('account', a.id, a)),
      ),
      triggerDefaultSync: true,
    }
  },

  checkConnection: async ({config, settings, options, context}) => {
    console.log('[Plaid] checkConnection', options, context)
    const client = makePlaidClient(config)
    const envName = inferPlaidEnvFromToken(settings.accessToken)
    const itemId: string =
      settings.itemId ??
      settings.item?.item_id ??
      (await client.itemGet(settings.accessToken).then((r) => r.item.item_id))
    const connUpdate = {envName, connectionExternalId: itemId}

    if (options.updateWebhook) {
      await client.itemWebhookUpdate({
        access_token: settings.accessToken,
        webhook: context.webhookBaseUrl,
      })
      return {
        ...connUpdate,
        triggerDefaultSync: true, // to update settings.item.webhook
        // postgres deepMerge is not implemented yet
        // settings: {item: {webhook: context.webhookBaseUrl}},
      }
    }
    if (options.sandboxSimulateUpdate) {
      await client.sandboxItemFireWebhook({
        access_token: settings.accessToken,
        // webbook_type defaults to `ITEM`, but if `ITEM` is explicitly
        // passed in, it would unfortunately error @see https://share.cleanshot.com/ZfZU3U
        // webhook_type: plaid.WebhookType.Item,
        webhook_code:
          plaid.SandboxItemFireWebhookRequestWebhookCodeEnum.DefaultUpdate,
      })
    }
    if (options.sandboxSimulateDisconnect) {
      await client.sandboxItemResetLogin({access_token: settings.accessToken})
      // To immediate get item to be in a loginRequired state, as it is hard for us to
      // generate an item error and put it inside settings.item.
      // And because this call does nto appear to trigger any webhook
      return {...connUpdate, triggerDefaultSync: true}
    }
    return connUpdate
  },

  revokeConnection: (settings, config) =>
    makePlaidClient(config)
      .itemRemove(settings.accessToken)
      .catch((err: IAxiosError) => {
        // TODO: Centralize me inside PlaidClient...
        if (
          err.isAxiosError &&
          (err.response?.data as PlaidError | undefined)?.error_code ===
            'ITEM_NOT_FOUND'
        ) {
          console.log('plaidError', err.response?.data)
          return
        }
        throw err
      }),

  sourceSync: ({config, settings, state}) => {
    const client = makePlaidClient(config)

    async function* iterateEntities() {
      // Sync item
      const {accessToken} = settings
      const accountIds = state.accountIds?.length ? state.accountIds : null
      const {item, status} = await client.itemGet(accessToken)

      const institution =
        item.institution_id && shouldSync(state, 'institution')
          ? await client
              .institutionsGetById(inferPlaidEnvFromToken(accessToken), {
                institution_id: item.institution_id,
                country_codes: config.countryCodes,
                options: {include_optional_metadata: true},
              })
              .then((r) => r.institution)
          : undefined

      const {item_id: itemId} = item
      yield [
        def._opConn(itemId, {
          envName:
            shouldSync(state, 'connection') &&
            inferPlaidEnvFromToken(settings.accessToken),
          settings: shouldSync(state, 'connection') && {
            item,
            status,
            // Clear previous webhook error since item is now up to date
            webhookItemError: null,
            itemId,
            accessToken,
            institution,
          },
          institution: institution && {
            externalId: institution.institution_id,
            data: institution,
          },
        }),
      ]
      if (item.error) {
        console.log('Exiting sourceSync early due to itemError', item.error)
        return
      }

      // Sync accounts
      let holdingsRes: plaid.InvestmentsHoldingsGetResponse | undefined | null
      if (shouldSync(state, 'account')) {
        const {accounts} = await client.accountsGet({
          access_token: accessToken,
          options: {...(accountIds && {account_ids: accountIds})},
        })
        yield accounts.map((a) => def._opData('account', a.account_id, a))

        await invHoldingsGetLimit()
        holdingsRes = await client
          .investmentsHoldingsGet({
            access_token: accessToken,
            options: {...(accountIds && {account_ids: accountIds})},
          })
          // TODO: Centralize me inside PlaidClient...
          .catch((err: IAxiosError) => {
            const code =
              err.isAxiosError &&
              (err.response?.data as PlaidError | undefined)?.error_code
            // Do not crash in case we run into this.
            if (
              // client is not authorized to access the following products: ["investments"]
              code === 'INVALID_PRODUCT' ||
              // "error_message": "the following products are not supported by this institution: [\"investments\"]",
              code === 'PRODUCTS_NOT_SUPPORTED'
            ) {
              return null
            }
            throw err
          })

        if (holdingsRes) {
          const {
            holdings,
            securities,
            accounts: investmentAccounts,
          } = holdingsRes
          console.log('investmentsHoldingsGet', {
            holdings,
            securities,
            investmentAccounts,
            accounts,
          })
        }
      }

      if (!shouldSync(state, 'transaction')) {
        return
      }

      // Sync transactions
      let cursor = state.transactionSyncCursor ?? undefined
      while (true) {
        const res = await client
          .transactionsSync({
            access_token: accessToken,
            cursor,
            options: {include_personal_finance_category: true},
          })
          .catch((err: IAxiosError) => {
            const code =
              err.isAxiosError &&
              (err.response?.data as PlaidError | undefined)?.error_code
            // Do not crash in case we run into this.
            if (
              code === 'TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION' &&
              cursor !== undefined
            ) {
              cursor = undefined // Restart from scratch
              return null
            }
            throw err
          })
        // Only reason it would be null is if TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION
        // Gotta be careful of running into an infinite loop though. However it would eventually time out
        if (!res) {
          continue
        }

        cursor = res.next_cursor
        yield [
          ...[...res.added, ...res.modified]
            .filter((t) => !accountIds || accountIds.includes(t.account_id))
            .map((t) => def._opData('transaction', t.transaction_id, t)),
          ...R.pipe(
            res.removed,
            R.map((t) => t.transaction_id),
            R.compact,
            R.map((id) => def._opData('transaction', id, null)),
          ),
          def._opState({transactionSyncCursor: cursor}),
        ]
        if (!res.has_more) {
          break
        }
      }

      // Sync investment transactions
      if (holdingsRes) {
        // TODO: QA the incremental sync logic given that we are syncing
        // from the most recent to the least recent. Most of the time it should
        // be the other way around. Maybe combine responsiveness along with
        const sinceDate =
          (state.investmentTransactionEndDate &&
            DateTime.fromISO(state.investmentTransactionEndDate, {
              zone: 'UTC',
            })) ||
          DateTime.fromMillis(0)
        // Eliminate any effect of timezones by just adding a day
        let end = DateTime.utc().plus({days: 1})
        // Fetch 100 transactions over last 90 days only on the first request to optimize
        // for incremental sync scenarios
        let count = 100
        let dur: DurationObjectUnits = {days: 90}

        while (end > sinceDate) {
          // Specifying epoch zero seems to cause Plaid to freeze... So here's
          // our workaround
          const start = end.minus(dur)

          let offset = 0
          while (true) {
            await invTxnGetLimit()
            const invTxnRes = await client.investmentsTransactionsGet({
              access_token: accessToken,
              start_date: start.toISODate(),
              end_date: end.toISODate(),
              options: {
                ...(accountIds && {account_ids: accountIds}),
                count,
                offset,
              },
            })
            yield invTxnRes.investment_transactions.map((t) =>
              def._opData('transaction', t.investment_transaction_id, t),
            )

            offset += invTxnRes.investment_transactions.length
            // Now we can fetch more
            count = 500
            dur = {years: 1}
            if (offset >= invTxnRes.total_investment_transactions) {
              break
            }
          }
          end = start
        }
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, def._op('commit')])))
  },

  metaSync: ({config}) => {
    // Rate limit is easily exceeded, so we will have to introduce
    // a management layer for that, which will be process-wide and
    // eventually distributed rate limiter too
    // @see https://share.cleanshot.com/w7xCNK
    const client = makePlaidClient(config)
    async function* iterateInstitutions() {
      let offset = 0
      while (true) {
        console.log('Awaiting rate limit')
        await insGetLimit()
        const institutions = await client.institutionsGet('sandbox', {
          offset,
          count: 500,
          country_codes: ['US', 'CA', 'GB'],
          options: {include_optional_metadata: true},
        })
        if (institutions.institutions.length === 0) {
          break
        }
        yield institutions.institutions.map((ins) =>
          def._insOpData(ins.institution_id, ins),
        )
        offset += institutions.institutions.length
      }
    }
    return rxjs
      .from(iterateInstitutions())
      .pipe(Rx.mergeMap((ops) => rxjs.from(ops)))
  },

  // TODO(P2): Verify Plaid webhook authenticity for added security.
  // https://plaid.com/docs/#webhook-verification
  handleWebhook: (input) => {
    const webhook = zWebhook.parse(input.body)
    console.log('[plaid] Received webhook', webhook)
    const DEFAULT_SYNC = def._webhookReturn(webhook.item_id, {
      triggerDefaultSync: true,
    })
    switch (webhook.webhook_type) {
      case 'ITEM': {
        switch (webhook.webhook_code) {
          case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
            return {connectionUpdates: []}
          case 'ERROR':
            // delegate.patchConnection({error: webhook.error})
            // await delegate.commit()
            console.error('[plaid] ITEM webhook error', webhook)
            return def._webhookReturn(webhook.item_id, {
              source$: rxjs.of(
                def._opConn(webhook.item_id, {
                  settings: {webhookItemError: webhook.error},
                }),
              ),
            })
        }
      }
      case 'TRANSACTIONS': {
        switch (webhook.webhook_code) {
          case 'INITIAL_UPDATE':
          case 'HISTORICAL_UPDATE':
            return DEFAULT_SYNC
          // return [{connectionExternalId, triggerDefaultSync: true}] // Incremental false?
          case 'DEFAULT_UPDATE':
            return DEFAULT_SYNC
          case 'TRANSACTIONS_REMOVED':
            return def._webhookReturn(webhook.item_id, {
              source$: rxjs.from(
                webhook.removed_transactions.map((tid) =>
                  def._opData('transaction', tid, null),
                ),
              ),
            })
        }
      }
      case 'HOLDINGS': {
        switch (webhook.webhook_code) {
          case 'DEFAULT_UPDATE':
            return DEFAULT_SYNC
        }
      }
      case 'INVESTMENTS_TRANSACTIONS': {
        switch (webhook.webhook_code) {
          case 'DEFAULT_UPDATE':
            return DEFAULT_SYNC
        }
      }
    }

    console.warn('[plaid] Unhandled webhook', webhook)
    return {connectionUpdates: []}
  },
})

function isInvestmentTransaction(
  txn: plaid.Transaction | plaid.InvestmentTransaction,
): txn is plaid.InvestmentTransaction {
  return 'investment_transaction_id' in txn
}

// Per client limit.
// TODO: Account for different rate limits for sandbox vs development & prduction
// TODO: Use a distributed rate limiter (maybe airbyte has one?) to go across more than
// a single process
/**
 * Institution get rate limit.. Not accounting for per item or per client yet...
 * https://plaid.com/docs/errors/rate-limit-exceeded/#production-and-development-rate-limits
 *
 * 10 requests per min is the limit in sandbox, we do 8 to be safe.
 * All of plaid's rate limits are per-minute...
 */
const insGetLimit = RateLimit(7, {timeUnit: 60 * 1000})

// Per item limits.
// TODO: Make these per item

/** 15 req / item / min. We do 10 to be safe */
const invHoldingsGetLimit = RateLimit(10, {timeUnit: 60 * 1000})
/** 30 req / item / min. We do 20 to be safe */
const invTxnGetLimit = RateLimit(20, {timeUnit: 60 * 1000})
