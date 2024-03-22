import type {ConnectorServer} from '@usevenice/cdk'
import type {twentySchemas} from './def'

export const twentyServer = {} satisfies ConnectorServer<typeof twentySchemas>

export default twentyServer
