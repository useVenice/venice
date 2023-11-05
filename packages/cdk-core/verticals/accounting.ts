import type {MaybePromise} from '@usevenice/util'
import {z} from '@usevenice/util'

import type {IntegrationSchemas, IntHelpers} from '../integration.types'
import type {
  PaginatedOutput,
  Pagination,
  VerticalRouterOpts,
} from './new-mapper'
import {paginatedOutput, proxyCallRemote, zPaginationParams} from './new-mapper'

export const zAccounting = {
  account: z.object({
    id: z.string(),
    number: z.string().nullish(),
    name: z.string(),
    type: z.string(), //  z.enum(['asset', 'liability', 'equity', 'income', 'expense']),
  }),
  expense: z.object({
    id: z.string(),
    amount: z.number(),
    currency: z.string(),
    payment_account: z.string(),
  }),
  vendor: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
  }),
}

export type ZAccounting = {
  [k in keyof typeof zAccounting]: z.infer<(typeof zAccounting)[k]>
}

export interface AccountingVertical<
  TDef extends IntegrationSchemas,
  TInstance,
  T extends IntHelpers<TDef> = IntHelpers<TDef>,
> {
  listAccounts?: (
    opts: Pagination & {instance: TInstance},
  ) => MaybePromise<PaginatedOutput<T['_verticals']['accounting']['account']>>
  listExpenses?: (
    opts: Pagination & {instance: TInstance},
  ) => MaybePromise<PaginatedOutput<T['_verticals']['accounting']['expense']>>
}

// This is unfortunately quite duplicated...
// Guess it means accounting router also belongs in the engine backend...

export function createAccountingRouter(opts: VerticalRouterOpts) {
  return opts.trpc.router({
    listAccounts: opts.remoteProcedure
      .meta({
        openapi: {method: 'GET', path: '/accounts'},
        response: {vertical: 'accounting', entity: 'account', type: 'list'},
      })
      .input(zPaginationParams.nullish())
      .output(paginatedOutput(zAccounting.account))
      .query(proxyCallRemote),
    listExpenses: opts.remoteProcedure
      .meta({
        openapi: {method: 'GET', path: '/expenses'},
        response: {vertical: 'accounting', entity: 'expense', type: 'list'},
      })
      .input(zPaginationParams.nullish())
      .output(paginatedOutput(zAccounting.expense))
      .query(proxyCallRemote),
  })
}
