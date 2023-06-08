import '@usevenice/app-config/register.node'

import {makeAirbyteConnector} from '@usevenice/airbyte/makeAirbyteConnector'
import {plaidProvider} from '@usevenice/integration-plaid'

import {cliFromRouter} from './cli-utils'

cliFromRouter(makeAirbyteConnector(plaidProvider), {
  jsonOutput: true,
  consoleLog: false,
  readStdin: false,
}).parse(process.argv)
