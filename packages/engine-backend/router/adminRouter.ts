import {adminProcedure, trpc} from './_base'

import {handlersLink, makeId, sync, zEndUserId, zId} from '@usevenice/cdk-core'
import {makeUlid, rxjs, z} from '@usevenice/util'

export {type inferProcedureInput} from '@trpc/server'

export const adminRouter = trpc.router({
  // TODO: How do we not just return empty result, but also return proper error code (401
  // should end use actually hit these APIs?
  adminListWorkspaces: adminProcedure
    .input(z.object({}).nullish())
    .query(({ctx}) => ctx.helpers.metaService.tables.workspace.list({})),
  adminCreateWorkspace: adminProcedure
    .input(z.object({name: z.string(), slug: z.string()}))
    .mutation(({input, ctx}) =>
      ctx.helpers.metaService.tables.workspace.set(
        makeId('ws', makeUlid()),
        input,
      ),
    ),
  adminUpsertIntegration: adminProcedure
    .input(
      z.object({id: zId('int'), workspaceId: zId('ws'), config: z.unknown()}),
    )
    .query(({input, ctx}) => {
      const provider = ctx.helpers.getProviderOrFail(input.id)
      const config = provider.def.integrationConfig?.parse(input.config)
      return ctx.helpers.metaService.tables.integration.set(input.id, {
        workspaceId: input.workspaceId,
        config,
      })
    }),
  adminCreateConnectToken: adminProcedure
    .input(z.object({endUserId: zEndUserId, workspaceId: zId('ws')}))
    .mutation(({input: {endUserId, workspaceId}, ctx}) =>
      ctx.jwt.signViewer({role: 'end_user', endUserId, workspaceId}),
    ),
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
