import type {ConnectorServer} from '@usevenice/cdk'
import type {apolloSchemas} from './def'

export const apolloServer = {} satisfies ConnectorServer<typeof apolloSchemas>

export default apolloServer
