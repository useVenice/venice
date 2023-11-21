import {TRPCError} from '@trpc/server'

import {metaForConnector} from '@usevenice/cdk'
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
  listConnectorMetas: publicProcedure
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
      R.mapValues(ctx.connectorMap, (connector) =>
        metaForConnector(connector, input),
      ),
    ),
  getConnectorMeta: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/connectors/{name}',
        tags: ['connectors'],
      },
    })
    .input(z.object({includeOas: z.boolean().optional(), name: z.string()}))
    // TODO: Add deterministic type for the output here
    .output(z.unknown())
    .query(({ctx, input: {name, ...input}}) => {
      const connector = ctx.connectorMap[name]
      if (!connector) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Connector ${name} not found`,
        })
      }
      return metaForConnector(connector, input)
    }),
  getConnectorOpenApiSpec: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/connectors/{name}/oas',
        tags: ['connectors'],
      },
    })
    .input(z.object({name: z.string(), original: z.boolean().optional()}))
    // TODO: Add deterministic type for the output here
    .output(z.unknown())
    .query(({ctx, input: {name, ...input}}) => {
      const connector = ctx.connectorMap[name]
      if (!connector) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Connector ${name} not found`,
        })
      }
      const specs = metaForConnector(connector, {includeOas: true}).openapiSpec
      return input.original ? specs?.original : specs?.proxied
    }),
  getPublicEnv: publicProcedure.query(({ctx}) =>
    R.pick(ctx.env, ['NEXT_PUBLIC_NANGO_PUBLIC_KEY']),
  ),
})
