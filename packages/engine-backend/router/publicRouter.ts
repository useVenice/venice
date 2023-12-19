import {zRaw, zViewer} from '@usevenice/cdk'
import {R, z} from '@usevenice/util'
import {zodToOas31Schema} from '@usevenice/zod'
import {publicProcedure, trpc} from './_base'

export const publicRouter = trpc.router({
  health: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/health',
        tags: ['Internal'],
        summary: 'Health check',
      },
    })
    .input(z.void())
    .output(z.string())
    .query(() => 'Ok ' + new Date().toISOString()),
  getViewer: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/viewer',
        summary: 'Get current viewer accessing the API',
      },
    })
    .input(z.void())
    .output(zViewer)
    .query(({ctx}) => ctx.viewer),
  getPublicEnv: publicProcedure.query(({ctx}) =>
    R.pick(ctx.env, ['NEXT_PUBLIC_NANGO_PUBLIC_KEY']),
  ),
  getRawSchemas: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/debug/raw-schemas',
        tags: ['Internal'],
        description: 'Get raw schemas',
      },
    })
    .input(z.void())
    .output(z.unknown())
    .query(() => R.mapValues(zRaw, (zodSchema) => zodToOas31Schema(zodSchema))),
})
