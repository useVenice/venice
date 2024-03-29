// import {initXeroSDK} from '@opensdks/sdk-xero' // FIXME: ensure SDK exists
import type {ConnectorServer} from '@usevenice/cdk'
import type {xeroSchemas} from './def'

export const xeroServer = {} satisfies ConnectorServer<typeof xeroSchemas>

export default xeroServer
