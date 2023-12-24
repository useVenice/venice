import {initSDK} from '@opensdks/runtime'
import type {ApolloSDKTypes} from '@opensdks/sdk-apollo'
import {apolloSdkDef} from '@opensdks/sdk-apollo'
import type {ConnectorServer} from '@usevenice/cdk'
import {Rx, rxjs} from '@usevenice/util'
import type {apolloSchemas} from './def'
import {APOLLO_ENTITY_NAME, apolloHelpers} from './def'

export {ApolloSDKTypes}

function initApolloSdk(options: ApolloSDKTypes['options']) {
  const sdk = initSDK(apolloSdkDef, options)
  return {...sdk, options}
}

export type ApolloSdk = ReturnType<typeof initApolloSdk>

export const apolloServer = {
  newInstance: (opts) =>
    initApolloSdk({
      api_key: opts.settings.api_key,
      links: (defaultLinks) => [...opts.fetchLinks, ...defaultLinks],
    }),
  passthrough: (instance, input) =>
    instance.request(input.method, input.path, {
      headers: input.headers as Record<string, string>,
      params: {query: input.query},
      body: JSON.stringify(input.body),
    }),

  sourceSync: ({instance: apollo, streams}) => {
    console.log('[apollo] Will Sync apollo')
    async function* iterateEntities() {
      // const updatedSince = undefined
      console.log('[apollo] Starting sync', streams)
      for (const type of APOLLO_ENTITY_NAME) {
        if (!streams[type]) {
          continue
        }
        if (type === 'contact') {
          const res = await apollo.POST('/v1/contacts/search')
          yield res.data.contacts.map((c) =>
            apolloHelpers._opData(type, c.id, c),
          )
        }
      }
    }
    return rxjs
      .from(iterateEntities())
      .pipe(
        Rx.mergeMap((ops) => rxjs.from([...ops, apolloHelpers._op('commit')])),
      )
  },
} satisfies ConnectorServer<typeof apolloSchemas, ApolloSdk>

export default apolloServer
