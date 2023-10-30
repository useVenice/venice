/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/prefer-top-level-await */
import '@usevenice/app-config/register.node'

import {logLink, sync} from '@usevenice/cdk-core'
import {mapStandardEntityLink} from '@usevenice/cdk-ledger'
import {plaidProvider} from '@usevenice/integration-plaid'
import {postgresProvider} from '@usevenice/integration-postgres'
import {stripeImpl} from '@usevenice/integration-stripe'
import type {rxjs} from '@usevenice/util'
import {R, Rx} from '@usevenice/util'

function getSource(name: string) {
  switch (name) {
    case 'plaid':
      return plaidProvider.sourceSync({
        endUser: null,
        config: plaidProvider.def.integrationConfig.parse({
          envName: 'sandbox',
          clientId: process.env['int_plaid__clientId'] ?? '',
          clientSecret:
            process.env['int_plaid__clientSecret'] ??
            process.env['int_plaid__secrets__sandbox'] ??
            '',
        }),
        settings: {accessToken: process.env['PLAID_ACCESS_TOKEN'] ?? ''},
        state: {},
      })
    case 'postgres':
      return postgresProvider.sourceSync({
        config: {},
        endUser: null,
        state: {},
        settings: {
          databaseUrl: process.env['POSTGRES_OR_WEBHOOK_URL'] ?? '',
          sourceQueries: {
            invoice: `
              SELECT
                iv.id,
                iv.customer_id as contact,
                iv.currency,
                iv.description as memo,
                jsonb_agg(
                  jsonb_build_object(
                    'id', il.id,
                    'description', il.description,
                    'quantity', il.quantity,
                    'unit_price', il.unit_price
                  )
                ) FILTER (WHERE il.id IS NOT NULL) AS line_items
              FROM
                invoice_invoice iv
                LEFT JOIN invoice_invoicelineitem il
                  ON iv.id = il.invoice_id
              GROUP BY
                iv.id;`,
          },
        },
      })
    default:
      throw new Error(`Unknown source: ${name}`)
  }
}

function getDestination(name: string | undefined) {
  switch (name) {
    case 'stripe':
      return stripeImpl.destinationSync({
        config: {apikeyAuth: true},
        endUser: null,
        settings: {secretKey: process.env['STRIPE_TEST_SECRET_KEY']!},
        state: {},
      })
    case 'postgres':
      return postgresProvider.destinationSync({
        config: {},
        state: {},
        endUser: null,
        settings: {
          databaseUrl:
            process.env['int_postgres__database_url'] ??
            'postgresql://postgres@localhost/postgres',
        },
      })
    case undefined:
      return (obs: rxjs.Observable<unknown>) =>
        obs.pipe(
          Rx.tap((msg) => {
            console.log(JSON.stringify(msg))
          }),
        )
    default:
      throw new Error(`Unknown destination: ${name}`)
  }
}

sync({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  source: getSource(process.argv[2]!) as any,
  links: R.compact([
    process.argv[2] === 'plaid' &&
      mapStandardEntityLink({
        id: 'reso_plaid_demo',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        integration: {provider: plaidProvider as any},
        settings: {},
      }),
    process.argv[2] === 'plaid' && logLink({prefix: 'preDest'}),
  ]),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  destination: getDestination(process.argv[3]) as any,
}).catch(console.error)
