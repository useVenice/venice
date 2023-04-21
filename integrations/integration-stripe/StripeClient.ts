import type {InfoFromPaths} from '@usevenice/util'
import {makeOpenApiClient} from '@usevenice/util'

import type {operations, paths} from './stripe.gen'

export function makeStripeClient(opts: {
  apiKey: string
  /** API version */
  stripeVersion?: operations['PostWebhookEndpoints']['requestBody']['content']['application/x-www-form-urlencoded']['api_version']
}) {
  const baseUrl = 'https://api.stripe.com'
  const client = makeOpenApiClient<InfoFromPaths<paths>>({
    baseUrl,
    auth: {basic: {username: opts.apiKey, password: ''}},
    headers: {
      ...(opts.stripeVersion && {'Stripe-Version': `${opts.stripeVersion}`}),
    },
  })
  return client
}
