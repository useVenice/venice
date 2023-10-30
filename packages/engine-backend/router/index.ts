import type {inferRouterInputs, inferRouterOutputs} from '@trpc/server'

// import {accountingRouter} from './verticals/accounting'

import {createAccountingRouter} from '@usevenice/cdk-core/verticals/accounting'

import {remoteProcedure, trpc} from './_base'
import {adminRouter} from './adminRouter'
import {endUserRouter} from './endUserRouter'
import {protectedRouter} from './protectedRouter'
import {publicRouter} from './publicRouter'
import {systemRouter} from './systemRouter'

const accountingRouter = createAccountingRouter({trpc, remoteProcedure})

// accountingRouter._def.procedures.listAccounts._def.meta?.openapi?.path += '/accounting/'

export const flatRouter = trpc.mergeRouters(
  publicRouter,
  protectedRouter,
  endUserRouter,
  adminRouter,
  systemRouter,
  accountingRouter,
)

// Which one is best?
export const nestedRouter = trpc.router({
  public: publicRouter,
  protected: protectedRouter,
  endUser: endUserRouter,
  admin: adminRouter,
  system: systemRouter,
  accounting: accountingRouter,
})

export type FlatRouter = typeof flatRouter
export type RouterInput = inferRouterInputs<typeof flatRouter>
export type RouterOutput = inferRouterOutputs<typeof flatRouter>

export type {AnyRouter} from '@trpc/server'
