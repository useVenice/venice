import {z} from 'zod'

import {defaultVeniceHost} from './common'

export const zVeniceClientConfig = z.object({
  /** Service account auth */
  apiKey: z.string().nullish(),
  /** User auth, should pass in one or the other */
  accessToken: z.string().nullish(),
  apiHost: z.string().default(defaultVeniceHost),
})
export type VeniceClientConfig = z.infer<typeof zVeniceClientConfig>

export function makeVeniceClient({
  apiKey,
  accessToken,
  ...config
}: VeniceClientConfig) {
  const apiBase = new URL('/api/openapi/', config.apiHost).toString()
  const headers = {
    'Content-Type': 'application/json',
    ...(apiKey ? {'x-apikey': apiKey} : {}),
    ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
  }

  return {
    listResources: async (opts: {
      integrationId?: string
      providerName?: string
    }) => {
      const url = new URL('resources', apiBase)
      if (opts.integrationId) {
        url.searchParams.set('integrationId', opts.integrationId)
      }
      if (opts.providerName) {
        url.searchParams.set('providerName', opts.providerName)
      }
      const res = await fetch(url.toString(), {method: 'GET', headers})
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await res.json()
      return data as Array<{id: string}>
    },
    // Maybe we should allow end user to create magic link for themselves too so that
    // this operation can be done client side instead of server side?
    createMagicLink: async (opts: {
      integrationId?: string
      providerName?: string
      endUserId?: string
      validityInSeconds?: number
    }) => {
      const url = new URL('magic-link', apiBase)
      const res = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({...opts}, null, 4),
        headers,
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await res.json()
      return data as {url: string}
    },
    createConnectToken: async (opts: {
      endUserId?: string
      validityInSeconds?: number
    }) => {
      const url = new URL('connect-token', apiBase)
      const res = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({...opts}, null, 4),
        headers,
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await res.json()
      return data as {token: string}
    },
  }
}
