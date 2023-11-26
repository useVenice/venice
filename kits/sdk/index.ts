import {createClient} from '@usevenice/openapi-client'
import type {paths} from './venice.oas'
import oas from './venice.oas.json'

export interface VeniceClientOptions {
  /** Optional because certain apis are public */
  apiKey?: string
  /** `reso_xxx` */
  resourceId?: string
}

// This is necessary because we cannot publish inferred type otherwise
// @see https://share.cleanshot.com/06NvskP0
export type VeniceClient = ReturnType<typeof createClient<paths>> & {
  // This should be made optional to keep the bundle size small
  // company should be able to opt-in for things like validation
  oas: typeof oas
}

export function createVeniceClient(opts: VeniceClientOptions): VeniceClient {
  const client = createClient<paths>({
    baseUrl: 'https://app.venice.is/api/v0',
    headers: {
      // NOTE: Centralize reference to these headers
      ...(opts.apiKey && {'x-apikey': opts.apiKey}),
      ...(opts.resourceId && {'x-resource-id': opts.resourceId}),
    },
  })
  return {...client, oas}
}

// codegen:start {preset: barrel, include: "./{*.{ts,tsx},*/index.{ts,tsx}}", exclude: "./**/*.{spec,test,fixture,d}.{ts,tsx}"}
export * from './createSdk'
// codegen:end
