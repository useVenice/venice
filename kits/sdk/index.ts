import {createClient} from '@usevenice/openapi-client'
import type {paths} from './venice.oas'
import oas from './venice.oas.json'

export interface VeniceClientOptions {
  /** Optional because certain apis are public */
  apiKey?: string
  /** `reso_xxx` */
  resourceId?: string
  /** For end user authentication */
  accessToken?: string
  /** For using things like self hosting and staging env */
  apiHost?: string
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
    baseUrl: new URL(
      '/api/v0',
      opts.apiHost ?? 'https://app.venice.is',
    ).toString(),
    headers: {
      // NOTE: Centralize reference to these headers
      ...(opts.apiKey && {'x-apikey': opts.apiKey}),
      ...(opts.resourceId && {'x-resource-id': opts.resourceId}),
      ...(opts.accessToken && {Authorization: `Bearer ${opts.accessToken}`}),
    },
  })
  return {...client, oas}
}

// codegen:start {preset: barrel, include: "./{*.{ts,tsx},*/index.{ts,tsx}}", exclude: "./**/*.{spec,test,fixture,d,bootstrap}.{ts,tsx}"}
export * from './createSdk'
// codegen:end
