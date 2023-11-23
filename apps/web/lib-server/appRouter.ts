import {clerkClient} from '@clerk/nextjs'
import {TRPCError} from '@trpc/server'
import {getServerUrl} from '@usevenice/app-config/constants'
import {flatRouter} from '@usevenice/engine-backend'
import {
  adminProcedure,
  publicProcedure,
  trpc,
} from '@usevenice/engine-backend/router/_base'
import {generateOpenApiDocument} from '@usevenice/trpc-openapi'
import {z} from '@usevenice/util'
import {zAuth} from '@/lib-common/schemas'

const customRouter = trpc.router({
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

function generateOpenApi() {
  return generateOpenApiDocument(appRouter, {
    // openApiVersion: '3.1.0',
    title: 'Venice OpenAPI',
    version: '0.0.0',
    baseUrl: getServerUrl(null) + '/api/v0',
  })
}

export type AppRouter = typeof appRouter

if (require.main === module) {
  console.log(JSON.stringify(generateOpenApi(), null, 2))
}
