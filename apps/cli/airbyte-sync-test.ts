import '@usevenice/app-config/register.node'

import {fsProvider} from '@usevenice/app-config/env'
import {sync} from '@usevenice/cdk-core'

import {Rx, rxjs, safeJSONParse} from '@usevenice/util'
import readline from 'node:readline'
import {mergeImpl} from '@usevenice/integration-merge'

const srcPath = './apps/tests/__encrypted__/meta'
const destPath = './temp'

// Output sync messages to standard out

// TODO: Take inspiration from airbyte-plaid-connector and make the integration
// we are working with configurable via command line args

if (process.argv[2] === 'source') {
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
}

if (process.argv[2] === 'destination') {
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
}

if (process.argv[2] == 'direct') {
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
