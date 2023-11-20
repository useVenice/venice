import {TRPCError} from '@trpc/server'

import {
  extractConnectorName,
  handlersLink,
  makeId,
  makeOauthIntegrationServer,
  oauthBaseSchema,
  sync,
  zId,
  zRaw,
} from '@usevenice/cdk'
import {makeUlid, rxjs, z} from '@usevenice/util'

import {adminProcedure, trpc} from './_base'

export {type inferProcedureInput} from '@trpc/server'

export const adminRouter = trpc.router({
  adminListIntegrations: adminProcedure
    .meta({openapi: {method: 'GET', path: '/integrations'}})
    .input(z.void())
    .output(z.array(zRaw.integration))
    .query(async ({ctx}) => ctx.services.list('integration', {})),
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
  // integration IDs, we should support creating integration with connectorName instead
  adminUpsertIntegration: adminProcedure
    .meta({openapi: {method: 'POST', path: '/integrations'}})
    .input(
      zRaw.integration
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
    .output(zRaw.integration)
    .mutation(async ({input: {id: _id, connectorName, ...input}, ctx}) => {
      const id = _id
        ? _id
        : connectorName && input.orgId
        ? makeId('int', connectorName, makeUlid())
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
        await makeOauthIntegrationServer({
          intId: id,
          nangoClient: ctx.nango,
          nangoProvider: connector.metadata.nangoProvider,
        }).upsertIntegration(
          oauthBaseSchema.integrationConfig.parse(input.config),
        )
      }

      return ctx.services.patchReturning('integration', id, input)
    }),
  // Need a tuple for some reason... otherwise seems to not work in practice.
  adminDeleteIntegration: adminProcedure
    .meta({openapi: {method: 'DELETE', path: '/integrations/{id}'}})
    .input(z.object({id: zId('int')}))
    .output(z.void())
    .mutation(async ({input: {id: intId}, ctx}) => {
      const provider = ctx.connectorMap[extractConnectorName(intId)]
      if (provider?.metadata?.nangoProvider) {
        await ctx.nango.delete('/config/{provider_config_key}', {
          path: {provider_config_key: intId},
        })
      }
      return ctx.services.metaService.tables.integration.delete(intId)
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
  adminGetIntegration: adminProcedure
    .meta({openapi: {method: 'GET', path: '/integrations/{id}'}})
    .input(z.object({id: zId('int')}))
    .output(zRaw.integration)
    .query(async ({input: {id: intId}, ctx}) => {
      const {connector: _, ...int} = await ctx.services.getIntegrationOrFail(
        intId,
      )
      return int
    }),
  adminSyncMetadata: adminProcedure
    .input(zId('int').nullish())
    .mutation(async ({input: intId, ctx}) => {
      const ints = intId
        ? await ctx.services.getIntegrationOrFail(intId).then((int) => [int])
        : await ctx.services.listIntegrations()
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
