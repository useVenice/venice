import type {MaybePromise} from '@usevenice/util'
import {z} from '@usevenice/util'

import type {IntegrationSchemas, IntHelpers} from '../integration.types'
import type {
  PaginatedOutput,
  Pagination,
  VerticalRouterOpts,
} from './new-mapper'
import {paginatedOutput, proxyListRemote, zPaginationParams} from './new-mapper'

export const zInvestment = {
  account: z.object({
    id: z.string(),
    name: z.string(),
  }),
  transaction: z.object({
    id: z.string(),
  }),
  holding: z.object({
    id: z.string(),
  }),
  security: z.object({
    id: z.string(),
  }),
}

export const zInvestmentEntityName = z.enum(
  Object.keys(zInvestment) as [keyof typeof zInvestment],
)

export type ZInvestment = {
  [k in keyof typeof zInvestment]: z.infer<(typeof zInvestment)[k]>
}

export interface InvestmentMethods<
  TDef extends IntegrationSchemas,
  TInstance,
  T extends IntHelpers<TDef> = IntHelpers<TDef>,
> {
  list?: <TType extends keyof T['_verticals']['investment']>(
    instance: TInstance,
    stream: TType,
    opts: Pagination,
  ) => MaybePromise<PaginatedOutput<T['_verticals']['investment'][TType]>>
  get?: <TType extends keyof T['_verticals']['investment']>(
    instance: TInstance,
    stream: TType,
    opts: Pagination,
  ) => MaybePromise<T['_verticals']['investment'][TType] | null>
}

// This is unfortunately quite duplicated...
// Guess it means accounting router also belongs in the engine backend...

export function createInvestmentRouter(opts: VerticalRouterOpts) {
  // We cannot use a single trpc procedure because neither openAPI nor trpc
  // supports switching output shape that depends on input
  return opts.trpc.router({
    listAccounts: opts.remoteProcedure
      .meta({
        openapi: {method: 'GET', path: '/investment/accounts'},
        response: {vertical: 'investment', entity: 'account', type: 'list'},
      })
      .input(zPaginationParams.nullish())
      .output(paginatedOutput(zInvestment.account))
      .query(proxyListRemote),
    listHoldings: opts.remoteProcedure
      .meta({
        openapi: {method: 'GET', path: '/investment/holdings'},
        response: {vertical: 'investment', entity: 'holding', type: 'list'},
      })
      .input(zPaginationParams.nullish())
      .output(paginatedOutput(zInvestment.holding))
      .query(proxyListRemote),
    listTransactions: opts.remoteProcedure
      .meta({
        openapi: {method: 'GET', path: '/investment/transactions'},
        response: {vertical: 'investment', entity: 'transaction', type: 'list'},
      })
      .input(zPaginationParams.nullish())
      .output(paginatedOutput(zInvestment.transaction))
      .query(proxyListRemote),
  })
}
