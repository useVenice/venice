import type {MaybePromise} from '@usevenice/util'
import {objectEntries, R, startCase, z, zObject} from '@usevenice/util'
import type {
  PaginatedOutput,
  Pagination,
  VerticalRouterOpts,
} from '@usevenice/vdk'
import {
  paginatedOutput,
  proxyListRemoteRedux,
  zPaginationParams,
} from '@usevenice/vdk'
import type {
  ConnectorSchemas,
  ConnHelpers,
} from '../../kits/cdk/connector.types'
import type * as Pta from './pta-types'

export * from './pta-utils'
export type {Pta}

export const zPta = {
  account: zObject<Pta.Account>(),
  // .openapi({format: 'prefix:acct'}),
  transaction: zObject<Pta.Transaction>(),
  // .openapi({format: 'prefix:exp'}),
  commodity: zObject<Pta.Commodity>(),
  // .openapi({format: 'prefix:ven'}),
}

export const zPtaEntityName = z.enum(Object.keys(zPta) as [keyof typeof zPta])

export type ZPta = {
  [k in keyof typeof zPta]: z.infer<(typeof zPta)[k]>
}

export interface PtaMethods<
  TDef extends ConnectorSchemas,
  TInstance,
  T extends ConnHelpers<TDef> = ConnHelpers<TDef>,
> {
  list?: <TType extends keyof T['_verticals']['pta']>(
    instance: TInstance,
    stream: TType,
    opts: Pagination,
  ) => MaybePromise<PaginatedOutput<T['_verticals']['pta'][TType]>>
  get?: <TType extends keyof T['_verticals']['pta']>(
    instance: TInstance,
    stream: TType,
    opts: Pagination,
  ) => MaybePromise<T['_verticals']['pta'][TType] | null>
}

// This is unfortunately quite duplicated...
// Guess it means accounting router also belongs in the engine backend...

export function createPtaRouter(opts: VerticalRouterOpts) {
  const vertical = 'pta'
  // We cannot use a single trpc procedure because neither openAPI nor trpc
  // supports switching output shape that depends on input

  return opts.trpc.router(
    R.mapToObj(objectEntries(zPta), ([entityName, v]) => [
      `${vertical}_${entityName}_list`,
      opts.remoteProcedure
        .meta({
          openapi: {
            method: 'GET',
            path: `/${vertical}/${entityName}`,
            tags: [startCase(vertical)],
          },
        })
        .input(zPaginationParams.nullish())
        .output(paginatedOutput(v as any))
        .query(async ({input, ctx}) =>
          proxyListRemoteRedux({input, ctx, meta: {entityName, vertical}}),
        ),
    ]),
  )
}
