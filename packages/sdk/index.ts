import {createClient} from '@usevenice/openapi-client'

import type {paths} from './venice.oas'

export interface VeniceClientOptions {
  /** Optional because certain apis are public */
  apiKey?: string
  /** `reso_xxx` */
  resourceId?: string
}

export function createVeniceClient(opts: VeniceClientOptions) {
  return createClient<paths>({
    baseUrl: 'https://app.venice.is/api/v0',
    headers: {
      // NOTE: Centralize reference to these headers
      ...(opts.apiKey && {'x-apikey': opts.apiKey}),
      ...(opts.resourceId && {'x-resource-id': opts.resourceId}),
    },
  })
}
