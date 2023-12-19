/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jest/no-standalone-expect */
import {initSDK, logLink} from '@opensdks/runtime'
import qboSdkDef from '@opensdks/sdk-qbo'
import {getBaseUrl, nangoProxyLink} from './nangoProxyLink'

const maybeTest = process.env['_NANGO_SECRET_KEY'] ? test : test.skip

test('getBaseUrl', () => {
  const url = 'https://sandbox-quickbooks.api.intuit.com:9090/v3/co'
  const baseUrl = getBaseUrl(url)
  expect(baseUrl).toEqual('https://sandbox-quickbooks.api.intuit.com:9090/')
  expect(url.replace(baseUrl, 'https://api.nango.dev/proxy/')).toEqual(
    'https://api.nango.dev/proxy/v3/co',
  )
})

maybeTest('get QBO company', async () => {
  const realmId = process.env['_QBO_REALM_ID']!
  const qbo = initSDK(qboSdkDef, {
    realmId: process.env['_QBO_REALM_ID']!,
    envName: 'sandbox',
    accessToken: '',
    links: (defaultLinks) => [
      logLink(),
      // base url override link
      (req, next) => {
        if (qbo.clientOptions.baseUrl) {
          req.headers.set(
            nangoProxyLink.kBaseUrlOverride,
            qbo.clientOptions.baseUrl,
          )
        }
        return next(req)
      },
      nangoProxyLink({
        secretKey: process.env['_NANGO_SECRET_KEY']!,
        connectionId: process.env['_NANGO_CONNECTION_ID']!,
        providerConfigKey: process.env['_NANGO_PROVIDER_CONFIG_KEY']!,
      }),
      ...defaultLinks,
    ],
  })

  const res = await qbo.GET('/companyinfo/{id}', {
    params: {path: {id: realmId}},
  })
  expect(res.response.status).toEqual(200)
  expect(res.data.CompanyInfo.CompanyName).toEqual('Sandbox Company_US_1')
})
