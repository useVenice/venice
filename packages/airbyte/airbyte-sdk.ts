import createClient from 'openapi-fetch'

import type {paths as connections} from './api/airbyte-api-connections.gen'
import type {paths as destinations} from './api/airbyte-api-destinations.gen'
import type {paths as health} from './api/airbyte-api-health.gen'
import type {paths as jobs} from './api/airbyte-api-jobs.gen'
import type {paths as sources} from './api/airbyte-api-sources.gen'
import type {paths as streams} from './api/airbyte-api-streams.gen'
import type {paths as workspaces} from './api/airbyte-api-workspaces.gen'
import type {paths as internal} from './api/airbyte-private-api.gen'

interface PublicPaths {
  connections: connections
  destinations: destinations
  jobs: jobs
  sources: sources
  streams: streams
  workspaces: workspaces
}

interface PrivatePaths {
  health: health
  internal: internal
}

export interface AirbyteSDKOptions {
  accessToken: string
}

export function AirbytePublicSDK<T extends keyof PublicPaths>(
  opts: AirbyteSDKOptions,
) {
  return createClient<PublicPaths[T]>({
    baseUrl: 'https://api.airbyte.com/v1',
    headers: {Authorization: `Bearer ${opts.accessToken}`},
  })
}

export function AirbytePrivateSDK<T extends keyof PrivatePaths>(
  opts: AirbyteSDKOptions,
) {
  return createClient<PrivatePaths[T]>({
    // TODO: Figure out the right path to the private api
    baseUrl: 'https://api.airbyte.com',
    headers: {Authorization: `Bearer ${opts.accessToken}`},
  })
}
