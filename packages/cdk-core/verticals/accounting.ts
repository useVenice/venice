import {z} from '@usevenice/util'

import type {RouterMap, VerticalRouterOpts} from './new-mapper'
import {paginatedOutput, proxyCallRemote, zPaginationParams} from './new-mapper'

export const zAccounting = {
  account: z.object({
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

export function createAccountingRouter(opts: VerticalRouterOpts) {
  return opts.trpc.router({
    listAccounts: opts.remoteProcedure
      .meta({openapi: {method: 'GET', path: '/accounts'}})
      .input(zPaginationParams.nullish())
      .output(paginatedOutput(zAccounting.account))
      .query(proxyCallRemote),
    listExpenses: opts.remoteProcedure
      .meta({openapi: {method: 'GET', path: '/expenses'}})
      .input(zPaginationParams.nullish())
      .output(paginatedOutput(zAccounting.expense))
      .query(proxyCallRemote),
  })
}

export type AccountingRouter = ReturnType<typeof createAccountingRouter>
export type VerticalAccounting<TOpts> = RouterMap<AccountingRouter, TOpts>
