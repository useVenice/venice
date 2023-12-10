import type {Link} from '@opensdks/runtime'
import {mergeHeaders, modifyRequest} from '@opensdks/runtime'

interface NangoProxyHeaders {
  authorization: `Bearer ${string}`
  'connection-id': string
  'provider-config-key': string
  /** For defaults w/o override, see https://nango.dev/providers.yaml */
  'base-url-override'?: string
  /** Override the decompress option when making requests. Optional, defaults to false */
  decompress?: string
  /** The number of retries in case of failure (with exponential back-off). Optional, default 0. */
  retries?: string
}

// TODO: Move this outside of qbo connector as it can be used in many places
export function nangoProxyLink(opts: {
  secretKey: string
  connectionId: string
  providerConfigKey: string

  baseUrl: string
  retries?: number
}): Link {
  const baseUrl = opts.baseUrl.endsWith('/') ? opts.baseUrl : `${opts.baseUrl}/`
  const nangoHeaders = {
    authorization: `Bearer ${opts.secretKey}`,
    'connection-id': opts.connectionId,
    'provider-config-key': opts.providerConfigKey,
    'base-url-override': opts.baseUrl,
    retries: String(opts.retries ?? 0),
  } satisfies NangoProxyHeaders

  return (req, next) =>
    next(
      modifyRequest(req, {
        url: req.url.replace(baseUrl, 'https://api.nango.dev/proxy/'),
        headers: mergeHeaders(req.headers, nangoHeaders),
        body: req.body,
      }),
    )
}
