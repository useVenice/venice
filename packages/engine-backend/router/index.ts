import type {inferRouterInputs, inferRouterOutputs} from '@trpc/server'
// import {accountingRouter} from './verticals/accounting'

import {
  apolloAdapter,
  createAccountingRouter,
  createBankingRouter,
  createInvestmentRouter,
  createPtaRouter,
  createSalesEngagementRouter,
  outreachAdapter,
  qboAdapter,
  salesloftAdapter,
  xeroAdapter,
} from '@usevenice/cdk/verticals'
import {remoteProcedure, trpc} from './_base'
import {adminRouter} from './adminRouter'
import {connectorConfigRouter} from './connectorConfigRouter'
import {connectorRouter} from './connectorRouter'
import {endUserRouter} from './endUserRouter'
import {pipelineRouter} from './pipelineRouter'
import {protectedRouter} from './protectedRouter'
import {publicRouter} from './publicRouter'
import {resourceRouter} from './resourceRouter'
import {systemRouter} from './systemRouter'

const bankingRouter = createBankingRouter({
  trpc,
  remoteProcedure,
  adapterByName: {qbo: qboAdapter, xero: xeroAdapter},
})
const accountingRouter = createAccountingRouter({
  trpc,
  remoteProcedure,
  adapterByName: {},
})
const ptaRouter = createPtaRouter({trpc, remoteProcedure, adapterByName: {}})
const investmentRouter = createInvestmentRouter({
  trpc,
  remoteProcedure,
  adapterByName: {},
})
const salesEngagementRouter = createSalesEngagementRouter({
  trpc,
  remoteProcedure,
  // TODO: This should be moved into the vertical itself.
  adapterByName: {
    apollo: apolloAdapter,
    salesloft: salesloftAdapter,
    outreach: outreachAdapter,
  },
})

// accountingRouter._def.procedures.listAccounts._def.meta?.openapi?.path += '/accounting/'

export const routers = {
  public: publicRouter,
  protected: protectedRouter,
  endUser: endUserRouter,
  admin: adminRouter,
  connectorConfig: connectorConfigRouter,
  system: systemRouter,
  resource: resourceRouter,
  pipeline: pipelineRouter,
  connector: connectorRouter,
  //
  accounting: accountingRouter,
  pta: ptaRouter,
  investment: investmentRouter,
  salesEngagement: salesEngagementRouter,
  banking: bankingRouter,
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
  connectorConfigRouter,
  connectorRouter,
  pipelineRouter,
  trpc.router({
    verticals: trpc.router({
      accounting: accountingRouter,
      pta: ptaRouter,
      investment: investmentRouter,
      salesEngagement: salesEngagementRouter,
      banking: bankingRouter,
    }),
  }),
)

export type FlatRouter = typeof flatRouter
export type RouterInput = inferRouterInputs<typeof flatRouter>
export type RouterOutput = inferRouterOutputs<typeof flatRouter>

export type {AnyRouter} from '@trpc/server'
