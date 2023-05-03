import type {inferRouterInputs, inferRouterOutputs} from '@trpc/server'
import {trpc} from './_base'
import {adminRouter} from './adminRouter'
import {endUserRouter} from './endUserRouter'
import {protectedRouter} from './protectedRouter'
import {publicRouter} from './publicRouter'
import {systemRouter} from './systemRouter'

export const flatRouter = trpc.mergeRouters(
  publicRouter,
  protectedRouter,
  endUserRouter,
  adminRouter,
  systemRouter,
)

// Which one is best?
export const nestedRouter = trpc.router({
  public: publicRouter,
  protected: protectedRouter,
  endUser: endUserRouter,
  admin: adminRouter,
  system: systemRouter,
})

export type FlatRouter = typeof flatRouter
export type RouterInput = inferRouterInputs<typeof flatRouter>
export type RouterOutput = inferRouterOutputs<typeof flatRouter>
