import type {IntegrationDef, IntegrationImpl} from '@usevenice/cdk-core'
import type {EntityPayload} from '@usevenice/cdk-ledger'
import {cachingLink} from '@usevenice/cdk-ledger'
import {fromCompletion, rxjs, z, zCast} from '@usevenice/util'
import {makeHeronClient} from './HeronClient'
import type {components} from './heron.gen'

export const heronDef = {
  name: z.literal('heron'),
  integrationConfig: z.object({apiKey: z.string()}),
  resourceSettings: z.object({endUserId: z.string()}),
  destinationInputEntity: zCast<EntityPayload>(),
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
    }),
  ]),
} satisfies IntegrationDef

// const helpers = defHelpers(heronDef)

export const heronImpl = {
  def: heronDef,
  name: 'heron',

  standardMappers: {
    resource() {
      return {
        displayName: '',
        // status: healthy vs. disconnected...
        // labels: test vs. production
      }
    },
  },
  extension: {
    sourceMapEntity: {
      // account: (entity) => ({
      //   id: entity.id,
      //   entityName: 'account',
      //   entity: {name: entity.entity.name ?? ''},
      // }),
      // transaction: (entity) => ({
      //   id: entity.id,
      //   entityName: 'transaction',
      //   entity: {date: entity.entity.transaction_date},
      // }),
    },
  },

  sourceSync: ({config}) => {
    // @ts-expect-error
    const client = makeHeronClient({apiKey: config.apiKey})

    return rxjs.EMPTY
  },
  destinationSync: ({config, settings: {endUserId}}) => {
    const client = makeHeronClient({apiKey: config.apiKey})
    // Need init event and complete event to better handle the creation
    // and set ready state of the user

    return cachingLink((cache) =>
      fromCompletion(async () => {
        const transactions = Object.values(cache.transaction)
        if (!transactions.length) {
          return
        }
        await client
          .get('/api/end_users/{end_user_id_or_heron_id}', {
            path: {end_user_id_or_heron_id: endUserId},
          })
          .catch(() =>
            client.post('/api/end_users', {
              body: {end_user: {end_user_id: endUserId}},
            }),
          )

        await client.post(
          '/api/end_users/{end_user_id_or_heron_id}/transactions',
          {
            path: {end_user_id_or_heron_id: endUserId},
            body: {
              transactions: Object.values(cache.transaction).map(
                (txn): components['schemas']['Transaction'] => ({
                  amount: txn.postingsMap?.main?.amount.quantity ?? 0,
                  currency: txn.postingsMap?.main?.amount.unit,
                  description: txn.description,
                  reference_id: txn.id,
                  account_id: txn.postingsMap?.main?.accountId,
                  date: txn.date,
                  categories_default: txn.externalCategory,
                  end_user_id: endUserId,
                }),
              ),
            },
          },
        )
        // TODO Do this once when all transactions have completed processing
        await client.put('/api/end_users', {
          body: {end_user: {end_user_id: endUserId, status: 'ready'}},
        })
      }),
    )
  },
} satisfies IntegrationImpl<typeof heronDef>
