import {A, Deferred, R, Rx, rxjs, z, zCast} from '@ledger-sync/util'
import {makeSyncProvider, zWebhookInput} from '@ledger-sync/core-sync'
import {ledgerSyncProviderBase, makePostingsMap} from '@ledger-sync/ledger-sync'
import React from 'react'
import {
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOptions,
  usePlaidLink,
} from 'react-plaid-link'
import {
  getPlaidAccountBalance,
  getPlaidAccountFullName,
  getPlaidAccountType,
  plaidUnitForCurrency,
} from './legacy/plaid-helpers'
import * as plaid from 'plaid'
import {
  makePlaidClient,
  zCountryCode,
  zEnvName,
  zPlaidClientConfig,
  zProducts,
} from './PlaidClientNext'

type PlaidSyncOperation = typeof def['_opType']

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('plaid'),
  // There is a mixing of cases here... Unfortunately...
  integrationConfig: zPlaidClientConfig.extend({
    clientName: z.string().max(30),
  }),
  connectionSettings: z.object({
    // Do we need this field? Or should it be computed based on connId?
    // Making this nullish for now because zConn is used for SyncInput too...
    itemId: z.string().nullish(),
    accessToken: z.string(),
    institution: zCast<plaid.Institution | undefined>(),
    item: zCast<plaid.Item | undefined>(),
    status: zCast<plaid.ItemGetResponse['status'] | undefined>(),
  }),
  preConnectInput: z.object({
    envName: zEnvName,
    clientUserId: z.string(),
    language: z.string(),
    // TODO: Omit me during update mode
    products: z.array(zProducts).nonempty(),
    countryCodes: z.array(zCountryCode).nonempty(),
    /** Need to be tested */
    redirectUri: z.string().optional(),
    // Generally specified server side
    webhook: z.string().optional(),
  }),
  connectInput: z.object({
    link_token: z.string(),
  }),
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
      entity: zCast<
        plaid.AccountBase | PlaidLinkOnSuccessMetadata['accounts'][number]
      >(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<plaid.Transaction>(),
    }),
  ]),
  webhookInput: zWebhookInput,
})

export const plaidProviderNext = makeSyncProvider({
  ...ledgerSyncProviderBase(def, {
    sourceMapEntity: {
      account: ({entity: a}, extConn) => ({
        id: 'account_id' in a ? a.account_id : a.id,
        entityName: 'account',
        entity: {
          name: getPlaidAccountFullName(a, extConn?.institution),
          lastFour: a.mask,
          // TODO: Map Plaid account type properly
          type: getPlaidAccountType(a),
          institutionName: extConn?.institution?.name,
          informationalBalances: {
            current: getPlaidAccountBalance(a, 'current'),
            available: getPlaidAccountBalance(a, 'available'),
            limit: getPlaidAccountBalance(a, 'limit'),
          },
          defaultUnit: (('balances' in a && a.balances?.iso_currency_code) ??
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
              main: {accountExternalId, amount: currencyAmount},
              // Are there any uncategorized at all for Plaid?
            }),
            externalCategory,
            externalStatus: t.pending ? 'pending' : undefined,
          },
        }
      },
    },
  }),
  getPreConnectInputs: (_) =>
    zEnvName.options.map((envName) =>
      def._preConnOption({
        key: envName,
        label: envName,
        options: {
          // TODO: Fix me there...
          envName,
          clientUserId: 'demo',
          language: 'en',
          products: ['transactions'],
          countryCodes: ['US'],
          redirectUri: 'http://localhost:3000/oauth',
          webhook: 'https://6b90-118-99-92-111.ngrok.io/api/webhook/plaid',
        },
      }),
    ),

  preConnect: ({envName, ...input}, config) =>
    makePlaidClient(config)
      .linkTokenCreate(envName, {
        user: {client_user_id: input.clientUserId},
        client_name: config.clientName,
        language: input.language,
        products: input.products,
        country_codes: input.countryCodes,
        // Webhook and redirect_uri would be part of the `connection` already.
        webhook: input.webhook,
        redirect_uri: input.redirectUri,
      })
      .then((res) => {
        console.log('willConnect response', res)
        return res
      }),

  useConnectHook: (_) => {
    const [options, setOptions] = React.useState<Partial<PlaidLinkOptions>>({})
    const [deferred] = React.useState(
      new Deferred<typeof def['_types']['connectOutput']>(),
    )
    const plaidLink = usePlaidLink({
      token: null,
      ...options,
      // token: 'link-sandbox-49a06045-6ef6-4dfd-ab9a-33dc6380513d',
      // webhook: 'https://6b90-118-99-92-111.ngrok.io/api/webhook/plaid',
      // oauthRedirectUri: 'http://localhost:3000',
      onSuccess: (publicToken, meta) => {
        console.log({publicToken, meta})
        deferred.resolve({publicToken, meta: meta as any})
      },
      onEvent: (evt) => {
        console.log('plaid evt', evt)
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).plaidLink = plaidLink
    React.useEffect(() => {
      if (options.token && plaidLink.ready) {
        console.log('shall open plaid link')
        plaidLink.open() // Is this working?
      }
    }, [options.token, plaidLink])

    return (opts) => {
      setOptions({token: opts.link_token})
      return deferred.promise
    }
  },

  postConnect: async ({publicToken: public_token, meta}, config) => {
    const res = await makePlaidClient(config).itemPublicTokenExchange({
      public_token,
    })
    const settings = def._type('connectionSettings', {
      itemId: res.item_id,
      accessToken: res.access_token,
    })
    const source$: rxjs.Observable<PlaidSyncOperation> =
      plaidProviderNext.sourceSync({config, settings, options: {}})
    // Emit itemId
    return {
      connectionId: `conn_plaid_${res.item_id}`,
      settings,
      source$: rxjs.concat(
        rxjs.from([
          def._opMeta(res.item_id, settings),
          ...(meta?.accounts ?? []).map((a) => def._opData('account', a.id, a)),
        ]),
        source$,
      ),
    }
  },

  sourceSync: ({config, settings, options}) => {
    const client = makePlaidClient(config)
    async function* iterateEntities() {
      // Sync item
      const {accessToken} = settings
      const accountIds = options.accountIds?.length ? options.accountIds : null
      const {item, status} = await client.itemGet(accessToken)
      const {item_id: itemId} = item
      yield [def._opMeta(itemId, {item, status, itemId, accessToken})]

      // Sync accounts
      const {accounts} = await client.accountsGet({
        access_token: settings.accessToken,
        options: {...(accountIds && {account_ids: accountIds})},
      })
      yield accounts.map((a) => def._opData('account', a.account_id, a))

      // Sync transactions
      let cursor = options.transactionSyncCursor ?? undefined
      while (true) {
        const res = await client.transactionsSync({
          access_token: settings.accessToken,
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
          def._opMeta(
            item.item_id,
            {},
            {transactionSyncCursor: cursor},
            undefined,
          ),
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

  revokeConnection: (input, config) =>
    makePlaidClient(config).itemRemove(input.accessToken),

  handleWebhook: (input) => {
    console.log('Handling plaid webhook input', input)
    return []
  },
})
