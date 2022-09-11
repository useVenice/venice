import OpenAPIClientAxios from 'openapi-client-axios'

import {
  $makeProxyAgent,
  getDefaultProxyAgent,
  stringifyQueryParams,
  z,
  zFunction,
} from '@ledger-sync/util'

import type {Client as YodleeClient} from './client'

const zFetcherConfig = z.object({
  proxy: z.object({url: z.string(), cert: z.string()}).nullish(),
  clientId: z.string(),
  clientSecret: z.string(),
  url: z.string(),
})

// Please consider this is as a new type gen since openapi-typescript have a similiar issue with this because of node-fetch https://github.com/nock/nock/issues/2197
// References: https://github.com/anttiviljami/openapi-client-axios/blob/master/DOCS.md
// TODO: Will move this entire function to YodleeClient once it finished and tested
export const createFetcher = zFunction(
  zFetcherConfig,
  ({proxy, clientId, clientSecret, url}) => {
    const generateAccessToken = async (loginName: string) => {
      const api = new OpenAPIClientAxios({
        definition: './packages/@integrations/integration-yodlee/yodlee.yaml',
        withServer: {url},
        axiosConfigDefaults: {
          withCredentials: true,
          httpsAgent:
            getDefaultProxyAgent() ?? (proxy && $makeProxyAgent(proxy)),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Api-Version': '1.1',
            loginName,
          },
        },
      })
      const client = await api.getClient<YodleeClient>()
      const accesssToken = client.paths['/auth/token'].post(
        null,
        stringifyQueryParams({clientId, secret: clientSecret}),
      )
      return (await accesssToken).data.token?.accessToken
    }

    // TODO: make it reusable
    const api = new OpenAPIClientAxios({
      definition: './packages/@integrations/integration-yodlee/yodlee.yaml',
      withServer: {url},
      axiosConfigDefaults: {
        withCredentials: true,
        httpsAgent: getDefaultProxyAgent() ?? (proxy && $makeProxyAgent(proxy)),
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json',
          'Api-Version': '1.1',
        },
      },
    })
    return {
      getProvider: zFunction(
        [z.number(), z.string()],
        async (providerId, accesssToken) => {
          api.axiosConfigDefaults = {
            ...api.axiosConfigDefaults,
            headers: {
              ...api.axiosConfigDefaults.headers,
              Authorization: `Bearer ${accesssToken}`,
            },
          }
          const client = await api.getClient<YodleeClient>()
          return client.paths['/providers/{providerId}'].get({providerId})
        },
      ),
      generateAccessToken: zFunction(z.string(), (loginName) =>
        generateAccessToken(loginName),
      ),
    }
  },
)
