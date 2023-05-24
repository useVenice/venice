import {metaForProvider} from '@usevenice/cdk-core'
import {R} from '@usevenice/util'

import {publicProcedure, trpc} from './_base'

export const publicRouter = trpc.router({
  health: publicProcedure.query(() => 'Ok ' + new Date().toISOString()),
  getIntegrationCatalog: publicProcedure.query(({ctx}) =>
    R.mapValues(ctx.providerMap, (provider) => metaForProvider(provider)),
  ),
})
