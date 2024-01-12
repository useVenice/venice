import {initSDK} from '@opensdks/runtime'
import type {SalesloftSDKTypes} from '@opensdks/sdk-salesloft'
import {salesloftSdkDef} from '@opensdks/sdk-salesloft'
import type {ConnectorServer} from '@usevenice/cdk'
import {nangoProxyLink} from '@usevenice/cdk'
import type {salesloftSchemas} from './def'

function initSalesloftSDK(options: SalesloftSDKTypes['options']) {
  const sdk = initSDK(salesloftSdkDef, options)
  return {...sdk, options}
}

export const salesloftServer = {
  newInstance: ({settings, fetchLinks}) => {
    const qbo = initSalesloftSDK({
      // We rely on nango to refresh the access token...
      headers: {
        authorization: `Bearer ${settings.oauth.credentials.access_token}`,
      },
      links: (defaultLinks) => [
        (req, next) => {
          if (qbo.clientOptions.baseUrl) {
            req.headers.set(
              nangoProxyLink.kBaseUrlOverride,
              qbo.clientOptions.baseUrl,
            )
          }
          return next(req)
        },
        ...fetchLinks,
        ...defaultLinks,
      ],
    })
    return qbo
  },
  passthrough: (instance, input) =>
    instance.request(input.method, input.path, {
      headers: input.headers as Record<string, string>,
      params: {query: input.query},
      body: JSON.stringify(input.body),
    }),
} satisfies ConnectorServer<
  typeof salesloftSchemas,
  ReturnType<typeof initSalesloftSDK>
>

export default salesloftServer
