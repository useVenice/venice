/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable promise/catch-or-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
import '../../apps/app-config/register.node'

import {makeOpenApiClient} from '@usevenice/util'
import type {paths} from './merge.accounting.gen'

export function makeMergeClient(opts: {apiKey: string; accountToken?: string}) {
  const accounting = makeOpenApiClient<paths>({
    baseUrl: 'https://api.merge.dev/api/accounting/v1',
    bearerToken: opts.apiKey,
    headers: {
      ...(opts.accountToken && {'X-Account-Token': `${opts.accountToken}`}),
    },
  })
  return {accounting}
}

if (require.main === module) {
  const client = makeMergeClient({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    apiKey: process.env['MERGE_TEST_API_KEY']!,
    accountToken: process.env['MERGE_TEST_LINKED_ACCOUNT_TOKEN'],
  })

  // client.accounting.get('/accounts', {}).then((_res) => {
  //   console.log(_res)
  // })

  client.accounting
    .get('/accounts/{id}', {
      path: {id: 'a3b3a1e4-14e9-4532-8af5-9a9dc75f79f3'},
    })
    .then(console.log)

  // client.accounting
  //   .post('/accounts', {body: {model: {account_number: ''}}})
  //   .then(console.log)
}
