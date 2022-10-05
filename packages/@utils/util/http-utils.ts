import type http from 'node:http'
import type https from 'node:https'

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError as IAxiosError,
  Method,
} from 'axios'
import _Axios from 'axios'

import {defineProxyFn} from './di-utils'
import {stringifyQueryParams} from './url-utils'

export {default as Axios} from 'axios'
export type {AxiosError as IAxiosError} from 'axios'

// MARK: - Proxy Agent

export const $makeProxyAgent = defineProxyFn<
  (opts: {url: string; cert: string}) => http.Agent | https.Agent | undefined
>('$makeProxyAgent', () => undefined)

export function getDefaultProxyAgent() {
  return process.env['USE_PROXY_AGENT']
    ? $makeProxyAgent({
        url: process.env['PROXY_URL'] ?? '',
        cert: process.env['PROXY_CERT'] ?? '',
      })
    : undefined
}

/**
 * Axios request headers are upper case while response headers are lowercase.
 * @see https://cl.ly/5626359924fa This behavior is not documented so
 * instead we make everything lowercase for our own safety
 */
function lowercaseHeaders(headers: Record<string, unknown>) {
  const newHeaders: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(headers)) {
    newHeaders[key.toLowerCase()] = value
  }
  return newHeaders
}

const logger = console

// MARK: - HTTPClient

export type HTTPRequestConfig = AxiosRequestConfig

export class HTTPError<
  TRequestData = unknown,
  TResponseData = unknown,
> extends Error {
  static create(err: IAxiosError) {
    // Workaround for the axios inconsistency where data would have been serialized
    // by the time it reaches this stage
    // Notably, axios response seems to return `JSON.parse`d data
    const requestHeaders = lowercaseHeaders(err.config.headers) as Record<
      string,
      string
    >
    let requestData = err.config.data
    if (
      requestHeaders['content-type']?.startsWith('application/json') &&
      typeof requestData === 'string'
    ) {
      try {
        requestData = JSON.parse(requestData)
      } catch (err_) {
        logger.warn(err_, 'HTTPError JSON requestData parsing hack failed')
      }
    }

    return new HTTPError(
      {
        // TODO: Verify that `method` and `url` always exists
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        method: err.config.method!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        url: err.config.url!,
        headers: requestHeaders,
        data: requestData,
      },
      // https://stackoverflow.com/questions/39153080/how-can-i-get-the-status-code-from-an-http-error-in-axios
      err.response && {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
        headers: lowercaseHeaders(err.response.headers) as Record<
          string,
          string
        >,
      },
      err.message,
    )
  }

  override name = 'HTTPError'

  get code() {
    return this.response?.status
  }

  constructor(
    public readonly request: {
      method: Method
      url: string
      headers: Record<string, string>
      data: TRequestData
    },
    public readonly response:
      | {
          status: number
          statusText: string
          headers: Record<string, string>
          data: TResponseData
        }
      | undefined,
    public readonly originalMessage: string,
  ) {
    super(
      `${request.method.toUpperCase()} ${request.url} failed with ${
        response
          ? `HTTP ${response.status} ${response.statusText}`
          : originalMessage
      }`,
    )
    Object.setPrototypeOf(this, HTTPError.prototype)
  }
}

export type HTTPClient = AxiosInstance

/**
 * TODO: Replace reimplementation to use fetch instead, among other things it is used
 * by https://www.npmjs.com/package/api / https://api.readme.dev/docs (which is awesome by the way)
 * and will allow us to better integrate
 */
export function createHTTPClient({
  requestTransformer,
  responseTransformer,
  errorTransformer,
  refreshAuth,
  httpsAgent,
  ...config
}: Omit<
  AxiosRequestConfig,
  // httpAgent doesn't work and is thus confusing..
  'transformRequest' | 'transformResponse' | 'httpAgent'
> & {
  requestTransformer?: (
    req: AxiosRequestConfig,
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>
  responseTransformer?: (res: AxiosResponse) => AxiosResponse
  errorTransformer?: (err: HTTPError) => Error
  /**
   * If provided, will retry. To skip refreshing, return undefined
   * Inspired by https://stackoverflow.com/questions/51563821/axios-interceptors-retry-original-request-and-access-original-promise
   * https://github.com/Flyrell/axios-auth-refresh
   * */
  refreshAuth?: {
    /** `err` is undefined if we are proactively refreshing. Return false */
    refresh: (err?: HTTPError) => Promise<boolean | void> | undefined
    /** For situations where we know a token has likely expired */
    shouldProactiveRefresh?: (req: AxiosRequestConfig) => boolean
    /** Should return true for the refresh request itself... */
    shouldSkipRefresh?: (req: AxiosRequestConfig) => boolean
  }
}): HTTPClient {
  let refreshPromise: Promise<boolean | void> | undefined

  const axios = _Axios.create({
    // How do we use per request container here?
    httpsAgent: httpsAgent ?? getDefaultProxyAgent(),
    ...config,
  })
  if (requestTransformer) {
    axios.interceptors.request.use(requestTransformer)
  }
  // WARNING: https://github.com/axios/axios/issues/1663 Axios interceptors
  // are applied in reverse. Uuslaly we may need to refreshAuth before transforming
  // requests (such as Authorization header...)
  if (refreshAuth) {
    axios.interceptors.request.use((req) => {
      if (refreshAuth.shouldSkipRefresh?.(req)) {
        return req
      }
      if (!refreshPromise && refreshAuth.shouldProactiveRefresh?.(req)) {
        refreshPromise = refreshAuth.refresh()
      }
      return refreshPromise
        ? refreshPromise
            .finally(() => (refreshPromise = undefined))
            .catch((err) => {
              console.warn('[http] Failed to refresh auth', err)
              // eslint-disable-next-line @typescript-eslint/no-throw-literal
              throw new _Axios.Cancel('Failed to refresh auth')
            })
            .then(() => req)
        : req
    })
  }
  // TODO: Add test for transforming response error into
  axios.interceptors.response.use(
    (res) => {
      if (responseTransformer) {
        return responseTransformer(res)
      }
      return res
    },
    (err: IAxiosError) => {
      if (!err.isAxiosError) {
        throw err
      }
      const error = HTTPError.create(err)
      if (error.code === 401 && refreshAuth && !refreshPromise) {
        refreshPromise = refreshAuth.refresh(error)
        if (refreshPromise) {
          return refreshPromise
            .finally(() => (refreshPromise = undefined))
            .then((res) => {
              if (res === false) {
                throw errorTransformer ? errorTransformer(error) : error
              }
              return axios.request(err.response?.config ?? {})
            })
        }
      }
      throw errorTransformer ? errorTransformer(error) : error
    },
  )
  return axios
}

// MARK: - OpenAPI codegen

// Copied over from various generated files...

/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type ApiRequestOptions = {
  readonly method:
    | 'GET'
    | 'PUT'
    | 'POST'
    | 'DELETE'
    | 'OPTIONS'
    | 'HEAD'
    | 'PATCH'
  readonly url: string
  readonly path?: Record<string, any>
  readonly cookies?: Record<string, any>
  readonly headers?: Record<string, any>
  readonly query?: Record<string, any>
  readonly formData?: Record<string, any>
  readonly body?: any
  readonly mediaType?: string
  readonly responseHeader?: string
  readonly errors?: Record<number, string>
}

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>
type Headers = Record<string, string>

type OpenAPIConfig = {
  BASE: string
  VERSION: string
  WITH_CREDENTIALS: boolean
  CREDENTIALS: 'include' | 'omit' | 'same-origin'
  TOKEN?: string | Resolver<string>
  USERNAME?: string | Resolver<string>
  PASSWORD?: string | Resolver<string>
  HEADERS?: Headers | Resolver<Headers>
  ENCODE_PATH?: (path: string) => string
}

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
  const encoder = config.ENCODE_PATH || encodeURI

  const path = options.url
    .replace('{api-version}', config.VERSION)
    .replace(/{(.*?)}/g, (substring: string, group: string) => {
      if (options.path?.hasOwnProperty(group)) {
        return encoder(String(options.path[group]))
      }
      return substring
    })

  return `${config.BASE}${path}`
}

/* eslint-enable @typescript-eslint/consistent-type-definitions */

/**
 * To be used together with https://github.com/ferdikoomen/openapi-typescript-codegen
 * Adapted from https://gist.github.com/tonyxiao/9df2d9ce50096a1adf96c5437a084d06
 */
export const createOpenApiRequestFactory = <U extends Promise<any>>(
  http: HTTPClient,
  CancelablePromise: new (
    fn: (
      resolve: (value: any | PromiseLike<any>) => void,
      reject: (reason?: any) => void,
      onCancel: (handleCancel: () => void) => void,
    ) => void,
  ) => U,
) =>
  class OpenApiRequestFactory {
    constructor(public readonly config: OpenAPIConfig) {}

    /**
     * Request method
     * @param opts The request options from the service
     * @returns CancelablePromise<T>
     * @throws ApiError
     */
    request(opts: ApiRequestOptions) {
      return new CancelablePromise((resolve, reject, onCancel) => {
        // Get the request URL. Depending on your needs, this might need additional processing,
        // @see ./src/templates/core/functions/getUrl.hbs
        const url = getUrl(this.config, opts)
        // console.log('Will request url', url, opts)

        // Optional: Get and link the cancelation token, so the request can be aborted.
        const source = _Axios.CancelToken.source()
        onCancel(() => source.cancel('The user aborted a request.'))

        const formData = opts.formData
          ? stringifyQueryParams(opts.formData)
          : null

        // Execute the request. This is a minimal example, in real world scenarios
        // you will need to add headers, process form data, etc.
        // @see ./src/templates/core/axios/request.hbs
        http
          .request({
            url,
            method: opts.method,
            withCredentials: this.config.WITH_CREDENTIALS,
            params: opts.query,
            data: formData ?? opts.body,
            headers: {
              ...opts.headers,
              ...(formData && {
                'Content-Type': 'application/x-www-form-urlencoded',
              }),
            },
            cancelToken: source.token,
          })
          .then((res) => resolve(res.data))
          .catch((_err) => {
            let error = _err
            if (_err instanceof HTTPError && _err.response) {
              const statusText = opts.errors?.[_err.response.status]
              if (statusText) {
                error = new HTTPError(
                  _err.request,
                  {..._err.response, statusText},
                  _err.originalMessage,
                )
              }
            }
            reject(error)
          })
      })
    }
  }
