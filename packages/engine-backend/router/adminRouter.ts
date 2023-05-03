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

/**
 * Workaround to be able to re-use the schema on the frontend for now
 * @see https://github.com/trpc/trpc/issues/4295
 *
 * Though if we can FULLY automate the generate of forms perhaps this wouldn't actually be necessary?
 * We will have to make sure though that the router themselves do not have any side effect imports
 * and all server-specific logic would be part of context.
 * But then again client side bundle size would still be a concern
 * as we'd be sending server side code unnecessarily to client still
 * unless of course we transform zod -> jsonschema and send that to the client only
 * via a trpc schema endpoint (with server side rendering of course)
 */
export const adminRouterSchema = {
  adminCreateConnectToken: {
    input: z.object({
      orgId: zId('org'),
      endUserId: zEndUserId.describe(
        'Anything that uniquely identifies the end user that you will be sending the magic link to',
      ),
      displayName: z.string().nullish().describe('What to call user by'),
      redirectUrl: z
        .string()
        .nullish()
        .describe(
          'Where to send user to after connect / if they press back button',
        ),
      validityInSeconds: z
        .number()
        .default(3600)
        .describe(
          'How long the magic link will be valid for (in seconds) before it expires',
        ),
    }),
  },
} satisfies Record<string, {input?: z.ZodTypeAny; output?: z.ZodTypeAny}>

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
    .input(adminRouterSchema.adminCreateConnectToken.input)
    .mutation(({input: {endUserId, orgId, validityInSeconds}, ctx}) => {
      if (
        (ctx.viewer.role === 'user' || ctx.viewer.role === 'org') &&
        ctx.viewer.orgId !== orgId
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `${orgId} Not your org`,
        })
      }
      return ctx.jwt.signViewer(
        {role: 'end_user', endUserId, orgId},
        {validityInSeconds},
      )
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
