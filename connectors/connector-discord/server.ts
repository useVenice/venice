import type {IntegrationServer} from '@usevenice/cdk'

import type {discordSchemas} from './def'

export const discordServer = {} satisfies IntegrationServer<
  typeof discordSchemas
>

export default discordServer
