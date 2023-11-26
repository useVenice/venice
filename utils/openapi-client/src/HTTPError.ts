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
    response: r,
  }: Extract<FetchResponse<T>, {error: unknown}> & {method: HTTPMethod}) {
    super(`[${r.status} ${r.statusText}] ${method.toUpperCase()} ${r.url}`)
    this.method = method
    this.error = error
    this.response = r
    Object.setPrototypeOf(this, HTTPError.prototype)
  }
}
