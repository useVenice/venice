import type {InfoFromPaths} from '@usevenice/util'
import {makeOpenApiClient} from '@usevenice/util'
import type {paths} from './__generated__/transactions.gen'

export function makeBrexClient(opts: {accessToken: string}) {
  const transactions = makeOpenApiClient<InfoFromPaths<paths>>({
    baseUrl: 'https://platform.brexapis.com', // TODO: get this from openAPI.json
    auth: {bearerToken: opts.accessToken},
  })

  return {transactions}
}
