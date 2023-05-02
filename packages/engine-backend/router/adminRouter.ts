import {TRPCError} from '@trpc/server'

import {
  handlersLink,
  makeId,
  sync,
  zEndUserId,
  zId,
  zRaw,
} from '@usevenice/cdk-core'
import {makeUlid, rxjs, z} from '@usevenice/util'

import {adminProcedure, trpc} from './_base'

export {type inferProcedureInput} from '@trpc/server'

export const adminRouter = trpc.router({
  adminListIntegrations: adminProcedure.query(async ({ctx}) =>
    ctx.helpers.list('integration', {}),
  ),
  // TODO: Right now this means client has to be responsible for creating
  // integration IDs, we should support creating integration with providerName instead
  adminUpsertIntegration: adminProcedure
    .input(
      zRaw.integration
        .pick({
          id: true,
          providerName: true,
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
    .mutation(({input: {id: _id, providerName, ...input}, ctx}) => {
      const id = _id
        ? _id
        : providerName && input.orgId
        ? makeId('int', providerName, makeUlid())
        : null
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Missing id or providerName/orgId',
        })
      }
      return ctx.helpers.patchReturning('integration', id, input)
    }),
  // Need a tuple for some reason... otherwise seems to not work in practice.
  adminDeleteIntegration: adminProcedure
    .input(z.tuple([zId('int')]))
    .mutation(({input: [intId], ctx}) =>
      ctx.helpers.metaService.tables.integration.delete(intId),
    ),
  adminCreateConnectToken: adminProcedure
    .input(z.object({endUserId: zEndUserId, orgId: zId('org')}))
    .mutation(({input: {endUserId, orgId}, ctx}) => {
      if (
        (ctx.viewer.role === 'user' || ctx.viewer.role === 'org') &&
        ctx.viewer.orgId !== orgId
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `${orgId} Not your org`,
        })
      }
      return ctx.jwt.signViewer({role: 'end_user', endUserId, orgId})
    }),
  adminSearchEndUsers: adminProcedure
    .input(z.object({keywords: z.string().trim().nullish()}).optional())
    .query(async ({input: {keywords} = {}, ctx}) =>
      ctx.helpers.metaService.searchEndUsers({keywords}),
    ),
  adminGetIntegration: adminProcedure
    .input(zId('int'))
    .query(async ({input: intId, ctx}) => {
      const int = await ctx.helpers.getIntegrationOrFail(intId)
      return {
        config: int.config,
        provider: int.provider.name,
        id: int.id,
      }
    }),
  adminSyncMetadata: adminProcedure
    .input(zId('int').nullish())
    .mutation(async ({input: intId, ctx}) => {
      const ints = intId
        ? await ctx.helpers.getIntegrationOrFail(intId).then((int) => [int])
        : await ctx.helpers.listIntegrations()
      const stats = await sync({
        source: rxjs.merge(
          ...ints.map(
            (int) =>
              int.provider.metaSync?.({config: int.config}).pipe(
                handlersLink({
                  data: (op) =>
                    rxjs.of({
                      ...op,
                      data: {
                        ...op.data,
                        entity: {
                          external: op.data.entity as unknown,
                          standard: int.provider.standardMappers?.institution?.(
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
        destination: ctx.helpers.metaLinks.persistInstitution(),
      })
      return `Synced ${stats} institutions from ${ints.length} providers`
    }),
})
