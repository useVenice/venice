import type {IntegrationServer} from '@usevenice/cdk-core'
import {logLink} from '@usevenice/cdk-core'
import {rxjs} from '@usevenice/util'

import type {debugSchemas} from './def'

export const debugServer = {
  sourceSync: () => rxjs.EMPTY,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  destinationSync: () => logLink<any>({prefix: 'debug', verbose: true}),
  handleWebhook: (input) => ({
    resourceUpdates: [],
    response: {body: {echo: input}},
  }),
} satisfies IntegrationServer<typeof debugSchemas>

export default debugServer
