import {initSDK} from '@opensdks/runtime'
import type {OutreachSDKTypes} from '@opensdks/sdk-outreach'
import {outreachSdkDef} from '@opensdks/sdk-outreach'
import type {ConnectorServer} from '@usevenice/cdk'
import {nangoProxyLink} from '@usevenice/cdk'
import type {outreachSchemas} from './def'

function initOutreachSDK(options: OutreachSDKTypes['options']) {
  const sdk = initSDK(outreachSdkDef, options)
  return {...sdk, options}
}

export const outreachServer = {
  newInstance: ({settings, fetchLinks}) => {
    const qbo = initOutreachSDK({
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
  typeof outreachSchemas,
  ReturnType<typeof initOutreachSDK>
>

export default outreachServer
