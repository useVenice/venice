import type {SalesloftSDK} from '@opensdks/sdk-salesloft'
import {initSalesloftSDK} from '@opensdks/sdk-salesloft'
import type {ConnectorServer} from '@usevenice/cdk'
import {nangoProxyLink} from '@usevenice/cdk'
import type {salesloftSchemas} from './def'

export const salesloftServer = {
  newInstance: ({settings, fetchLinks}) => {
    const sdk = initSalesloftSDK({
      // We rely on nango to refresh the access token...
      headers: {
        authorization: `Bearer ${settings.oauth.credentials.access_token}`,
      },
      links: (defaultLinks) => [
        (req, next) => {
          if (sdk.clientOptions.baseUrl) {
            req.headers.set(
              nangoProxyLink.kBaseUrlOverride,
              sdk.clientOptions.baseUrl,
            )
          }
          return next(req)
        },
        ...fetchLinks,
        ...defaultLinks,
      ],
    })
    return sdk
  },
  passthrough: (instance, input) =>
    instance.request(input.method, input.path, {
      headers: input.headers as Record<string, string>,
      params: {query: input.query},
      body: JSON.stringify(input.body),
    }),
} satisfies ConnectorServer<typeof salesloftSchemas, SalesloftSDK>

export default salesloftServer
