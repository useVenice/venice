import './register.node'

import {sync} from '@usevenice/cdk-core'
import {fsProvider} from '@usevenice/core-integration-fs'

import readline from 'node:readline'
import {Rx, rxjs, safeJSONParse} from '@usevenice/util'

// Output sync messages to standard out

if (process.argv[2] === 'source') {
  sync({
    source: fsProvider.sourceSync({
      id: 'reso_1',
      settings: {
        basePath:
          '/Users/tony/Code/usevenice/venice/apps/tests/__encrypted__/meta',
      },
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
      settings: {
        basePath: '/Users/tony/Code/usevenice/venice/apps/app-config/sample',
      },
    }),
  }).catch(console.error)
}
