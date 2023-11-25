import {TRPCError} from '@trpc/server'
import {
  extractConnectorName,
  extractId,
  makeId,
  makeOauthConnectorServer,
  oauthBaseSchema,
  zId,
  zRaw,
} from '@usevenice/cdk'
import {makeUlid, z} from '@usevenice/util'
import {adminProcedure, protectedProcedure, trpc} from './_base'

export {type inferProcedureInput} from '@trpc/server'

const tags = ['Connector Configs']

export const connectorConfigRouter = trpc.router({
  adminListConnectorConfigs: adminProcedure
    .meta({openapi: {method: 'GET', path: '/platform/connector_configs', tags}})
    .input(z.void())
    .output(z.array(zRaw.connector_config))
    .query(async ({ctx}) => ctx.services.list('connector_config', {})),
  // TODO: Right now this means client has to be responsible for creating
  // connector config IDs, we should support creating connector config with connectorName instead
  adminUpsertConnectorConfig: adminProcedure
    .meta({
      openapi: {method: 'POST', tags, path: '/platform/connector_configs'},
    })
    .input(
      zRaw.connector_config
        .pick({
          id: true,
          connectorName: true,
          orgId: true,
          config: true,
          displayName: true,
          endUserAccess: true,
          defaultPipeOut: true,
          defaultPipeIn: true,
        })
        .partial()
        // Due to insert on conflict update it appears that orgId is actually required
        // it will simply fail on the required field and never gets to on conflict update
        // this makes me wonder if UPSERT should always be the default....
        .required({orgId: true}),
    )
    .output(zRaw.connector_config)
    .mutation(async ({input: {id: _id, connectorName, ...input}, ctx}) => {
      const id = _id
        ? _id
        : connectorName && input.orgId
          ? makeId('ccfg', connectorName, makeUlid())
          : null
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Missing id or connectorName/orgId',
        })
      }
      const connector = ctx.connectorMap[extractConnectorName(id)]

      if (!connector) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Missing provider for ${extractConnectorName(id)}`,
        })
      }
      if (connector.metadata?.nangoProvider) {
        await makeOauthConnectorServer({
          ccfgId: id,
          nangoClient: ctx.nango,
          nangoProvider: connector.metadata.nangoProvider,
        }).upsertConnectorConfig(
          oauthBaseSchema.connectorConfig.parse(input.config),
        )
      }
      console.log('saving connector config', id, input)

      return ctx.services.patchReturning('connector_config', id, input)
    }),
  // Need a tuple for some reason... otherwise seems to not work in practice.
  adminDeleteConnectorConfig: adminProcedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/platform/connector_configs/{id}',
        tags,
      },
    })
    .input(z.object({id: zId('ccfg')}))
    .output(z.void())
    .mutation(async ({input: {id: ccfgId}, ctx}) => {
      const provider = ctx.connectorMap[extractConnectorName(ccfgId)]
      if (provider?.metadata?.nangoProvider) {
        await ctx.nango.delete('/config/{provider_config_key}', {
          path: {provider_config_key: ccfgId},
        })
      }
      return ctx.services.metaService.tables.connector_config.delete(ccfgId)
    }),

  adminGetConnectorConfig: adminProcedure
    .meta({
      openapi: {method: 'GET', path: '/platform/connector_configs/{id}', tags},
    })
    .input(z.object({id: zId('ccfg')}))
    .output(zRaw.connector_config)
    .query(async ({input: {id: ccfgId}, ctx}) => {
      const {connector: _, ...int} =
        await ctx.services.getConnectorConfigOrFail(ccfgId)
      return int
    }),

  listConnectorConfigInfos: protectedProcedure
    .meta({
      openapi: {method: 'GET', path: '/platform/connector_config_infos', tags},
    })
    .input(
      z.object({
        type: z.enum(['source', 'destination']).nullish(),
        id: zId('ccfg').nullish(),
        connectorName: z.string().nullish(),
      }),
    )
    .output(
      z.array(
        zRaw.connector_config
          .pick({
            id: true,
            envName: true,
            displayName: true,
            connectorName: true,
          })
          .extend({
            isSource: z.boolean(),
            isDestination: z.boolean(),
          }),
      ),
    )
    .query(async ({input: {type, id, connectorName}, ctx}) => {
      const intInfos = await ctx.services.metaService.listConnectorConfigInfos({
        id,
        connectorName,
      })

      return intInfos
        .map(({id, envName, displayName}) => {
          const connector = ctx.connectorMap[extractId(id)[1]]
          return connector
            ? {
                id,
                envName,
                displayName,
                connectorName: connector.name,
                isSource: !!connector.sourceSync,
                isDestination: !!connector.destinationSync,
              }
            : null
        })
        .filter((int): int is NonNullable<typeof int> =>
          Boolean(
            int &&
              (!type ||
                (type === 'source' && int.isSource) ||
                (type === 'destination' && int.isDestination)),
          ),
        )
    }),
})
