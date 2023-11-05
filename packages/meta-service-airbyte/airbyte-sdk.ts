import createClient from 'openapi-fetch'

import type {paths as connections} from './api/airbyte-api-connections.gen'
import type {paths as destinations} from './api/airbyte-api-destinations.gen'
import type {paths as health} from './api/airbyte-api-health.gen'
import type {paths as jobs} from './api/airbyte-api-jobs.gen'
import type {paths as sources} from './api/airbyte-api-sources.gen'
import type {paths as streams} from './api/airbyte-api-streams.gen'
import type {paths as workspaces} from './api/airbyte-api-workspaces.gen'
import type {paths as internal} from './api/airbyte-private-api.gen'

export interface AirbyteSDKOptions {
  accessToken: string
}

export function AirbytePublicSDK(opts: AirbyteSDKOptions) {
  const client = createClient({
    baseUrl: 'https://api.airbyte.com/v1',
    headers: {Authorization: `Bearer ${opts.accessToken}`},
  })
  return {
    ...client,
    connections: client as ReturnType<typeof createClient<connections>>,
    destinations: client as ReturnType<typeof createClient<destinations>>,
    jobs: client as ReturnType<typeof createClient<jobs>>,
    sources: client as ReturnType<typeof createClient<sources>>,
    streams: client as ReturnType<typeof createClient<streams>>,
    workspaces: client as ReturnType<typeof createClient<workspaces>>,
  }
}

export function AirbytePrivateSDK(opts: AirbyteSDKOptions) {
  const client = createClient({
    baseUrl: 'https://api.airbyte.com',
    headers: {Authorization: `Bearer ${opts.accessToken}`},
  })
  return {
    ...client,
    health: client as ReturnType<typeof createClient<health>>,
    internal: client as ReturnType<typeof createClient<internal>>,
  }
}
