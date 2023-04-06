import type {Get} from 'type-fest'
import type {HttpClientOptions, HTTPMethod} from './makeHttpClient'
import {makeHttpClient} from './makeHttpClient'

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

export function makeOpenApiClient<T extends {}>(options: HttpClientOptions) {
  type Info = InfoFromPaths<T>
  return makeHttpClient(options) as {
    [m in HTTPMethod]: <Path extends keyof Info[m]>(
      path: Path,
      info: Get<Info[m][Path], 'input'>,
    ) => Promise<Get<Info[m][Path], 'output'>>
  } & {
    request: <
      Method extends Uppercase<keyof Info>,
      M extends Lowercase<Method>,
      Path extends keyof Info[M],
    >(
      method: Method,
      path: Path,
      input: Get<Info[M][Path], 'input'>,
    ) => Promise<Get<Info[M][Path], 'output'>>
  }
}
