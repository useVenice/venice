/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/prefer-top-level-await */
import '@usevenice/app-config/register.node'

import {fsProvider} from '@usevenice/app-config/env'
import {sync} from '@usevenice/cdk-core'

import {Rx, rxjs, safeJSONParse, z} from '@usevenice/util'
import readline from 'node:readline'
import {mergeImpl} from '@usevenice/integration-merge'
import {heronImpl} from '@usevenice/integration-heron'
import {brexImpl} from '@usevenice/integration-brex'
import {stripeImpl} from '@usevenice/integration-stripe'
import {postgresProvider} from '@usevenice/integration-postgres'

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
        id: 'reso_stripe',
        config: {},
        settings: {secretKey: process.env['STRIPE_TEST_SECRET_KEY']!},
        state: {},
      }),
    }).catch(console.error)
    break
  }
  case 'source-brex': {
    sync({
      source: brexImpl.sourceSync({
        id: 'reso_postgres_b27c6987-22ea-4518-be81-f9da4bbc40c8',
        config: {clientId: '', clientSecret: ''},
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
        id: 'reso_postgres_b27c6987-22ea-4518-be81-f9da4bbc40c8',
        settings: {
          databaseUrl: process.env['POSTGRES_OR_WEBHOOK_URL'] ?? '',
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
        id: 'reso_heron_b27c6987-22ea-4518-be81-f9da4bbc40c8',
        settings: {endUserId: 'b27c6987-22ea-4518-be81-f9da4bbc40c8'},
        config: {apiKey: process.env['HERON_API_KEY']!},
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
      source: postgresProvider.sourceSync({
        id: 'reso_postgres_b27c6987-22ea-4518-be81-f9da4bbc40c8',
        settings: {
          databaseUrl: process.env['POSTGRES_OR_WEBHOOK_URL'] ?? '',
        },
      }),
      destination: heronImpl.destinationSync({
        id: 'reso_heron_b27c6987-22ea-4518-be81-f9da4bbc40c8',
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
        id: 'reso_1',
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
      destination: fsProvider.destinationSync({
        id: 'reso_1',
        settings: {basePath: destPath},
      }),
    }).catch(console.error)

    break
  }
  case 'direct': {
    console.log('direct mode')
    sync({
      source: fsProvider.sourceSync({
        id: 'reso_1',
        settings: {basePath: srcPath},
        state: {},
      }),
      destination: fsProvider.destinationSync({
        id: 'reso_1',
        settings: {basePath: destPath},
      }),
    }).catch(console.error)
  }
}
