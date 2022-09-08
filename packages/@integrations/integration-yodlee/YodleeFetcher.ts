import {Fetcher} from 'openapi-typescript-fetch'
import type {Middleware} from 'openapi-typescript-fetch'

import '../../../apps/cli/fetch-polyfill'

import {z, zFunction} from '@ledger-sync/util'

import type {paths} from './yodlee.gen'

const fetcherSchema = z.object({
  baseUrl: z.string().nullish(),
  headers: z.any().nullish(),
})
export const createFetcher = zFunction(fetcherSchema, ({baseUrl, headers}) => {
  const fetcher = Fetcher.for<paths>()

  const logger: Middleware = async (url, init, next) => {
    console.log(`fetching ${url} with headers:`, init.headers)
    const response = await next(url, init)
    console.log(`fetched ${url}`, init)
    return response
  }
  fetcher.configure({
    baseUrl: baseUrl ?? '',
    init: {
      headers,
    },
    use: [logger], // For middleware, to be implemented if it's necessary
  })

  return {
    getProvider: fetcher.path('/providers/{providerId}').method('get').create(),
    getUser: fetcher.path('/user').method('get').create(),
  }
})
