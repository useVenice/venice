import {TRPCError} from '@trpc/server'

import {
  extractConnectorName,
  handlersLink,
  makeId,
  makeOauthConnectorServer,
  oauthBaseSchema,
  sync,
  zId,
  zRaw,
} from '@usevenice/cdk'
import {makeUlid, rxjs, z} from '@usevenice/util'

import {adminProcedure, trpc} from './_base'

export {type inferProcedureInput} from '@trpc/server'

export const adminRouter = trpc.router({
  adminListConnectorConfigs: adminProcedure
    .meta({openapi: {method: 'GET', path: '/connector_configs'}})
    .input(z.void())
    .output(z.array(zRaw.connector_config))
    .query(async ({ctx}) => ctx.services.list('connector_config', {})),
  adminUpsertPipeline: adminProcedure
    .input(
      zRaw.pipeline
        .pick({
          id: true,
          sourceId: true,
          destinationId: true,
          sourceState: true,
          destinationState: true,
        })
        .partial()
        // Due to insert on conflict update we need provide all values
        .required({sourceId: true, destinationId: true}),
    )
    .mutation(({input: {id: _id, ...input}, ctx}) => {
      const id = _id ? _id : makeId('pipe', makeUlid())
      return ctx.services.patchReturning('pipeline', id, input)
    }),
  // TODO: Right now this means client has to be responsible for creating
  // connector config IDs, we should support creating connector config with connectorName instead
  adminUpsertConnectorConfig: adminProcedure
    .meta({openapi: {method: 'POST', path: '/connector_configs'}})
    .input(
      zRaw.connector_config
        .pick({
          id: true,
          connectorName: true,
          orgId: true,
          config: true,
          displayName: true,
          endUserAccess: true,
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

      return ctx.services.patchReturning('connector_config', id, input)
    }),
  // Need a tuple for some reason... otherwise seems to not work in practice.
  adminDeleteConnectorConfig: adminProcedure
    .meta({openapi: {method: 'DELETE', path: '/connector_configs/{id}'}})
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

  adminSearchEndUsers: adminProcedure
    .input(z.object({keywords: z.string().trim().nullish()}).optional())
    .query(async ({input: {keywords} = {}, ctx}) =>
      ctx.services.metaService
        .searchEndUsers({keywords})
        // EndUsers must have non empty IDs
        // This fitlers out data that belongs to the org rather than specific end users
        .then((rows) => rows.filter((u) => !!u.id)),
    ),
  adminGetConnectorConfig: adminProcedure
    .meta({openapi: {method: 'GET', path: '/connector_configs/{id}'}})
    .input(z.object({id: zId('ccfg')}))
    .output(zRaw.connector_config)
    .query(async ({input: {id: ccfgId}, ctx}) => {
      const {connector: _, ...int} =
        await ctx.services.getConnectorConfigOrFail(ccfgId)
      return int
    }),
  adminSyncMetadata: adminProcedure
    .input(zId('ccfg').nullish())
    .mutation(async ({input: ccfgId, ctx}) => {
      const ints = ccfgId
        ? await ctx.services
            .getConnectorConfigOrFail(ccfgId)
            .then((int) => [int])
        : await ctx.services.listConnectorConfigs()
      const stats = await sync({
        source: rxjs.merge(
          ...ints.map(
            (int) =>
              int.connector.metaSync?.({config: int.config}).pipe(
                handlersLink({
                  data: (op) =>
                    rxjs.of({
                      ...op,
                      data: {
                        ...op.data,
                        entity: {
                          external: op.data.entity as unknown,
                          standard:
                            int.connector.standardMappers?.institution?.(
                              op.data.entity,
                            ),
                        },
                      },
                    }),
                }),
              ) ?? rxjs.EMPTY,
          ),
        ),
        // This single destination is a bottleneck to us removing
        // prefixed ids from protocol itself
        destination: ctx.services.metaLinks.persistInstitution(),
      })
      return `Synced ${stats} institutions from ${ints.length} providers`
    }),

  // Manually run to repair mapping issues
  remapEntities: adminProcedure
    // .input(z.object({}).nullish())
    .mutation(async ({ctx}) => {
      if (ctx.viewer.role !== 'system') {
        return
      }
      // TODO: support pagination
      const inss = await ctx.services.metaService.tables.institution.list({})
      for (const ins of inss) {
        console.log('Remap institution', ins.id)
        const provider = ctx.connectorMap[ins.connectorName]
        const standard = provider?.standardMappers?.institution?.(ins.external)
        await ctx.services.patch('institution', ins.id, {standard})
      }
    }),
})
