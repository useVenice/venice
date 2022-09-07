import type * as plaid from 'plaid'
import React from 'react'
import type {
  PlaidAccount as PlaidLinkAccount,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOptions,
} from 'react-plaid-link'
import {usePlaidLink} from 'react-plaid-link'

import {makeSyncProvider, zWebhookInput} from '@ledger-sync/cdk-core'
import {
  ledgerSyncProviderBase,
  makePostingsMap,
  makeStandardId,
} from '@ledger-sync/cdk-ledger'
import {A, Deferred, R, Rx, rxjs, z, zCast} from '@ledger-sync/util'

import {
  getPlaidAccountBalance,
  getPlaidAccountFullName,
  getPlaidAccountType,
  plaidUnitForCurrency,
} from './legacy/plaid-helpers'
import {inferPlaidEnvFromToken} from './plaid-utils'
import {
  makePlaidClient,
  zCountryCode,
  zEnvName,
  zPlaidClientConfig,
  zProducts,
} from './PlaidClient'

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
      entity: zCast<plaid.AccountBase | PlaidLinkAccount>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<plaid.Transaction>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('institution'),
      entity: zCast<plaid.Institution>(),
    }),
  ]),
  webhookInput: zWebhookInput,
})

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
    // How do we think about this relative to pre-connect input?
    getInstitutions: (config) => {
      // Rate limit is easily exceeded, so we will have to introduce
      // a management layer for that, which will be process-wide and
      // eventually distributed rate limiter too
      // @see https://share.cleanshot.com/w7xCNK
      const client = makePlaidClient(config)
      async function* iterateInstitutions() {
        let offset = 0
        while (true) {
          const institutions = await client.institutionsGet('sandbox', {
            offset,
            count: 500,
            country_codes: ['US', 'CA', 'GB'],
          })
          if (institutions.institutions.length === 0) {
            break
          }
          yield institutions.institutions.map((ins) =>
            def._opData('institution', ins.institution_id, ins),
          )
          offset += institutions.institutions.length
        }
      }
      return rxjs
        .from(iterateInstitutions())
        .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, def._op('commit')])))
    },
  }),
  getPreConnectInputs: ({envName, ledgerId}) => [
    def._preConnOption({
      key: envName,
      label: envName,
      options: {
        envName,
        clientUserId: ledgerId,
        language: 'en',
        // TODO: Should these be in the integration config?
        products: ['transactions'],
        countryCodes: ['US'],
        redirectUri: 'http://localhost:3000/oauth',
        webhook: 'https://6b90-118-99-92-111.ngrok.io/api/webhook/plaid',
      },
    }),
  ],
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
    const source$: rxjs.Observable<PlaidSyncOperation> =
      plaidProvider.sourceSync({config, settings, options: {}})
    // Emit itemId
    return {
      externalId: res.item_id,
      settings,
      source$: rxjs.concat(
        rxjs.from(
          (meta?.accounts ?? []).map((a) => def._opData('account', a.id, a)),
        ),
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
      yield [
        def._opConn(itemId, {settings: {item, status, itemId, accessToken}}),
      ]

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

  revokeConnection: (input, config) =>
    makePlaidClient(config).itemRemove(input.accessToken),

  handleWebhook: (input) => {
    console.log('Handling plaid webhook input', input)
    return []
  },
})
