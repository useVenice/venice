import type {IntegrationServer} from '@usevenice/cdk-core'
import {cachingLink} from '@usevenice/cdk-core'
import {fromCompletion, Rx, rxjs} from '@usevenice/util'

import type {heronSchemas} from './def'
import {helpers} from './def'
import type {components} from './heron.gen'
import {makeHeronClient} from './HeronClient'

export const heronServer = {
  sourceSync: ({endUser, config}) => {
    const client = makeHeronClient({apiKey: config.apiKey})
    async function* iterateEntities() {
      const endUserId = endUser?.id
      if (!endUserId) {
        throw new Error('endUser is required for heron source sync')
      }
      // TODO: Abstract different paging strategies into re-usable functions, similar to airbyte low-code connector for example
      const res = await client.get(
        '/api/end_users/{end_user_id_or_heron_id}/transactions',
        {path: {end_user_id_or_heron_id: endUserId}, query: {}},
      )
      yield (res.transactions_enriched ?? []).map((txn) =>
        helpers._opData('transaction', txn.heron_id!, txn),
      )
    }
    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, helpers._op('commit')])))
  },
  destinationSync: ({config, endUser}) => {
    const endUserId = endUser?.id
    if (!endUserId) {
      throw new Error('endUser is required for heron source sync')
    }
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
              bodyJson: {end_user: {end_user_id: endUserId}},
            }),
          )

        await client.post(
          '/api/end_users/{end_user_id_or_heron_id}/transactions',
          {
            path: {end_user_id_or_heron_id: endUserId},
            bodyJson: {
              transactions: Object.entries(cache.transaction).map(
                ([id, txn]): components['schemas']['Transaction'] => ({
                  amount: txn.postingsMap?.main?.amount.quantity ?? 0,
                  currency: txn.postingsMap?.main?.amount.unit,
                  description: txn.description,
                  reference_id: id, // txn.id is somehow null...
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
          bodyJson: {end_user: {end_user_id: endUserId, status: 'ready'}},
        })
      }),
    )
  },
} satisfies IntegrationServer<typeof heronSchemas>

export default heronServer
