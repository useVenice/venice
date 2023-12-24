import {initSDK} from '@opensdks/runtime'
import type {ApolloSDKTypes} from '@opensdks/sdk-apollo'
import {apolloSdkDef} from '@opensdks/sdk-apollo'
import type {ConnectorServer} from '@usevenice/cdk'
import type {apolloSchemas} from './def'

function initApolloSdk(options: ApolloSDKTypes['options']) {
  const sdk = initSDK(apolloSdkDef, options)
  return {...sdk, options}
}

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
} satisfies ConnectorServer<
  typeof apolloSchemas,
  ReturnType<typeof initApolloSdk>
>

export default apolloServer
