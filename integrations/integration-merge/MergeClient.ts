import '../../apps/app-config/register.node'

import {getDefaultProxyAgent} from '@usevenice/util'

// Polyfill fetch on node to support proxy agent...
import fetch, {Headers, Request, Response} from 'cross-fetch'
globalThis.fetch = fetch
globalThis.Headers = Headers
globalThis.Request = Request
globalThis.Response = Response

import {Fetcher} from 'openapi-typescript-fetch'

import type {paths} from './merge.accounting.gen'

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
