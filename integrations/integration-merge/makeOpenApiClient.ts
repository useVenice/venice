import {getDefaultProxyAgent, R, z} from '@usevenice/util'
import type {Get} from 'type-fest'

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

type Strict<T> = unknown extends T ? never : T
type OmitNever<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends never ? never : K
  }[keyof T]
>

export type InfoFromPaths<T extends {}> = {
  [m in HTTPMethod]: OmitNever<{
    [p in keyof T]: m extends keyof T[p]
      ? T[p][m] extends {
          parameters?: infer Params
          requestBody?: {content: {'application/json': infer BodyInput}}
          responses?: {
            [_ in 200 | 201]?: {content: {'application/json': infer BodyOutput}}
          }
        }
        ? {
            input: Partial<Params> & {body?: BodyInput}
            output: Strict<BodyOutput>
          }
        : never
      : never
    // TODO: Add support for error here...
  }>
}

export function makeOpenApiClient<T extends {}>(
  options: RequestInit & {
    baseUrl: string
    fetch?: typeof fetch
    URL?: typeof URL
  },
) {
  const {
    fetch = globalThis.fetch,
    URL = globalThis.URL,
    baseUrl,
    ...defaults
  } = options

  type Info = InfoFromPaths<T>

  function request<
    Method extends Uppercase<keyof Info>,
    M extends Lowercase<Method>,
    Path extends keyof Info[M],
  >(
    method: Method,
    path: Path,
    _input: Get<Info[M][Path], 'input'>,
  ): Promise<Get<Info[M][Path], 'output'>> {
    const input = _input as {
      headers?: {}
      query?: {}
      body?: {}
      path?: {}
      cookies?: {} // TODO: Impl. cookies
    }

    // TODO: Create a better function for this than += pathname...
    const url = new URL(baseUrl)

    url.pathname += getPath(path as string, input.path ?? {})
    Object.entries(input.query ?? {}).forEach(([key, value]) =>
      url.searchParams.set(key, `${value}`),
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (
      // TODO: Implement proxyAgent as a middleware
      // This way we can transparently use reverse proxies also in addition to forward proxy
      // as well as just simple in-app logging.
      fetch(url, {
        // @ts-expect-error Node fetch specific option... Noop on other platforms.
        agent: getDefaultProxyAgent(),
        ...defaults,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...defaults.headers,
          ...input.headers,
          // TODO: Send cookie...
        },
        body: input.body ? JSON.stringify(input.body) : defaults.body,
      })
        .then((res) => res.text())
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .then((text) => (text ? JSON.parse(text) : null))
    )
  }

  const methods = R.mapToObj(zHttpMethod.options, (method) => [
    method,
    (path: any, input: any) =>
      request(method.toUpperCase() as Uppercase<typeof method>, path, input),
  ]) as {
    [m in HTTPMethod]: <Path extends keyof Info[m]>(
      path: Path,
      info: Get<Info[m][Path], 'input'>,
    ) => Promise<Get<Info[m][Path], 'output'>>
  }

  return {...methods, request}
}

function getPath(path: string, pathParams: Record<string, any>) {
  return path.replace(/\{([^}]+)\}/g, (_, key) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const value = encodeURIComponent(pathParams[key])
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete, @typescript-eslint/no-unsafe-member-access
    delete pathParams[key]
    return value
  })
}
