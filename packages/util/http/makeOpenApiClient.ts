import type {Get} from 'type-fest'
import type {z} from 'zod'

import type {
  HttpClientOptions,
  HTTPMethod,
  HttpRequestOptions,
} from './makeHttpClient'
import {makeHttpClient} from './makeHttpClient'

// Defining endpoints inline
interface _Endpoint {
  input: {[k in Exclude<keyof HttpRequestOptions, 'body'>]?: z.ZodTypeAny}
  output: z.ZodTypeAny
}

export type Endpoints = {
  [m in HTTPMethod]?: Record<string, _Endpoint>
}

export type InfoFromEndpoints<T extends Endpoints> = {
  [m in keyof T]: {
    [p in keyof T[m]]: T[m][p] extends _Endpoint
      ? {
          input: {[k in keyof T[m][p]['input']]: _infer<T[m][p]['input'][k]>}
          output: _infer<T[m][p]['output']>
        }
      : never
  }
}

// Defnining endpoints from openapi-typescript
// TODO: Go the other way, PathFromEndpoints and use openapi-fetch package
export type InfoFromPaths<T extends {}> = {
  [m in HTTPMethod]: OmitNever<{
    [p in keyof T]: m extends keyof T[p]
      ? T[p][m] extends {
          parameters?: infer Params
          requestBody?: {
            content: {
              'application/json'?: infer JsonInput
              'application/x-www-form-urlencoded'?: infer FormInput
            }
          }
          responses?: {
            [_ in 200 | 201]?: {content: {'application/json': infer BodyOutput}}
          }
        }
        ? {
            // TODO: This needs to depend more clearly on HttpRequestOptions
            input: Partial<Params> & {
              bodyJson?: JsonInput
              bodyForm?: FormInput
            }
            output: Strict<BodyOutput>
          }
        : never
      : never
    // TODO: Add support for error here...
  }>
}

/** TODO: Make this type obviously a lot better... */
type OpenApiInfo = Record<string, {}>

export function makeOpenApiClient<Info extends OpenApiInfo>(
  options: HttpClientOptions,
) {
  return makeHttpClient(options) as {
    [m in HTTPMethod]: <Path extends keyof Info[m]>(
      path: Path,
      info: Get<Info[m][Path], 'input'>,
    ) => Promise<Get<Info[m][Path], 'output'>>
  } & {
    request: <
      Method extends Uppercase<Extract<keyof Info, string>>,
      M extends Lowercase<Method>,
      Path extends keyof Info[M],
    >(
      method: Method,
      path: Path,
      input: Get<Info[M][Path], 'input'>,
    ) => Promise<Get<Info[M][Path], 'output'>>
    _fetch: NonNullable<HttpClientOptions['fetch']>
    _request: ReturnType<typeof makeHttpClient>['_request']
  }
}

// MARK: - Generic utils, consider moving into our own type-fest file

type Strict<T> = unknown extends T ? never : T
type OmitNever<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends never ? never : K
  }[keyof T]
>
type _infer<T> = T extends z.ZodTypeAny ? z.infer<T> : never
