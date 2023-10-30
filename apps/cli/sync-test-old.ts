/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/prefer-top-level-await */
import '@usevenice/app-config/register.node'

import readline from 'node:readline'

import {sync} from '@usevenice/cdk-core'
import {brexImpl} from '@usevenice/integration-brex'
import {fsServer} from '@usevenice/integration-fs'
import {heronImpl} from '@usevenice/integration-heron'
import {mergeImpl} from '@usevenice/integration-merge'
import {postgresProvider} from '@usevenice/integration-postgres'
import {stripeImpl} from '@usevenice/integration-stripe'
import {Rx, rxjs, safeJSONParse} from '@usevenice/util'

const srcPath = './apps/tests/__encrypted__/meta'
const destPath = './temp'

// Output sync messages to standard out

// TODO: Take inspiration from airbyte-plaid-connector and make the integration
// we are working with configurable via command line args

switch (process.argv[2]) {
  case 'destination-stripe': {
    sync({
      source: rxjs.of({
        type: 'data',
        data: {
          entityName: 'invoice',
          entity: {
            id: 'in_1J9ZQo2eZvKYlo2CQ2Z2Z2Z2',
            contact: 'cus_Luy9s4xRHw2OU4',
            memo: 'Hello invoice',
            line_items: [
              {
                description: 'Hello line item',
                quantity: 12,
                unit_price: 10,
                total_amount: 120,
              },
              {
                description: 'Line 2',
                quantity: 1,
                unit_price: 50,
                total_amount: 50,
              },
            ],
          },
          id: 'ins_1234',
        },
      } satisfies (typeof stripeImpl)['helpers']['_inputOpType']),
      destination: stripeImpl.destinationSync({
        config: {},
        endUser: null,
        settings: {secretKey: process.env['STRIPE_TEST_SECRET_KEY']!},
        state: {},
      }),
    }).catch(console.error)
    break
  }
  case 'source-brex': {
    sync({
      source: brexImpl.sourceSync({
        config: {apikeyAuth: true},
        endUser: null,
        settings: {accessToken: process.env['BREX_TOKEN'] ?? ''},
        state: {},
      }),
      destination: (obs) =>
        obs.pipe(
          Rx.tap((msg) => {
            console.error(JSON.stringify(msg))
          }),
        ),
    }).catch(console.error)
    break
  }
  case 'source-postgres': {
    sync({
      source: postgresProvider.sourceSync({
        state: undefined,
        config: {},
        endUser: null,
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
      }),
      destination: (obs) =>
        obs.pipe(
          Rx.tap((msg) => {
            console.error(JSON.stringify(msg))
          }),
        ),
    }).catch(console.error)
    break
  }
  case 'source-heron': {
    sync({
      source: heronImpl.sourceSync({
        settings: {endUserId: 'b27c6987-22ea-4518-be81-f9da4bbc40c8'},
        config: {apiKey: process.env['HERON_API_KEY']!},
        endUser: null,
        state: {},
      }),
      destination: (obs) =>
        obs.pipe(
          Rx.tap((msg) => {
            console.error(JSON.stringify(msg))
          }),
        ),
    }).catch(console.error)
    break
  }
  case 'postgres-heron': {
    sync({
      // @ts-expect-error
      source: postgresProvider.sourceSync({
        settings: {
          databaseUrl: process.env['POSTGRES_OR_WEBHOOK_URL'] ?? '',
        },
      }),
      destination: heronImpl.destinationSync({
        endUser: null,
        settings: {endUserId: 'b27c6987-22ea-4518-be81-f9da4bbc40c8'},
        config: {apiKey: process.env['HERON_API_KEY']!},
        state: {},
      }),
    }).catch(console.error)
    break
  }
  case 'source-merge': {
    console.log('source mode')
    sync({
      source: mergeImpl.sourceSync({
        endUser: null,
        settings: {
          accountToken: process.env['MERGE_TEST_LINKED_ACCOUNT_TOKEN'] ?? '',
        },
        config: {apiKey: process.env['MERGE_TEST_API_KEY'] ?? ''},
        state: {},
      }),
      destination: (obs) =>
        obs.pipe(
          Rx.tap((msg) => {
            console.error(JSON.stringify(msg))
          }),
        ),
    }).catch(console.error)

    break
  }
  case 'destination': {
    console.log('destination mode')
    sync({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      source: new rxjs.Observable<any>((obs) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
          terminal: false,
        })

        rl.on('line', (line) => {
          // console.log(line)
          const data = safeJSONParse(line)
          if (data) {
            obs.next(data)
          }
        })

        rl.once('close', () => {
          // end of input
          // console.log('end')
          obs.complete()
        })
      }),
      destination: fsServer.destinationSync({
        endUser: null,
        config: {},
        state: {},
        settings: {basePath: destPath},
      }),
    }).catch(console.error)

    break
  }
  case 'direct': {
    console.log('direct mode')
    sync({
      source: fsServer.sourceSync({
        endUser: null,
        settings: {basePath: srcPath},
        config: {},
        state: {},
      }),
      destination: fsServer.destinationSync({
        endUser: null,
        settings: {basePath: destPath},
        config: {},
        state: {},
      }),
    }).catch(console.error)
  }
}
