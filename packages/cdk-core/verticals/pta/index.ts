import type {MaybePromise} from '@usevenice/util'
import {objectEntries, R, z, zCast} from '@usevenice/util'

import type * as Pta from './pta-types'
import type {IntegrationSchemas, IntHelpers} from '../../integration.types'
import type {
  PaginatedOutput,
  Pagination,
  VerticalRouterOpts,
} from '../new-mapper'
import {
  paginatedOutput,
  proxyListRemoteRedux,
  zPaginationParams,
} from '../new-mapper'

export const zPta = {
  account: zCast<Pta.Account>(),
  // .openapi({format: 'prefix:acct'}),
  transaction: zCast<Pta.Transaction>(),
  // .openapi({format: 'prefix:exp'}),
  commodity: zCast<Pta.Commodity>(),
  // .openapi({format: 'prefix:ven'}),
}

export const zPtaEntityName = z.enum(Object.keys(zPta) as [keyof typeof zPta])

export type ZPta = {
  [k in keyof typeof zPta]: z.infer<(typeof zPta)[k]>
}

export interface PtaMethods<
  TDef extends IntegrationSchemas,
  TInstance,
  T extends IntHelpers<TDef> = IntHelpers<TDef>,
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
        .meta({openapi: {method: 'GET', path: `/${vertical}/${entityName}`}})
        .input(zPaginationParams.nullish())
        .output(paginatedOutput(v as any))
        .query(async ({input, ctx}) =>
          proxyListRemoteRedux({input, ctx, meta: {entityName, vertical}}),
        ),
    ]),
  )
}
