/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/prefer-top-level-await */
import '@usevenice/app-config/register.node'
import readline from 'node:readline'
import {sync} from '@usevenice/cdk'
import {brexImpl} from '@usevenice/connector-brex'
import {fsServer} from '@usevenice/connector-fs'
import {heronImpl} from '@usevenice/connector-heron'
import {mergeImpl} from '@usevenice/connector-merge'
import {postgresProvider} from '@usevenice/connector-postgres'
import {Rx, rxjs, safeJSONParse} from '@usevenice/util'

const srcPath = './apps/tests/__encrypted__/meta'
const destPath = './temp'

// Output sync messages to standard out

// TODO: Take inspiration from airbyte-plaid-connector and make the integration
// we are working with configurable via command line args

switch (process.argv[2]) {
  case 'source-brex': {
    sync({
      source: brexImpl.sourceSync({
        config: {apikeyAuth: true},
        endUser: null,
        settings: {accessToken: process.env['BREX_TOKEN'] ?? ''},
        state: {},
        streams: {},
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
        streams: {},
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
        streams: {},
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
        source: undefined,
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
        streams: {},
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
        source: undefined,
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
        streams: {},
      }),
      destination: fsServer.destinationSync({
        source: undefined,
        endUser: null,
        settings: {basePath: destPath},
        config: {},
        state: {},
      }),
    }).catch(console.error)
  }
}
