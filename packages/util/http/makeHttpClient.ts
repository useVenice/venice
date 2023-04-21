import {getDefaultProxyAgent, HTTPError} from './http-utils'
import z from 'zod'
import * as R from 'remeda'
import {safeJSONParse} from '../json-utils'
import {defineProxyFn} from '../di-utils'
import {joinPath} from '../url-utils'
import {stringifyQueryParams} from '../url-utils'

const zHttpMethod = z.enum([
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'options',
])

export declare type HTTPMethod = z.infer<typeof zHttpMethod>

export interface HttpRequestOptions {
  header?: Record<string, unknown>
  /** path substitution params */
  path?: Record<string, unknown>
  /** searchQuery params */
  query?: Record<string, unknown>
  cookies?: Record<string, unknown> // TODO: Impl. cookies
  /** Body json */
  bodyJson?: Record<string, unknown>
  bodyForm?: Record<string, unknown>
  bodyText?: string
}

export type HttpClientOptions = RequestInit & {
  baseUrl: string
  auth?: {
    bearerToken?: string
    basic?: {username: string; password: string}
  }

  fetch?: typeof fetch
  URL?: typeof URL
}

/**
 * Patching globalThis.fetch does not work reliably in a next.js context
 * Thus this workaround...
 */
export const $getFetchFn = defineProxyFn<() => typeof fetch | undefined>(
  '$getFetchFn',
  () => undefined,
)

export function makeHttpClient(options: HttpClientOptions) {
  const {
    fetch = $getFetchFn() ?? globalThis.fetch,
    URL = globalThis.URL,
    baseUrl,
    auth,
    ...defaults
  } = options

  const agent = getDefaultProxyAgent()

  // TODO: Perform runtime validation on input... so we don't get body
  // json / form / string at the same time...
  function request(
    method: Uppercase<HTTPMethod>,
    path: string,
    input: HttpRequestOptions,
  ): Promise<unknown> {
    const url = new URL(baseUrl)
    // Need a better function for this than += pathname...
    url.pathname = joinPath(url.pathname, getPath(path, input.path ?? {}))
    Object.entries(input.query ?? {}).forEach(([key, value]) =>
      url.searchParams.set(key, `${value}`),
    )
    const headers = {
      ...(input.bodyForm && {
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      ...(input.bodyJson && {'Content-Type': 'application/json'}),
      ...(input.bodyText && {'Content-Type': 'text/plain'}),
      ...(auth?.basic && {
        Authorization: `Basic ${btoa(
          `${auth.basic.username}:${auth.basic.password}`,
        )}`,
      }),
      ...(auth?.bearerToken && {Authorization: `Bearer ${auth.bearerToken}`}),
      ...defaults.headers,
      ...input.header,
    } as Record<string, string>

    const body =
      input.bodyText ?? input.bodyJson
        ? JSON.stringify(input.bodyJson)
        : input.bodyForm
        ? stringifyQueryParams(input.bodyForm)
        : undefined

    // NOTE: Implement proxyAgent as a middleware
    // This way we can transparently use reverse proxies also in addition to forward proxy
    // as well as just simple in-app logging.
    return fetch(url, {
      // @ts-expect-error Node fetch specific option... Noop on other platforms.
      agent,
      ...defaults,
      method,
      headers,
      body,
    }).then(async (res) => {
      const text = await res.text()
      const json = safeJSONParse(text)
      if (res.status < 200 || res.status >= 300) {
        throw new HTTPError(
          {url: url.toString(), method, headers, data: body},
          {
            data: json,
            headers: Object.fromEntries(res.headers.entries()),
            status: res.status,
            statusText: res.statusText,
          },
          res.statusText,
        )
      }
      return json
    })
  }

  const methods = R.mapToObj(zHttpMethod.options, (method) => [
    method,
    (path: string, input: HttpRequestOptions) =>
      request(method.toUpperCase() as Uppercase<typeof method>, path, input),
  ])

  return {...methods, request}
}

// TODO: build url from utils?
function getPath(path: string, pathParams: Record<string, any>) {
  return path.replace(/\{([^}]+)\}/g, (_, key) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const value = encodeURIComponent(pathParams[key])
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete, @typescript-eslint/no-unsafe-member-access
    delete pathParams[key]
    return value
  })
}
