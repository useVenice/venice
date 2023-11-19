import type {FetchResponse} from 'openapi-fetch'

export type HTTPMethod =
  | 'GET'
  | 'PUT'
  | 'POST'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | 'PATCH'
  | 'TRACE'

export class HTTPError<T> extends Error {
  override name = 'HTTPError'
  readonly method: HTTPMethod
  readonly error: Extract<FetchResponse<T>, {error: unknown}>['error']
  readonly response: FetchResponse<T>['response']

  get code() {
    return this.response?.status
  }

  constructor({
    method,
    error,
    response,
  }: Extract<FetchResponse<T>, {error: unknown}> & {method: HTTPMethod}) {
    super(`[HTTP ${response.status}]: ${method.toUpperCase()} ${response.url}`)
    this.method = method
    this.error = error
    this.response = response
    Object.setPrototypeOf(this, HTTPError.prototype)
  }
}
