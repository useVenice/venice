import type {IntegrationDef, IntegrationImpl} from '@usevenice/cdk-core'
import {defHelpers, handlersLink} from '@usevenice/cdk-core'
import {
  makePostingsMap,
  veniceProviderBase,
  zCommon,
} from '@usevenice/cdk-ledger'
import {A, Rx, fromCompletion, rxjs, z, zCast} from '@usevenice/util'
import type {components} from './stripe.gen'

import {makeStripeClient} from './StripeClient'

const stripeDef = {
  name: z.literal('stripe'),
  integrationConfig: z.object({}),
  resourceSettings: z.object({secretKey: z.string()}),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<components['schemas']['account']>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zCast<components['schemas']['balance_transaction']>(),
    }),
  ]),
  sourceState: veniceProviderBase.def.sourceState
    .removeDefault()
    .extend({transactionSyncCursor: z.string().nullish()})
    .default({}),
  destinationInputEntity: z.object({
    // stream: z.literal('invoice'),
    // data: zCommon.Invoice,
    // TODO: rename to stream and data
    entityName: z.literal('invoice'),
    entity: zCommon.Invoice,
    id: z.string(),
  }),
} satisfies IntegrationDef

const helpers = defHelpers(stripeDef)

export const stripeImpl = {
  name: 'stripe',
  def: stripeDef,
  helpers,
  extension: {
    sourceMapEntity: {
      account: ({entity: a}) => ({
        id: a.id,
        entityName: 'account',
        entity: {
          name: a.settings?.dashboard.display_name ?? '',
          type: 'asset/digital_wallet',
          institutionName: a.settings?.payments.statement_descriptor,
          defaultUnit: a.default_currency?.toUpperCase() as Unit,
          // informationalBalances: {
          //   available: A(
          //     a.balance?.available[0]?.amount ?? 0,
          //     a.default_currency?.toUpperCase() as Unit,
          //   ),
          // },
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
  },

  sourceSync: ({settings, state}) => {
    const client = makeStripeClient({apiKey: settings.secretKey})
    async function* iterateEntities() {
      const accountRes = await client.get('/v1/accounts', {})
      // const balanceRes = await client.get('/v1/balance', {})

      yield accountRes.data.map((a) => helpers._opData('account', a.id, a))

      let starting_after = state.transactionSyncCursor ?? undefined
      while (true) {
        const res2 = await client.get('/v1/balance_transactions', {
          query: {
            starting_after:
              starting_after && starting_after.length > 0
                ? starting_after
                : undefined,
          },
        })
        starting_after = res2.data[res2.data.length - 1]?.id ?? ''
        yield [...res2.data.map((t) => helpers._opData('transaction', t.id, t))]
        // TODO: Need to check what can we use for retrieving meta data
        if (!res2.has_more) {
          break
        }
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, helpers._op('commit')])))
  },

  destinationSync: ({settings}) => {
    const client = makeStripeClient({apiKey: settings.secretKey})

    // Gotta look up stripe customer...
    return handlersLink({
      data: ({data}) => {
        if (data.entityName !== 'invoice') {
          return
        }
        return fromCompletion(
          client.post('/v1/invoices', {
            bodyForm: {
              customer: data.entity?.company!,
              // expand: ['customer'],
              // metadata: {entityId: data.id},
              // TODO: Fix this parameter stringify
              // @ts-expect-error
              'metadata[entityId]': data.id,
            },
          }),
        )
      },
    })
  },
} satisfies IntegrationImpl<typeof stripeDef>
