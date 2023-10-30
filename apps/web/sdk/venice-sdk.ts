import {Fetcher} from 'openapi-typescript-fetch'

import type {paths} from './venice.gen'

const fetcher = Fetcher.for<paths>()
fetcher.configure({
  baseUrl: 'http://localhost:3000/api/rest',
  init: {
    headers: {
      'x-token': process.env['VENICE_TOKEN'] ?? '',
    },
  },
})

async function main() {
  // const result = await fetcher.path('/account').method('get').create()({
  // TODO: This should be taking params but it is not due to
  // https://github.com/drwpow/openapi-typescript/issues/1040
  // })
  // console.log('result', result.data[0]?.name)
  // result Plaid Gold Standard 0% Interest Checking (Plaid Checking) - 0000
}

main()
