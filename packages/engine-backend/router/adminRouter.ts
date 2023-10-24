import {TRPCError} from '@trpc/server'

import {
  extractProviderName,
  handlersLink,
  makeId,
  makeOauthIntegrationServer,
  oauthBaseSchema,
  sync,
  zEndUserId,
  zId,
  zRaw,
} from '@usevenice/cdk-core'
import {makeUlid, rxjs, z} from '@usevenice/util'

import {adminProcedure, trpc} from './_base'

export {type inferProcedureInput} from '@trpc/server'

export const zConnectTokenPayload = z.object({
  endUserId: zEndUserId.describe(
    'Anything that uniquely identifies the end user that you will be sending the magic link to',
  ),
  validityInSeconds: z
    .number()
    .default(3600)
    .describe(
      'How long the magic link will be valid for (in seconds) before it expires',
    ),
})

export const zConnectPageParams = z.object({
  token: z.string(),
  displayName: z.string().nullish().describe('What to call user by'),
  redirectUrl: z
    .string()
    .nullish()
    .describe(
      'Where to send user to after connect / if they press back button',
    ),
  /** Launch the integration right away */
  integrationId: zId('int').nullish(),
  /** Whether to show existing resources */
  showExisting: z.coerce.boolean().optional().default(true),
})

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
  adminCreateConnectToken: {input: zConnectTokenPayload},
  adminCreateMagicLink: {
    input: zConnectTokenPayload.merge(zConnectPageParams.omit({token: true})),
  },
} satisfies Record<string, {input?: z.ZodTypeAny; output?: z.ZodTypeAny}>

export const adminRouter = trpc.router({
  adminListIntegrations: adminProcedure
    .meta({openapi: {method: 'GET', path: '/integrations'}})
    .input(z.void())
    .output(z.array(zRaw.integration))
    .query(async ({ctx}) => ctx.helpers.list('integration', {})),
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
      return ctx.helpers.patchReturning('pipeline', id, input)
    }),
  // TODO: Right now this means client has to be responsible for creating
  // integration IDs, we should support creating integration with providerName instead
  adminUpsertIntegration: adminProcedure
    .meta({openapi: {method: 'POST', path: '/integrations'}})
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
    .output(zRaw.integration)
    .mutation(async ({input: {id: _id, providerName, ...input}, ctx}) => {
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
      const provider = ctx.providerMap[extractProviderName(id)]

      if (!provider) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Missing provider for ${extractProviderName(id)}`,
        })
      }
      if (provider.metadata?.nangoProvider) {
        await makeOauthIntegrationServer({
          intId: id,
          nangoClient: ctx.nango,
          nangoProvider: provider.metadata.nangoProvider,
        }).upsertIntegration(
          oauthBaseSchema.integrationConfig.parse(input.config),
        )
      }

      return ctx.helpers.patchReturning('integration', id, input)
    }),
  // Need a tuple for some reason... otherwise seems to not work in practice.
  adminDeleteIntegration: adminProcedure
    .meta({openapi: {method: 'DELETE', path: '/integrations/{id}'}})
    .input(z.object({id: zId('int')}))
    .output(z.void())
    .mutation(async ({input: {id: intId}, ctx}) => {
      const provider = ctx.providerMap[extractProviderName(intId)]
      if (provider?.metadata?.nangoProvider) {
        await ctx.nango.delete('/config/{provider_config_key}', {
          path: {provider_config_key: intId},
        })
      }
      return ctx.helpers.metaService.tables.integration.delete(intId)
    }),
  adminCreateConnectToken: adminProcedure
    .meta({openapi: {method: 'POST', path: '/connect-token'}})
    .input(adminRouterSchema.adminCreateConnectToken.input)
    .output(z.string())
    .mutation(({input: {endUserId, validityInSeconds}, ctx}) => {
      // Figure out a better way to share code here...
      if (!('orgId' in ctx.viewer) || !ctx.viewer.orgId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current viewer missing orgId to create token',
        })
      }
      return ctx.jwt.signViewer(
        {role: 'end_user', endUserId, orgId: ctx.viewer.orgId},
        {validityInSeconds},
      )
    }),
  adminCreateMagicLink: adminProcedure
    .meta({openapi: {method: 'POST', path: '/magic-link'}})
    .input(adminRouterSchema.adminCreateMagicLink.input)
    .output(z.object({url: z.string()}))
    .mutation(({input: {endUserId, validityInSeconds, ...params}, ctx}) => {
      if (!('orgId' in ctx.viewer) || !ctx.viewer.orgId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Current viewer missing orgId to create token',
        })
      }
      const token = ctx.jwt.signViewer(
        {role: 'end_user', endUserId, orgId: ctx.viewer.orgId},
        {validityInSeconds},
      )
      const url = new URL('/connect', ctx.apiUrl) // `/` will start from the root hostname itself
      for (const [key, value] of Object.entries({...params, token})) {
        url.searchParams.set(key, `${value ?? ''}`)
      }
      return {url: url.toString()}
    }),
  adminSearchEndUsers: adminProcedure
    .input(z.object({keywords: z.string().trim().nullish()}).optional())
    .query(async ({input: {keywords} = {}, ctx}) =>
      ctx.helpers.metaService
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
      const {provider: _, ...int} = await ctx.helpers.getIntegrationOrFail(
        intId,
      )
      return int
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

  // Manually run to repair mapping issues
  remapEntities: adminProcedure
    // .input(z.object({}).nullish())
    .mutation(async ({ctx}) => {
      if (ctx.viewer.role !== 'system') {
        return
      }
      // TODO: support pagination
      const inss = await ctx.helpers.metaService.tables.institution.list({})
      for (const ins of inss) {
        console.log('Remap institution', ins.id)
        const provider = ctx.providerMap[ins.providerName]
        const standard = provider?.standardMappers?.institution?.(ins.external)
        await ctx.helpers.patch('institution', ins.id, {standard})
      }
    }),
})
