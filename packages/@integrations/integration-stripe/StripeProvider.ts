import {makeStripeClient, zModeName, zStripeConfig} from './StripeClient'
import {makeSyncProvider} from '@ledger-sync/cdk-core'
import {ledgerSyncProviderBase, makePostingsMap} from '@ledger-sync/cdk-ledger'
import {A, Deferred, identity, Rx, rxjs, z, zCast} from '@ledger-sync/util'
import React from 'react'
import type Stripe from 'stripe'

// const kStripe = 'stripe' as const
type StripeEntity = z.infer<typeof def['sourceOutputEntity']>
type StripeSyncOperation = typeof def['_opType']

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('stripe'),
  integrationConfig: zStripeConfig,
  connectionSettings: z.object({
    secretKey: z.string(),
    accountId: z.string().nullish(),
    transactionSyncCursor: z.string().nullish(),
  }),
  preConnectInput: z.object({
    modeName: zModeName,
    secretKey: z.string().nullish(),
    accountId: z.string().nullish(),
  }),
  connectInput: z.object({
    secretKey: z.string().nullish(),
    accountId: z.string().nullish(),
  }),
  connectOutput: z.object({
    secretKey: z.string().nullish(),
    accountId: z.string().nullish(),
  }),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<Stripe.Account & {balance?: Stripe.Balance}>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<Stripe.BalanceTransaction>(),
    }),
  ]),
  sourceSyncOptions: ledgerSyncProviderBase.def.sourceSyncOptions
    .removeDefault()
    .extend({
      transactionSyncCursor: z.string().nullish(),
    })
    .default({}),
})

export const stripeProvider = makeSyncProvider({
  ...ledgerSyncProviderBase(def, {
    sourceMapEntity: {
      account: ({entity: a}) => ({
        id: a.id,
        entityName: 'account',
        entity: {
          name: a.settings?.dashboard.display_name ?? '',
          type: 'asset/digital_wallet',
          institutionName: a.settings?.payments.statement_descriptor,
          defaultUnit: a.default_currency.toUpperCase() as Unit,
          informationalBalances: {
            available: A(
              a.balance?.available[0]?.amount ?? 0,
              a.default_currency.toUpperCase() as Unit,
            ),
          },
        },
      }),
      transaction: ({entity: t}) => ({
        id: t.id,
        entityName: 'transaction',
        entity: {
          date: new Date(t.created).toISOString(),
          description: t.description ?? '',
          postingsMap: makePostingsMap({
            main: {
              accountExternalId: t.source as Id.external,
              amount: A(t.amount, t.currency as Unit),
            },
          }),
        },
      }),
    },
  }),
  getPreConnectInputs: (_type) =>
    zModeName.options.map((modeName) =>
      def._preConnOption({
        key: modeName,
        label: modeName,
        options: {modeName},
      }),
    ),
  // preConnect: ({modeName}, config) =>
  //   Promise.resolve({
  //     secretKey: config.secretKeys[modeName],
  //     accountId: config.accountId,
  //   }),

  useConnectHook: (_) => {
    const [isShowPromt, setIsShowPromt] = React.useState(false)
    const [deferred] = React.useState(
      new Deferred<typeof def['_types']['connectOutput']>(),
    )

    React.useEffect(() => {
      if (isShowPromt) {
        const accountId = window.prompt('Input Stripe Account ID', '') ?? ''
        const secretKey = window.prompt('Input Stripe Secret Key', '') ?? ''

        deferred.resolve({secretKey, accountId})
      }
    }, [isShowPromt, deferred])

    return (_) => {
      setIsShowPromt(true)
      return deferred.promise
    }
  },

  postConnect: async (input, config) => {
    const settings = def._type('connectionSettings', {
      secretKey: input.secretKey ?? '',
      accountId: input.accountId ?? '',
    })

    const source$: rxjs.Observable<StripeSyncOperation> =
      stripeProvider.sourceSync({settings, config, options: {}})

    return {
      externalId: input.secretKey ?? '',
      settings,
      source$,
    }
  },
  /*
  rxjs.of(input).pipe(
    Rx.mergeMap((_res) => {
      const settings = def._type('connectionSettings', {
      secretKey: input.secretKey ?? '',
      accountId: input.accountId ?? '',
    })
      const source$: rxjs.Observable<StripeSyncOperation> =
        stripeProvider.sourceSync({settings, options: settings})

      return  {
        externalId: ``,
        settings,
        source$: rxjs.concat(

          source$,
        ),
      }
    }),
    ),
    */

  sourceSync: ({config: _config, settings}) => {
    const secretKey = settings.secretKey ?? ''
    const accountId = settings.accountId ?? ''
    const client = makeStripeClient({secretKey, accountId})
    async function* iterateEntities() {
      const accountRes = await client.getAccount({
        secretKey,
        accountId,
      })
      const balanceRes = await client.getBalance(secretKey)

      const combineRes: Stripe.Account & {balance?: Stripe.Balance} = {
        ...accountRes,
        balance: balanceRes,
      }
      const res = [combineRes]
      yield res.map((a) => def._opData('account', a.id, a))

      let starting_after = settings.transactionSyncCursor ?? undefined
      while (true) {
        const res2 = await client.getBalanceTransactions({
          secretKey,
          starting_after:
            starting_after && starting_after.length
              ? starting_after
              : undefined,
        })
        starting_after = res2.data[res2.data.length - 1]?.id ?? ''
        yield [...res2.data.map((t) => opData('transaction', t.id, t))]
        // TODO: Need to check what can we use for retrieving meta data
        if (!res2.has_more) {
          break
        }
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, _op({type: 'commit'})])))
  },
})

const _op: typeof identity<StripeSyncOperation> = identity

const opData = <K extends StripeEntity['entityName']>(
  entityName: K,
  id: string,
  entity: Extract<StripeEntity, {entityName: K}>['entity'] | null,
) => ({type: 'data', data: {entity, entityName, id}} as StripeSyncOperation)

// Will use it once we know how to handle meta data for stripe
// const opMeta = (id: string, data: Partial<StripeConn>) =>
//   ({
//     type: 'connUpdate',
//     id: makeStandardId('conn', kStripe, id),
//     data,
//   } as StripeSyncOperation)
