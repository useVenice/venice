import React from 'react'
import type Stripe from 'stripe'

import {makeSyncProvider} from '@usevenice/cdk-core'
import {makePostingsMap, veniceProviderBase} from '@usevenice/cdk-ledger'
import {A, Deferred, R, Rx, rxjs, z, zCast} from '@usevenice/util'

import {makeStripeClient, zStripeConfig} from './StripeClient'

// const kStripe = 'stripe' as const
type StripeEntity = z.infer<typeof def['sourceOutputEntity']>
type StripeSyncOperation = typeof def['_opType']

const _def = makeSyncProvider.def({
  ...veniceProviderBase.def,
  name: z.literal('stripe'),
  integrationConfig: zStripeConfig,
  connectionSettings: z.object({
    secretKey: z.string(),
    accountId: z.string().nullish(),
    transactionSyncCursor: z.string().nullish(),
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
  sourceState: veniceProviderBase.def.sourceState
    .removeDefault()
    .extend({
      transactionSyncCursor: z.string().nullish(),
    })
    .default({}),
})
const def = makeSyncProvider.def.helpers(_def)

export const stripeProvider = makeSyncProvider({
  ...veniceProviderBase(def, {
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
              accountExternalId: t.source as ExternalId,
              amount: A(t.amount, t.currency as Unit),
            },
          }),
        },
      }),
    },
  }),

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

  postConnect: (input) => ({
    connectionExternalId: input.secretKey ?? '',
    settings: {
      secretKey: input.secretKey ?? '',
      accountId: input.accountId ?? '',
    },
    triggerDefaultSync: true,
  }),
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

  sourceSync: ({settings}) => {
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
            starting_after && starting_after.length > 0
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

const _op: typeof R.identity<StripeSyncOperation> = R.identity

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
