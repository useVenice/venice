import {metaForProvider} from '@usevenice/cdk'
import {R, z} from '@usevenice/util'

import {publicProcedure, trpc} from './_base'

export const publicRouter = trpc.router({
  health: publicProcedure
    .meta({openapi: {method: 'GET', path: '/health'}})
    .input(z.void())
    .output(z.string())
    .query(() => 'Ok ' + new Date().toISOString()),
  getIntegrationCatalog: publicProcedure.query(({ctx}) =>
    R.mapValues(ctx.providerMap, (provider) => metaForProvider(provider)),
  ),
  getPublicEnv: publicProcedure.query(({ctx}) =>
    R.pick(ctx.env, ['NEXT_PUBLIC_NANGO_PUBLIC_KEY']),
  ),
})
