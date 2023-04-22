/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/prefer-top-level-await */
import '@usevenice/app-config/register.node'

import {sync} from '@usevenice/cdk-core'

import {postgresProvider} from '@usevenice/integration-postgres'
import {stripeImpl} from '@usevenice/integration-stripe'

function getSource(name: string) {
  switch (name) {
    case 'postgres':
      return postgresProvider.sourceSync({
        id: 'reso_postgres_b27c6987-22ea-4518-be81-f9da4bbc40c8',
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
                ) AS line_items
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

function getDestination(name: string) {
  switch (name) {
    case 'stripe':
      return stripeImpl.destinationSync({
        id: 'reso_stripe',
        config: {},
        settings: {secretKey: process.env['STRIPE_TEST_SECRET_KEY']!},
        state: {},
      })
    default:
      throw new Error(`Unknown destination: ${name}`)
  }
}

sync({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  source: getSource(process.argv[2]!) as any,
  destination: getDestination(process.argv[3]!),
}).catch(console.error)
