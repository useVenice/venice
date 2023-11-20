import '@usevenice/app-config/register.node'

import {plaidProvider} from '@usevenice/connector-plaid'
import {makeAirbyteConnector} from '@usevenice/meta-service-airbyte/makeAirbyteConnector'

import {cliFromRouter} from './cli-utils'

cliFromRouter(makeAirbyteConnector(plaidProvider), {
  jsonOutput: true,
  consoleLog: false,
  readStdin: false,
}).parse(process.argv)
