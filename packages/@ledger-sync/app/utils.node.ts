

import {z, zFunction} from '@ledger-sync/util'
import tunnel from 'tunnel'
import url from 'url'

// New utils that does not depend on cloud-env import and also validate params
export const makeProxyAgentNext = zFunction(
  z.object({url: z.string(), cert: z.string()}),
  (input) => {
    // Seems that the default value get overwritten by explicit undefined
    // value from envkey. Here we try to account for that
    // Would be nice if such hack is not required.
    const {hostname, port, auth} = url.parse(input.url)
    if (!hostname || !port) {
      return undefined
    }

    return tunnel.httpsOverHttp({
      ca: input.cert ? [Buffer.from(input.cert)] : [],
      proxy: {
        host: hostname,
        port: Number.parseInt(port, 10),
        proxyAuth: auth ?? undefined,
        headers: {},
      },
    })
  },
)
