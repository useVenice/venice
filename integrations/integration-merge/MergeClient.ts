/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
import '../../apps/app-config/register.node'
// Polyfill fetch on node to support proxy agent...
import fetch, {Headers, Request, Response} from 'cross-fetch'
globalThis.fetch = fetch
globalThis.Headers = Headers
globalThis.Request = Request
globalThis.Response = Response

import {getDefaultProxyAgent} from '@usevenice/util'
import {Fetcher} from 'openapi-typescript-fetch'
import {makeOpenApiClient} from './makeOpenApiClient'
import type {paths} from './merge.accounting.gen'

const http = makeOpenApiClient<paths>({
  baseUrl: 'https://api.merge.dev/api/accounting/v1',
  headers: {
    Authorization: `Bearer ${process.env['MERGE_TEST_API_KEY']}`,
    'X-Account-Token': `${process.env['MERGE_TEST_LINKED_ACCOUNT_TOKEN']}`,
  },
})

http.get('/accounts', {}).then((_res) => {
  console.log(_res)
})

// MARK: ---

// declare fetcher for paths
const fetcher = Fetcher.for<paths>()

// global configuration
fetcher.configure({
  baseUrl: 'https://api.merge.dev/api/accounting/v1',
  init: {
    headers: {
      Authorization: `Bearer ${process.env['MERGE_TEST_API_KEY']}`,
      'X-Account-Token': `${process.env['MERGE_TEST_LINKED_ACCOUNT_TOKEN']}`,
    },
    // @ts-expect-error Node fetch specific option... Noop on other platforms.
    agent: getDefaultProxyAgent(),
  },
})

fetcher
  .path('/accounts')
  .method('get')
  .create()({})
  .then((r) => console.log(JSON.stringify(r.data.results, null, 2)))
  .catch(console.error)
