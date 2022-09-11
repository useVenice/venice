import type * as plaid from 'plaid'
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
} from '@ledger-sync/cdk-core'
import {
  ledgerSyncProviderBase,
  makePostingsMap,
  makeStandardId,
} from '@ledger-sync/cdk-ledger'
import type {RequiredOnly} from '@ledger-sync/util'
import {splitPrefixedId} from '@ledger-sync/util'
import {A, Deferred, R, RateLimit, Rx, rxjs, z, zCast} from '@ledger-sync/util'

import {
  getPlaidAccountBalance,
  getPlaidAccountFullName,
  getPlaidAccountType,
  plaidUnitForCurrency,
} from './legacy/plaid-helpers'
import {inferPlaidEnvFromToken} from './plaid-utils'
import type {ErrorShape} from './plaid.types'
import {makePlaidClient, zPlaidClientConfig, zWebhook} from './PlaidClient'

const _def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('plaid'),
  // There is a mixing of cases here... Unfortunately...
  integrationConfig: zPlaidClientConfig.extend({
    clientName: z.string().max(30),
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
  sourceSyncOptions: ledgerSyncProviderBase.def.sourceSyncOptions
    .removeDefault()
    .extend({
      transactionSyncCursor: z.string().nullish(),
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
      entity: zCast<plaid.Transaction>(),
    }),
  ]),
  webhookInput: zWebhookInput,
})
const def = makeSyncProvider.def.helpers(_def)

export const plaidProvider = makeSyncProvider({
  ...ledgerSyncProviderBase(def, {
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
        const accountExternalId = t.account_id as Id.external
        const externalCategory = t.category?.join('/')
        return {
          id: t.transaction_id,
          entityName: 'transaction',
          entity: {
            date: t.date,
            pendingTransactionExternalId:
              t.pending_transaction_id as Id.external | null,
            description: t.name || '',
            payee: t.merchant_name ?? undefined,
            postingsMap: makePostingsMap({
              main: {
                accountId: makeStandardId(
                  'acct',
                  def.name.value,
                  accountExternalId,
                ) as Id.acct,
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
    connection(settings) {
      const err = settings.item?.error as PlaidError | null
      return {
        id: `${settings.itemId}`,
        displayName: settings.institution?.name ?? '',
        institution: settings.institution
          ? {
              // TODO: Figure out how not to repeat ourselves here...
              ...this.institution!(settings.institution),
              id: `ins_plaid_${settings.institution.institution_id}`, // Need to fix me...
              envName: inferPlaidEnvFromToken(settings.accessToken),
            }
          : undefined,
        institutionId: `ins_plaid_${settings.item?.institution_id}`, // Need to fix me...
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
  preConnect: (config, {envName, ledgerId, connection, institutionId}) => {
    const insId = institutionId && splitPrefixedId(institutionId)[2]
    return makePlaidClient(config)
      .linkTokenCreate(envName, {
        access_token: connection?.settings.accessToken, // Reconnecting
        institution_id: insId ?? undefined, // Probably doesn't work, but we wish it does...
        user: {client_user_id: ledgerId},
        client_name: config.clientName,
        // TODO: Move these into config instead...
        language: 'en',
        ...(!connection?.settings.accessToken && {products: ['transactions']}),
        country_codes: ['US'],
        // Webhook and redirect_uri would be part of the `connection` already.
        redirect_uri: 'http://localhost:3000/oauth',
        webhook: 'https://6b90-118-99-92-111.ngrok.io/api/webhook/plaid',
      })
      .then((res) => {
        console.log('willConnect response', res)
        return res
      })
  },

  useConnectHook: (_) => {
    console.log('[plaid] useConnectHook')
    const [state, setState] = React.useState<{
      options: RequiredOnly<PlaidLinkOptions, 'token'>
      res$: Deferred<typeof def['_types']['connectOutput']>
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
        state?.res$.resolve({publicToken, meta: meta as any})
        setState(null)
      },
      onExit: (err) => {
        console.log('[plaid] onExit', err)
        state?.res$.reject(err ?? CANCELLATION_TOKEN)
        setState(null)
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(globalThis as any).plaidLink = plaidLink

    React.useEffect(() => {
      if (plaidLink.ready && state) {
        console.log('[plaid] Will open')
        plaidLink.open() // Unfortunately open gets called multiple times due to unmounting.
        // It is a bit of a no-op though, so we should be fine...
      }
      return () => {
        console.log('[plaid] Did unmount...')
      }
    }, [plaidLink, state])

    return async (opts, {institutionId}) => {
      console.log('[plaid] Will connect', opts, plaidLink)
      if (plaidLink.error) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw plaidLink.error
      }
      // TODO: Implement a dialog fallback to tell user to search for the needed
      // institution in the next screen to work around the problem that
      // plaid does not support instiutionId
      console.warn('[plaid] institutionId not handled', {institutionId})
      const res$ = new Deferred<typeof def['_types']['connectOutput']>()
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
        id: insRes.institution.institution_id,
        data: insRes.institution,
      },
      source$: rxjs.from(
        (meta?.accounts ?? []).map((a) => def._opData('account', a.id, a)),
      ),
      triggerSync: true,
    }
  },

  revokeConnection: (input, config) =>
    makePlaidClient(config).itemRemove(input.accessToken),

  sourceSync: ({config, settings, options}) => {
    const client = makePlaidClient(
      config as typeof def['_types']['integrationConfig'],
    )
    async function* iterateEntities() {
      // Sync item
      const {accessToken} = settings
      const accountIds = options.accountIds?.length ? options.accountIds : null
      const {item, status} = await client.itemGet(accessToken)

      const institution = item.institution_id
        ? await client
            .institutionsGetById(inferPlaidEnvFromToken(accessToken), {
              institution_id: item.institution_id,
              country_codes: ['US'],
              options: {include_optional_metadata: true},
            })
            .then((r) => r.institution)
        : undefined

      const {item_id: itemId} = item
      yield [
        def._opConn(itemId, {
          settings: {item, status, itemId, accessToken, institution},
          institution: institution && {
            id: institution.institution_id,
            data: institution,
          },
        }),
      ]

      // Sync accounts
      const {accounts} = await client.accountsGet({
        access_token: accessToken,
        options: {...(accountIds && {account_ids: accountIds})},
      })
      yield accounts.map((a) => def._opData('account', a.account_id, a))

      // Sync transactions
      let cursor = options.transactionSyncCursor ?? undefined
      while (true) {
        const res = await client.transactionsSync({
          access_token: accessToken,
          cursor,
          options: {include_personal_finance_category: true},
        })

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
          // return [{connectionExternalId, triggerSync: true}] // Incremental false?
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

/**
 * Institution get rate limit.. Not accounting for per item or per client yet...
 * https://plaid.com/docs/errors/rate-limit-exceeded/#production-and-development-rate-limits
 *
 * 10 requests per min is the limit in sandbox, we do 8 to be safe.
 * All of plaid's rate limits are per-minute...
 */
const insGetLimit = RateLimit(7, {timeUnit: 60 * 1000})
