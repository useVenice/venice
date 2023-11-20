import type {ConnectorServer} from '@usevenice/cdk'

import type {discordSchemas} from './def'

export const discordServer = {} satisfies ConnectorServer<typeof discordSchemas>

export default discordServer
