import {defineProxyFn, isDependencyRegistered} from './di-utils'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError as IAxiosError,
  Method,
} from 'axios'
import _Axios from 'axios'
import type http from 'http'
import type https from 'https'

export type HTTPRequestConfig = AxiosRequestConfig

export const $makeProxyAgent =
  defineProxyFn<
    (opts: {url: string; cert: string}) => http.Agent | https.Agent | undefined
  >('$makeProxyAgent')

export function getDefaultProxyAgent() {
  return process.env['USE_PROXY_AGENT'] &&
    isDependencyRegistered($makeProxyAgent.token)
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
      } catch (error) {
        logger.warn(error, 'HTTPError JSON requestData parsing hack failed')
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        status: err.response!.status,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        statusText: err.response!.statusText,
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
    originalMessage: string,
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

// @yenbekbay Let's figure out how to conditionally change the response type of R
// so that responseTransformer may be allowed to change the type of response returned
// export type HTTPClient<R> = Omit<AxiosInstance, 'get' | 'post' | 'put'> & {
//   request<T = any> (config: AxiosRequestConfig): Promise<R extends AxiosResponse ? R : T>;
//   get<T = any>(url: string, config?: AxiosRequestConfig): Promise<R extends AxiosResponse ? R : T>;
//   delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<R extends AxiosResponse ? R : T>;
//   head<T = any>(url: string, config?: AxiosRequestConfig): Promise<R extends AxiosResponse ? R : T>;
//   post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R extends AxiosResponse ? R : T>;
//   put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R extends AxiosResponse ? R : T>;
//   patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R extends AxiosResponse ? R : T>;
// }

export type HTTPClient = AxiosInstance

export function createHTTPClient({
  requestTransformer,
  responseTransformer,
  errorTransformer,
  refreshAuth,
  httpsAgent,
  ...config
}: Omit<AxiosRequestConfig, 'transformRequest' | 'transformResponse'> & {
  requestTransformer?: (
    req: AxiosRequestConfig,
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseTransformer?: (res: AxiosResponse) => AxiosResponse
  errorTransformer?: (err: HTTPError) => Error
  /**
   * If provided, will retry. To skip refreshing, return undefined
   * Inspired by https://stackoverflow.com/questions/51563821/axios-interceptors-retry-original-request-and-access-original-promise
   * https://github.com/Flyrell/axios-auth-refresh
   * */
  refreshAuth?: {
    /** `err` is undefined if we are proactively refreshing */
    refresh: (err?: HTTPError) => Promise<void> | undefined
    /** For situations where we know a token has likely expired */
    shouldProactiveRefresh?: (req: AxiosRequestConfig) => boolean
  }
}): HTTPClient {
  let refreshing: Promise<void> | undefined

  const axios = _Axios.create({
    // How do we use per request container here?
    httpsAgent: httpsAgent ?? getDefaultProxyAgent(),
    ...config,
  })
  if (requestTransformer) {
    axios.interceptors.request.use(requestTransformer)
  }
  // https://github.com/axios/axios/issues/1663 Applied in reverse
  if (refreshAuth) {
    axios.interceptors.request.use((req) => {
      if (!refreshing && refreshAuth.shouldProactiveRefresh?.(req)) {
        refreshing = refreshAuth.refresh()
      }
      return refreshing
        ? refreshing
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
      if (error.code === 401 && refreshAuth && !refreshing) {
        refreshing = refreshAuth.refresh(error)
        if (refreshing) {
          return refreshing
            .finally(() => (refreshing = undefined))
            .then(() => axios.request(err.response?.config ?? {}))
        }
      }
      throw errorTransformer ? errorTransformer(error) : error
    },
  )
  return axios
}

export {default as Axios} from 'axios'
