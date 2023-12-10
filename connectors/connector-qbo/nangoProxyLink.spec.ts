/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable jest/no-standalone-expect */
import {initSDK, logLink} from '@opensdks/runtime'
import qboSdkDef from '@opensdks/sdk-qbo'
import {nangoProxyLink} from './nangoProxyLink'

const maybeTest = process.env['_NANGO_SECRET_KEY'] ? test : test.skip

maybeTest('get QBO company', async () => {
  const realmId = process.env['_QBO_REALM_ID']!
  const qbo = initSDK(qboSdkDef, {
    realmId: process.env['_QBO_REALM_ID']!,
    envName: 'sandbox',
    accessToken: '',
    links: (defaultLinks) => [
      logLink(),
      nangoProxyLink({
        secretKey: process.env['_NANGO_SECRET_KEY']!,
        connectionId: process.env['_NANGO_CONNECTION_ID']!,
        providerConfigKey: process.env['_NANGO_PROVIDER_CONFIG_KEY']!,
        /** How do we make this optional? */
        baseUrl: `https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}`,
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
