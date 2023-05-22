import * as plaid from 'plaid'
import type {PlaidApi, PlaidError} from 'plaid'
import {CountryCode, Products} from 'plaid'
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
import {
  A,
  DateTime,
  Deferred,
  R,
  RateLimit,
  Rx,
  rxjs,
  z,
  zCast,
} from '@usevenice/util'

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
  zPlaidEnvName,
  zProducts,
  zWebhook,
} from './PlaidClient'

const _def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('plaid'),
  // There is a mixing of cases here... Unfortunately...
  integrationConfig: z.object({
    envName: zPlaidEnvName,
    clientId: z.string(),
    clientSecret: z.string(),
    clientName: z
      .string()
      .max(30)
      .default('This Application')
      .describe(
        `The name of your application, as it should be displayed in Link.
        Maximum length of 30 characters.
        If a value longer than 30 characters is provided, Link will display "This Application" instead.`,
      ),
    products: z.array(zProducts).default([Products.Transactions]),
    countryCodes: z
      .array(zCountryCode)
      .default([CountryCode.Us, CountryCode.Ca]),
    /**
     * When using a Link customization, the language configured
     * here must match the setting in the customization, or the customization will not be applied.
     */
    language: zLanguage.default('en'),
  }),
  resourceSettings: z.object({
    itemId: z.string().nullish(),
    accessToken: z.string(),
    institution: zCast<plaid.Institution | undefined>(),
    item: zCast<plaid.Item | undefined>(),
    status: zCast<plaid.ItemGetResponse['status'] | undefined>(),
    /** Comes from webhook */
    webhookItemError: zCast<ErrorShape>().nullish(),
  }),
  institutionData: zCast<plaid.Institution>(),
  preConnectInput: z.object({
    ...(process.env.NODE_ENV === 'production'
      ? {}
      : // Development mode only
        {sandboxPublicTokenCreate: z.boolean().optional()}),
    language: zLanguage.optional(),
  }),
  connectInput: z.union([
    z.object({link_token: z.string()}),
    z.object({public_token: z.string()}),
  ]),
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

      syncInvestments: z.boolean().nullish(),
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
  metadata: {
    categories: ['banking'],
    displayName: 'Plaid',
    stage: 'ga',
    /** https://commons.wikimedia.org/wiki/File:Plaid_logo.svg */
    logoSvg:
      '<svg width="126" height="48" viewBox="0 0 126 48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Plaid logo</title><defs><path id="a" d="M0 47.473h126V0H0z"/></defs><g fill="none" fill-rule="evenodd"><path d="M66.248 16.268c-1.057-.889-2.861-1.333-5.413-1.333h-5.756v17.788h4.304v-5.575h1.928c2.34 0 4.056-.515 5.148-1.546 1.23-1.155 1.849-2.693 1.849-4.613 0-1.991-.687-3.565-2.06-4.721m-5.044 6.855h-1.821V18.96h1.636c1.99 0 2.985.698 2.985 2.094 0 1.378-.934 2.068-2.8 2.068M75.673 14.934h-4.488v17.788h9.69v-4.026h-5.202zM89.668 14.934l-7.05 17.788h4.832l.924-2.586H94.5l.845 2.586h4.886l-7-17.788h-3.563zm-.053 11.601l1.849-6.08 1.82 6.08h-3.67z" fill="#111"/><mask id="b" fill="#fff"><use xlink:href="#a"/></mask><path fill="#111" mask="url(#b)" d="M102.473 32.722h4.489V14.934h-4.489zM124.39 18.268a7.376 7.376 0 0 0-2.14-2.053c-1.355-.854-3.204-1.28-5.545-1.28h-5.914v17.787h6.918c2.5 0 4.506-.817 6.02-2.453 1.514-1.635 2.27-3.805 2.27-6.508 0-2.15-.537-3.981-1.61-5.493m-7.182 10.427h-1.927v-9.734h1.954c1.373 0 2.428.43 3.168 1.287.74.857 1.11 2.073 1.11 3.647 0 3.2-1.435 4.8-4.305 4.8M18.637 0L4.09 3.81.081 18.439l5.014 5.148L0 28.65l3.773 14.693 14.484 4.047 5.096-5.064 5.014 5.147 14.547-3.81 4.008-14.63-5.013-5.146 5.095-5.063L43.231 4.13 28.745.083l-5.094 5.063L18.637 0zM9.71 6.624l7.663-2.008 3.351 3.44-4.887 4.856L9.71 6.624zm16.822 1.478l3.405-3.383 7.63 2.132-6.227 6.187-4.808-4.936zM4.672 17.238l2.111-7.705 6.125 6.288-4.886 4.856-3.35-3.44zm29.547-1.243l6.227-6.189 1.986 7.74-3.404 3.384-4.809-4.935zm-15.502-.127l4.887-4.856 4.807 4.936-4.886 4.856-4.808-4.936zm-7.814 7.765l4.886-4.856 4.81 4.936-4.888 4.856-4.808-4.936zm15.503.127l4.886-4.856L36.1 23.84l-4.887 4.856-4.807-4.936zM4.57 29.927l3.406-3.385 4.807 4.937-6.225 6.186-1.988-7.738zm14.021 1.598l4.887-4.856 4.808 4.936-4.886 4.856-4.809-4.936zm15.502.128l4.887-4.856 3.351 3.439-2.11 7.705-6.128-6.288zm-24.656 8.97l6.226-6.189 4.81 4.936-3.406 3.385-7.63-2.133zm16.843-1.206l4.886-4.856 6.126 6.289-7.662 2.007-3.35-3.44z"/></g></svg>',
  },
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
      categories: ['banking'],
    }),
    resource: (settings) => {
      // TODO: Unify item.error and webhookItemError into a single field
      // so we know what the true status of the item is...
      const err =
        (settings.item?.error as PlaidError | null) ?? settings.webhookItemError
      const envName = inferPlaidEnvFromToken(settings.accessToken)
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
        labels: [envName],
      }
    },
  },
  // TODO: Do we actually need the preConnect and postConnect phase at all?
  // What if everything is encapsulated in useConnectHook and integrations each get to
  // expose trpc endpoints that the frontend can call at will?
  // That can solve for things like custom API endpoints that we do not have the right abstraction for
  // (such as sandboxFireWebhook, or sandboxLinkTokenCreate)
  // Should also be easier for newcomers to reason about
  // new methods
  // - prefetch
  // - connect
  // - commandsForResource
  preConnect: (
    config,
    {extEndUserId: userId, resource, institutionExternalId, ...ctx},
    input,
  ) => {
    if (input.sandboxPublicTokenCreate) {
      return makePlaidClient(config)
        .sandboxPublicTokenCreate({
          initial_products: [Products.Transactions],
          institution_id: 'ins_109508', // First Platipus bank
        })
        .then(({data: res}) => res)
    }
    return makePlaidClient(config)
      .linkTokenCreate({
        access_token: resource?.settings.accessToken, // Reconnecting
        institution_id: institutionExternalId
          ? `${institutionExternalId}`
          : undefined, // Probably doesn't work, but we wish it does...
        user: {client_user_id: userId},
        client_name: config.clientName,
        language: input.language ?? config.language,
        ...(!resource?.settings.accessToken && {products: config.products}),
        country_codes: config.countryCodes,
        // Webhook and redirect_uri would be part of the `resource` already.
        // redirect_uri: ctx.redirectUrl,
        webhook: ctx.webhookBaseUrl,
      })
      .then(({data: res}) => {
        console.log('willConnect response', res)
        return res
      })
  },

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

    const {open, ready} = plaidLink

    React.useEffect(() => {
      console.log('[plaid] useEffect may open', {ready, state})
      if (ready && state) {
        console.log('[plaid] Will open')
        open() // Unfortunately open gets called multiple times due to unmounting.
        // It is a bit of a no-op though, so we should be fine...
      }
      return () => {
        console.log('[plaid] useEffect did cleanup...')
      }
    }, [open, ready, state])

    return async (opts, {institutionExternalId}) => {
      console.log('[plaid] Will connect', opts, plaidLink)
      if ('public_token' in opts) {
        return {publicToken: opts.public_token}
      }
      if (plaidLink.error) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw plaidLink.error
      }
      // TODO: Implement a dialog fallback to tell user to search for the needed
      // institution in the next screen to work around the problem that
      // plaid does not support instiutionId
      if (institutionExternalId) {
        console.warn('[plaid] institutionExternalId not handled', {
          institutionExternalId,
        })
      }
      const res$ = new Deferred<(typeof def)['_types']['connectOutput']>()
      setState({options: {token: opts.link_token}, res$})
      return res$.promise
    }
  },

  postConnect: async ({publicToken: public_token, meta}, config) => {
    const client: PlaidApi = makePlaidClient(config)

    const [{data: res}, {data: insRes}] = await Promise.all([
      client.itemPublicTokenExchange({public_token}),
      meta?.institution?.institution_id && config.envName
        ? client.institutionsGetById({
            institution_id: meta.institution.institution_id,
            // Is this right? Get all country codes...
            country_codes: [
              CountryCode.Us,
              CountryCode.Gb,
              CountryCode.Es,
              CountryCode.Nl,
              CountryCode.Fr,
              CountryCode.Ie,
              CountryCode.Ca,
              CountryCode.De,
              CountryCode.It,
            ],
            options: {include_optional_metadata: true},
          })
        : {data: null},
    ])
    console.log('[Plaid post connect]', res, insRes)
    // We will wait to sync the institution until later
    const settings = def._type('resourceSettings', {
      itemId: res.item_id,
      accessToken: res.access_token,
      institution: insRes?.institution,
    })

    // Emit itemId
    return {
      resourceExternalId: res.item_id,
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

  checkResource: async ({config, settings, options, context}) => {
    console.log('[Plaid] checkResource', options, context)
    const client = makePlaidClient(config)

    const itemId: string =
      settings.itemId ??
      settings.item?.item_id ??
      (await client
        .itemGet({access_token: settings.accessToken})
        .then((r) => r.data.item.item_id))
    const resoUpdate = {resourceExternalId: itemId}

    if (options.updateWebhook) {
      await client.itemWebhookUpdate({
        access_token: settings.accessToken,
        webhook: context.webhookBaseUrl,
      })
      return {
        ...resoUpdate,
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
      return {...resoUpdate, triggerDefaultSync: true}
    }
    return resoUpdate
  },

  revokeResource: (settings, config) =>
    makePlaidClient(config)
      .itemRemove({access_token: settings.accessToken})
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
    const {accessToken} = settings
    // Explicit typing to make TS Compiler job easier...
    const client: PlaidApi = makePlaidClient(config)

    async function* iterateEntities() {
      // Sync item
      const accountIds = state.accountIds?.length ? state.accountIds : null
      const {
        data: {item, status},
      } = await client.itemGet({access_token: accessToken})

      const institution =
        item.institution_id && shouldSync(state, 'institution')
          ? await client
              .institutionsGetById({
                institution_id: item.institution_id,
                country_codes: config.countryCodes,
                options: {include_optional_metadata: true},
              })
              .then((r) => r.data.institution)
          : undefined

      const {item_id: itemId} = item
      yield [
        def._opRes(itemId, {
          settings: shouldSync(state, 'resource') && {
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
      if (shouldSync(state, 'account')) {
        const {
          data: {accounts},
        } = await client.accountsGet({
          access_token: accessToken,
          options: {...(accountIds && {account_ids: accountIds})},
        })
        yield accounts.map((a) => def._opData('account', a.account_id, a))
      }

      let holdingsRes: plaid.InvestmentsHoldingsGetResponse | undefined | null
      // Investments shall be explicitly enabled for now...
      if (shouldSync(state, 'account') && state.syncInvestments) {
        await invHoldingsGetLimit()
        holdingsRes = await client
          .investmentsHoldingsGet({
            access_token: accessToken,
            options: {...(accountIds && {account_ids: accountIds})},
          })
          .then((r) => r.data)
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
          .then((r) => r.data)
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
            const {data: invTxnRes} = await client.investmentsTransactionsGet({
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
        const {data: institutions} = await client.institutionsGet({
          offset,
          count: 500,
          country_codes: [CountryCode.Us, CountryCode.Ca, CountryCode.Gb],
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
            return {resourceUpdates: []}
          case 'ERROR':
            // delegate.patchResource({error: webhook.error})
            // await delegate.commit()
            console.error('[plaid] ITEM webhook error', webhook)
            return def._webhookReturn(webhook.item_id, {
              source$: rxjs.of(
                def._opRes(webhook.item_id, {
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
          // return [{resourceExternalId, triggerDefaultSync: true}] // Incremental false?
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
    return {resourceUpdates: []}
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
