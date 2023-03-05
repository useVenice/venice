// import  '@usevenice/app-config/register.node'

import {makeAirbyteConnector} from './makeAirbyteConnector'
import {plaidProvider} from '@usevenice/app-config/env'

makeAirbyteConnector(plaidProvider).cli.parse(process.argv)
