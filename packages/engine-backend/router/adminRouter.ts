import {TRPCError} from '@trpc/server'

import {handlersLink, sync, zEndUserId, zId, zRaw} from '@usevenice/cdk-core'
import {rxjs, z} from '@usevenice/util'

import {adminProcedure, trpc} from './_base'

export {type inferProcedureInput} from '@trpc/server'

export const adminRouter = trpc.router({
  adminListIntegrations: adminProcedure.query(async ({ctx}) =>
    ctx.helpers.list('integration', {}),
  ),
  // TODO: Right now this means client has to be responsible for creating
  // integration IDs, we should support creating integration with providerName instead
  adminUpsertIntegration: adminProcedure
    .input(zRaw.integration.partial().required({id: true}))
    .query(({input: {id, ...input}, ctx}) =>
      ctx.helpers.patchReturning('integration', id, input),
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
