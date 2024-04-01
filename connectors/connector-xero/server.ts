import {initXeroSDK} from '@opensdks/sdk-xero'
import type {ConnectorServer} from '@usevenice/cdk'
import {nangoProxyLink} from '@usevenice/cdk'
import {rxjs} from '@usevenice/util'
import {type xeroSchemas} from './def'

export const xeroServer = {
  newInstance: ({settings, fetchLinks}) => {
    const xero = initXeroSDK({
      headers: {
        authorization: `Bearer ${settings.oauth.credentials.access_token}`,
      },
      links: (defaultLinks) => [
        (req, next) => {
          if (xero.clientOptions.baseUrl) {
            req.headers.set(
              nangoProxyLink.kBaseUrlOverride,
              xero.clientOptions.baseUrl,
            )
          }
          return next(req)
        },
        ...fetchLinks,
        ...defaultLinks,
      ],
    })
    return xero
  },
  sourceSync: ({instance: xero}) => {
    // TODO(@jatin): Add logic here to handle sync.
    // TODO: ensure instance has typesafety for some reason the types are not present here :/.
    console.log('[xero] Starting sync', xero)
    const getAll = async () => {
      const result = await xero.client.GET('/Accounts', {
        params: {
          header: {
            'xero-tenant-id': '35325d8f-5087-4c6d-b413-c3f740c26f2e', // TODO: Remove hardcoding
          },
        },
      })
      console.log('result', result)
      return result.data?.Accounts
    }

    getAll()
      .then((res) => console.log('[data test]', res))
      .catch((err) => console.log('error', err))

    return rxjs.empty()
  },
} satisfies ConnectorServer<typeof xeroSchemas>

export default xeroServer
