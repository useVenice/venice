import type {IntegrationServer} from '@usevenice/cdk-core'
import {Rx, rxjs, snakeCase} from '@usevenice/util'

import type {qboSchemas} from './def'
import {QBO_ENTITY_NAME, qboHelpers, TRANSACTION_TYPE_NAME} from './def'
import {makeQBOClient} from './QBOClient'

export const qboServer = {
  newInstance: ({config, settings, onSettingsChange}) =>
    makeQBOClient(config, settings, onSettingsChange),

  sourceSync: ({config, settings}) => {
    // TODO: get the data from newInstance..
    const qbo = makeQBOClient(config, settings, () => {})
    async function* iterateEntities() {
      const updatedSince = undefined
      for (const type of Object.values(QBO_ENTITY_NAME)) {
        for await (const res of qbo.getAll(type, {updatedSince})) {
          const entities = res.entities as QBO.Transaction[]
          yield entities.map((t) =>
            qboHelpers._opData(snakeCase(type), t.Id, t),
          )
        }
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, qboHelpers._op('commit')])))
  },

  verticals: {
    accounting: {
      list: async (qbo, type, _opts) => {
        switch (type) {
          case 'account': {
            const res = await qbo.getAll('Account').next()
            return {hasNextPage: true, items: res.value?.entities ?? []}
          }
          case 'expense': {
            const res = await qbo.getAll('Purchase').next()
            return {hasNextPage: true, items: res.value?.entities ?? []}
          }
          case 'vendor': {
            const res = await qbo.getAll('Vendor').next()
            return {hasNextPage: true, items: res.value?.entities ?? []}
          }
          default:
            throw new Error(`Unknown type: ${type}`)
        }
      },
    },
    pta: {
      list: async (qbo, type, _opts) => {
        switch (type) {
          case 'account': {
            const res = await qbo.getAll('Account').next()
            return {hasNextPage: true, items: res.value?.entities ?? []}
          }
          case 'transaction': {
            async function* iterateEntities() {
              const updatedSince = undefined
              for (const type of Object.values(TRANSACTION_TYPE_NAME)) {
                for await (const res of qbo.getAll(type, {updatedSince})) {
                  const entities = res.entities as QBO.Transaction[]
                  yield entities.map((t) => ({
                    Id: t.Id, // For primary key...
                    type: type as 'Purchase',
                    entity: t as QBO.Purchase,
                    realmId: qbo.realmId,
                  }))
                }
              }
            }
            const res = await iterateEntities().next()
            return {hasNextPage: true, items: res.value ?? []}
          }
          default:
            throw new Error(`Unknown type: ${type}`)
        }
      },
    },
  },
} satisfies IntegrationServer<
  typeof qboSchemas,
  ReturnType<typeof makeQBOClient>
>

export default qboServer
