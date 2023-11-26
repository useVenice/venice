import {createClient} from '@usevenice/openapi-client'
import type {paths} from './venice.oas'

export interface VeniceClientOptions {
  /** Optional because certain apis are public */
  apiKey?: string
  /** `reso_xxx` */
  resourceId?: string
}

// This is necessary because we cannot publish inferred type otherwise
// @see https://share.cleanshot.com/06NvskP0
export type VeniceClient = ReturnType<typeof createClient<paths>>

export function createVeniceClient(opts: VeniceClientOptions): VeniceClient {
  return createClient<paths>({
    baseUrl: 'https://app.venice.is/api/v0',
    headers: {
      // NOTE: Centralize reference to these headers
      ...(opts.apiKey && {'x-apikey': opts.apiKey}),
      ...(opts.resourceId && {'x-resource-id': opts.resourceId}),
    },
  })
}
