import {TRPCError} from '@trpc/server'

import {handlersLink, sync, zEndUserId, zId, zRaw} from '@usevenice/cdk-core'
import {rxjs, z} from '@usevenice/util'

import {adminProcedure, trpc} from './_base'

export {type inferProcedureInput} from '@trpc/server'

export const adminRouter = trpc.router({
  // TODO: How do we not just return empty result, but also return proper error code (401
  // should end use actually hit these APIs?
  adminListWorkspaces: adminProcedure
    .input(z.object({}).nullish())
    .query(({ctx}) => ctx.helpers.list('workspace', {})),
  // This is particularly tricky because we need to create two objects at the same time
  // in a single transaction... and that's not something we can do easily with the metaService today
  // would require introducing a 'transaction' abstraction
  adminCreateWorkspace: adminProcedure
    .input(zRaw.workspace.omit({id: true}))
    .mutation(async ({input, ctx}) => {
      if (ctx.viewer.role !== 'user') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'user role is required',
        })
      }
      return ctx.helpers.metaService.createWorkspace({
        workspace: input,
        userId: ctx.viewer.userId,
      })
    }),

  // Wonder if we should auto generate these procedures...
  // Also might be nice to fix the type to distinguish between create and update
  // In particular for "create" we might not want client to specify ID while making all
  // other properties as required
  adminUpdateWorkspace: adminProcedure
    .input(zRaw.workspace.partial().required({id: true}))
    .mutation(({input: {id, ...input}, ctx}) =>
      ctx.helpers.patchReturning('workspace', id, input),
    ),
  // TODO: Implement adding / removing users from workspace too... kind of annoying...
  // Should  we use a 3rd party service for managing these maybe?
  // Or maybe supabase itself has something representing organization already?

  // TODO: Right now this means client has to be responsible for creating
  // integration IDs, we should support creating integration with providerName instead
  adminUpsertIntegration: adminProcedure
    .input(zRaw.integration.partial().required({id: true}))
    .query(({input: {id, ...input}, ctx}) =>
      ctx.helpers.patchReturning('integration', id, input),
    ),
  adminCreateConnectToken: adminProcedure
    .input(z.object({endUserId: zEndUserId, workspaceId: zId('ws')}))
    .mutation(async ({input: {endUserId, workspaceId}, ctx}) => {
      // Will return 404, @see https://stackoverflow.com/questions/28582830/access-denied-403-or-404
      // Technically we do not need the result though. It's a bit annoying to have this
      // intermediate abstraction introduced by metaService rather than being able to just use postgres directly
      await ctx.helpers.getWorkspaceOrFail(workspaceId)
      // TOOD: Consider using jwt for that specific workspace
      return ctx.jwt.signViewer({role: 'end_user', endUserId, workspaceId})
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
