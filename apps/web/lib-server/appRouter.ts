import {clerkClient} from '@clerk/nextjs'
import {generateOpenApiDocument} from '@lilyrose2798/trpc-openapi'
import type {
  ZodOpenApiComponentsObject,
  ZodOpenApiPathsObject,
} from '@lilyrose2798/trpc-openapi/dist/generator'
import {TRPCError} from '@trpc/server'
import {getServerUrl} from '@usevenice/app-config/constants'
import type {Viewer} from '@usevenice/cdk'
import {zViewer} from '@usevenice/cdk'
import {eventMapForInngest, flatRouter} from '@usevenice/engine-backend'
import {
  adminProcedure,
  publicProcedure,
  trpc,
} from '@usevenice/engine-backend/router/_base'
import {R, z} from '@usevenice/util'
import {zAuth} from '@/lib-common/schemas'

const customRouter = trpc.router({
  getViewer: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/viewer',
        summary: 'Get current viewer accessing the API',
      },
    })
    .input(z.void())
    .output(zViewer)
    .query(async ({ctx}) => {
      const extra =
        ctx.viewer.role === 'org'
          ? await clerkClient.organizations.getOrganization({
              organizationId: ctx.viewer.orgId,
            })
          : ctx.viewer.role === 'user'
            ? await clerkClient.users.getUser(ctx.viewer.userId)
            : undefined

      return {...ctx.viewer, extra} as Viewer
    }),
  updateOrganization: adminProcedure
    .input(zAuth.organization.pick({id: true, publicMetadata: true}))
    .mutation(async ({ctx, input: {id, ...update}}) => {
      if (ctx.viewer.role !== 'system' && ctx.viewer.orgId !== id) {
        throw new TRPCError({code: 'UNAUTHORIZED'})
      }
      const org = await clerkClient.organizations.updateOrganization(id, update)
      return org
    }),

  getOpenapiDocument: publicProcedure
    .meta({openapi: {method: 'GET', path: '/openapi.json'}})
    .input(z.void())
    .output(z.unknown())
    .query((): unknown => generateOpenApi()),
})

export const appRouter = trpc.mergeRouters(flatRouter, customRouter)

export function oasWebhooksEventsMap(
  eMap: Record<string, {data: z.AnyZodObject}>,
) {
  const webhooks = R.mapValues(
    eMap,
    (_, name): ZodOpenApiPathsObject[string] => ({
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {$ref: `#/components/schemas/webhooks.${name}`},
            },
          },
        },
        responses: {},
      },
    }),
  )
  type Schemas = NonNullable<ZodOpenApiComponentsObject['schemas']>
  const components = {
    schemas: R.mapKeys(
      R.mapValues(eMap, (shape, name): Schemas[string] =>
        z.object({...shape, name: z.literal(name), id: z.string().optional()}),
      ),
      (name) => `webhooks.${name}`,
    ),
  }
  return {webhooks, components}
}

function generateOpenApi() {
  // const {webhooks, components} = oasWebhooksEventsMap(eventMapForInngest)
  const oas = generateOpenApiDocument(appRouter, {
    openApiVersion: '3.1.0', // Want jsonschema
    title: 'Venice OpenAPI',
    version: '0.0.0',
    securitySchemes: {
      apikey: {
        type: 'apiKey',
        name: 'x-apikey',
        in: 'header',
      },
    },
    baseUrl: getServerUrl(null) + '/api/v0',
    // webhooks,
    // components,
  })
  // Unfortunately trpc-openapi is missing bunch of options...
  oas.security = [{apikey: []}]
  return oas
}

export type AppRouter = typeof appRouter

if (require.main === module) {
  console.log(JSON.stringify(generateOpenApi(), null, 2))
}
