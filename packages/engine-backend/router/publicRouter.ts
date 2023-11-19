import {metaForProvider} from '@usevenice/cdk'
import {R, z} from '@usevenice/util'

import {publicProcedure, trpc} from './_base'

export const publicRouter = trpc.router({
  health: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/health',
        tags: ['internal'],
        summary: 'Health check',
      },
    })
    .input(z.void())
    .output(z.string())
    .query(() => 'Ok ' + new Date().toISOString()),
  getIntegrationCatalog: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/connectors',
        tags: ['connectors'],
        summary: 'Get catalog of all available connectors',
      },
    })
    .input(z.object({includeOas: z.boolean().optional()}).optional())
    // TODO: Add deterministic type for the output here
    .output(z.unknown())
    .query(({ctx, input}) =>
      R.mapValues(ctx.providerMap, (provider) =>
        metaForProvider(provider, input),
      ),
    ),
  getPublicEnv: publicProcedure.query(({ctx}) =>
    R.pick(ctx.env, ['NEXT_PUBLIC_NANGO_PUBLIC_KEY']),
  ),
})
