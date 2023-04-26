import {trpc} from './_base'
import {adminRouter} from './adminRouter'
import {endUserRouter} from './endUserRouter'
import {nonPublicRouter} from './nonPublicRouter'
import {publicRouter} from './publicRouter'
import {systemRouter} from './systemRouter'

export const flatRouter = trpc.mergeRouters(
  publicRouter,
  nonPublicRouter,
  endUserRouter,
  adminRouter,
  systemRouter,
)

// Which one is best?
export const nestedRouter = trpc.router({
  public: publicRouter,
  nonPublic: nonPublicRouter,
  system: systemRouter,
  endUser: endUserRouter,
  admin: adminRouter,
})
