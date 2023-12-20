import {initSDK} from '@opensdks/runtime'
import type {QBOSDKTypes} from '@opensdks/sdk-qbo'
import {qboSdkDef} from '@opensdks/sdk-qbo'
import type {ConnectorServer} from '@usevenice/cdk'
import {Rx, rxjs, snakeCase} from '@usevenice/util'
import type {QBO, qboSchemas, TransactionTypeName} from './def'
import {QBO_ENTITY_NAME, qboHelpers, TRANSACTION_TYPE_NAME} from './def'

function initQBOSdk(options: QBOSDKTypes['options']) {
  const sdk = initSDK(qboSdkDef, options)
  // TODO: Should add options to sdk itself
  return {realmId: options.realmId, ...sdk}
}

export const qboServer = {
  newInstance: ({config, settings, fetchLinks}) => {
    const qbo = initQBOSdk({
      envName: config.envName,
      realmId: settings.oauth.connection_config.realmId,
      links: (defaultLinks) => [
        (req, next) => {
          if (qbo.clientOptions.baseUrl) {
            req.headers.set('base-url-override', qbo.clientOptions.baseUrl)
          }
          return next(req)
        },
        ...fetchLinks,
        ...defaultLinks,
      ],
      accessToken: '', // Will use passthrough api for this..
    })
    return qbo
  },

  sourceSync: ({instance: qbo, streams}) => {
    async function* iterateEntities() {
      const updatedSince = undefined
      console.log('[qbo] Starting sync', streams)
      for (const type of Object.values(QBO_ENTITY_NAME)) {
        if (!streams[type]) {
          continue
        }
        for await (const res of qbo.getAll(type, {updatedSince})) {
          const entities = res.entities as Array<QBO[TransactionTypeName]>
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
                  const entities = res.entities as Array<
                    QBO[TransactionTypeName]
                  >
                  yield entities.map((t) => ({
                    Id: t.Id, // For primary key...
                    type: type as 'Purchase',
                    entity: t as QBO['Purchase'],
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
} satisfies ConnectorServer<typeof qboSchemas, ReturnType<typeof initQBOSdk>>

export default qboServer
