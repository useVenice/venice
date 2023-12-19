import type {Link} from '@opensdks/runtime'
import {mergeHeaders, modifyRequest} from '@opensdks/runtime'

const kBaseUrlOverride = 'base-url-override'

interface NangoProxyHeaders {
  authorization: `Bearer ${string}`
  'connection-id': string
  'provider-config-key': string
  /** For defaults w/o override, see https://nango.dev/providers.yaml */
  [kBaseUrlOverride]?: string
  /** Override the decompress option when making requests. Optional, defaults to false */
  decompress?: string
  /** The number of retries in case of failure (with exponential back-off). Optional, default 0. */
  retries?: string
}

// TODO: Move this outside of qbo connector as it can be used in many places
export function nangoProxyLink(opts: {
  secretKey: string
  /** `connection-id` header */
  connectionId: string
  /** `provider-config-key` header */
  providerConfigKey: string
  /** Default, can be verriden with `base-url-override` header on a per-request basis */
  baseUrlOverride?: string
  /** `retries` header */
  retries?: number
}): Link {
  const nangoHeaders = {
    authorization: `Bearer ${opts.secretKey}`,
    'connection-id': opts.connectionId,
    'provider-config-key': opts.providerConfigKey,
    retries: String(opts.retries ?? 0),
  } satisfies NangoProxyHeaders

  return (req, next) => {
    const baseUrlOverride =
      req.headers.get(kBaseUrlOverride) ?? opts.baseUrlOverride
    const baseUrl = baseUrlOverride
      ? baseUrlOverride.endsWith('/')
        ? baseUrlOverride
        : `${baseUrlOverride}/`
      : getBaseUrl(req.url)
    return next(
      modifyRequest(req, {
        url: req.url.replace(baseUrl, 'https://api.nango.dev/proxy/'),
        headers: mergeHeaders(req.headers, nangoHeaders, {
          ...(baseUrlOverride && {[kBaseUrlOverride]: baseUrlOverride}),
        }),
        body: req.body,
      }),
    )
  }
}

/** Use this header key to make make sure we are proxying to the right place */
nangoProxyLink.kBaseUrlOverride = kBaseUrlOverride

export function getBaseUrl(urlStr: string) {
  const url = new URL(urlStr)
  return `${url.protocol}//${url.host}/`
}
