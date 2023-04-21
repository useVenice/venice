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

if (require.main === module) {
  require('../../apps/app-config/register.node')
  const stripe = makeStripeClient({
    apiKey: process.env['STRIPE_TEST_SECRET_KEY']!,
    stripeVersion: '2022-11-15',
  })
  void stripe
    .post('/v1/invoices', {bodyForm: {customer: 'cus_Luy9s4xRHw2OU4'}})
    .then((r) => console.log(r))
    .catch(console.error)

  void stripe
    .get('/v1/payment_intents/{intent}', {
      path: {intent: 'pi_1JZ2Yt2eZvKYlo2C0X2Y8Y0L'},
      query: {expand: ['customer']},
    })
    .then((r) => {
      r.customer
    })

  // void stripe.pos
  //   .create({customer: 'cus_Luy9s4xRHw2OU4'})
  //   .then((r) => console.log(r))
  //   .catch(console.error)
}
