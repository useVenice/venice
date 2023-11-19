import type {inferRouterInputs, inferRouterOutputs} from '@trpc/server'

// import {accountingRouter} from './verticals/accounting'

import {createAccountingRouter} from '@usevenice/cdk/verticals/accounting'
import {createInvestmentRouter} from '@usevenice/cdk/verticals/investment'
import {createPtaRouter} from '@usevenice/cdk/verticals/pta'

import {remoteProcedure, trpc} from './_base'
import {adminRouter} from './adminRouter'
import {endUserRouter} from './endUserRouter'
import {protectedRouter} from './protectedRouter'
import {publicRouter} from './publicRouter'
import {resourceRouter} from './resourceRouter'
import {systemRouter} from './systemRouter'

const accountingRouter = createAccountingRouter({trpc, remoteProcedure})
const ptaRouter = createPtaRouter({trpc, remoteProcedure})
const investmentRouter = createInvestmentRouter({trpc, remoteProcedure})

// accountingRouter._def.procedures.listAccounts._def.meta?.openapi?.path += '/accounting/'

export const routers = {
  public: publicRouter,
  protected: protectedRouter,
  endUser: endUserRouter,
  admin: adminRouter,
  system: systemRouter,
  resource: resourceRouter,
  //
  accounting: accountingRouter,
  pta: ptaRouter,
  investment: investmentRouter,
}

// Which one is best?
export const nestedRouter = trpc.router(routers)

export const flatRouter = trpc.mergeRouters(
  publicRouter,
  protectedRouter,
  endUserRouter,
  adminRouter,
  systemRouter,
  resourceRouter,
  //
  accountingRouter,
  ptaRouter,
  investmentRouter,
)

export type FlatRouter = typeof flatRouter
export type RouterInput = inferRouterInputs<typeof flatRouter>
export type RouterOutput = inferRouterOutputs<typeof flatRouter>

export type {AnyRouter} from '@trpc/server'
