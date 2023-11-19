import type {FetchOptions, FetchResponse} from 'openapi-fetch'
import _createClient from 'openapi-fetch'

import type {HTTPMethod} from './HTTPError'
import {HTTPError} from './HTTPError'

type MaybePromise<T> = T | Promise<T>
type FetchParams = [string, Parameters<typeof fetch>[1]]
type _ClientOptions = NonNullable<Parameters<typeof _createClient>[0]>

export interface ClientOptions extends _ClientOptions {
  // Workaround for https://github.com/drwpow/openapi-typescript/issues/1122
  preRequest?: (...args: FetchParams) => MaybePromise<FetchParams>
  postRequest?: (
    res: Awaited<ReturnType<typeof fetch>>,
    requestArgs: FetchParams,
  ) => ReturnType<typeof fetch>
}

export function createClient<Paths extends {}>({
  preRequest = (url, init) => [url, init],
  postRequest = (res) => Promise.resolve(res),
  ...clientOptions
}: ClientOptions = {}) {
  const baseFetch = clientOptions?.fetch ?? globalThis.fetch
  const customFetch: typeof baseFetch = async (url, init) => {
    const requestArgs = await preRequest(url as string, init)
    const res = await baseFetch(...requestArgs)
    return postRequest(res, requestArgs)
  }
  const client = _createClient<Paths>({...clientOptions, fetch: customFetch})

  return {
    /** Untyped request */
    request: <T>(
      method: HTTPMethod,
      url: string,
      options?: Omit<FetchOptions<unknown>, 'body'> & {body?: unknown},
    ) =>
      client[method as 'GET'](url as never, options as never).then(
        throwIfNotOk(method),
      ) as Promise<{
        data: T
        response: FetchResponse<unknown>['response']
      }>,
    GET: (...args: Parameters<typeof client.GET>) =>
      client.GET(...args).then(throwIfNotOk('GET')),
    PUT: (...args: Parameters<typeof client.PUT>) =>
      client.PUT(...args).then(throwIfNotOk('PUT')),
    POST: (...args: Parameters<typeof client.POST>) =>
      client.POST(...args).then(throwIfNotOk('POST')),
    DELETE: (...args: Parameters<typeof client.DELETE>) =>
      client.DELETE(...args).then(throwIfNotOk('DELETE')),
    OPTIONS: (...args: Parameters<typeof client.OPTIONS>) =>
      client.OPTIONS(...args).then(throwIfNotOk('OPTIONS')),
    HEAD: (...args: Parameters<typeof client.HEAD>) =>
      client.HEAD(...args).then(throwIfNotOk('HEAD')),
    PATCH: (...args: Parameters<typeof client.PATCH>) =>
      client.PATCH(...args).then(throwIfNotOk('PATCH')),
    TRACE: (...args: Parameters<typeof client.TRACE>) =>
      client.TRACE(...args).then(throwIfNotOk('TRACE')),
  }
}

function throwIfNotOk<T>(method: HTTPMethod) {
  return (res: FetchResponse<T>) => {
    if (res.error) {
      throw new HTTPError<T>({method, error: res.error, response: res.response})
    }
    return res
  }
}
