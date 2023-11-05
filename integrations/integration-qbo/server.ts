import type {IntegrationServer} from '@usevenice/cdk-core'
import {Rx, rxjs} from '@usevenice/util'

import type {qboSchemas} from './def'
import {qboHelpers, TRANSACTION_TYPE_NAME} from './def'
import {makeQBOClient} from './QBOClient'

export const qboServer = {
  sourceSync: ({config, settings}) => {
    const qbo = makeQBOClient(config, settings)
    const realmId = settings.oauth.connection_config.realmId
    async function* iterateEntities() {
      for await (const res of qbo.getAll('Account')) {
        yield res.entities.map((a) => qboHelpers._opData('account', a.Id, a))
      }
      const updatedSince = undefined
      for (const type of Object.values(TRANSACTION_TYPE_NAME)) {
        for await (const res of qbo.getAll(type, {updatedSince})) {
          const entities = res.entities as QBO.Transaction[]
          yield entities.map((t) =>
            qboHelpers._opData('transaction', t.Id, {
              type: type as 'Purchase',
              entity: t as QBO.Purchase,
              realmId,
            }),
          )
        }
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, qboHelpers._op('commit')])))
  },
  new: ({config, settings}) => makeQBOClient(config, settings),

  verticals: {
    accounting: {
      listAccounts: async ({instance: qbo}) => {
        const res = await qbo.getAll('Account').next()
        return {
          hasNextPage: true,
          items: (res.value?.entities ?? []).map((a) => ({
            id: a.Id,
            name: a.Name,
            type: a.AccountType as 'asset',
          })),
        }
      },
      listExpenses: async ({instance: qbo}) => {
        const res = await qbo.getAll('Purchase').next()
        return {
          hasNextPage: true,
          items: (res.value?.entities ?? []).map((a) => ({
            id: a.Id,
            amount: a.TotalAmt,
            currency: a.CurrencyRef.value,
            payment_account: a.AccountRef.value,
          })),
        }
      },
    },
  },
} satisfies IntegrationServer<
  typeof qboSchemas,
  ReturnType<typeof makeQBOClient>
>

export default qboServer
