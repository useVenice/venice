import type {clerkClient} from '@clerk/nextjs'

import {kApikeyMetadata} from '@usevenice/app-config/constants'
import {zId} from '@usevenice/cdk'
import type {RouterOutput} from '@usevenice/engine-backend'
import {z, zRecord} from '@usevenice/util'

export type ClerkOrg = Awaited<
  ReturnType<(typeof clerkClient)['organizations']['getOrganization']>
>

export type ClerkUser = Awaited<
  ReturnType<(typeof clerkClient)['users']['getUser']>
>

export function zOrgMetadata<
  TSrcReso extends z.ZodTypeAny,
  TSrcInt extends z.ZodTypeAny,
  TDestReso extends z.ZodTypeAny,
  TDestInt extends z.ZodTypeAny,
>({
  srcResoId,
  destResoId,
  destIntId,
  srcIntId,
}: {
  srcResoId: TSrcReso
  destResoId: TDestReso
  srcIntId: TSrcInt
  destIntId: TDestInt
}) {
  return z.object({
    automations: z.object({
      defaultSource: z
        .object({
          sourceResourceId: srcResoId.optional(),
          destinationIntegrationIds: z.array(destIntId),
        })
        .optional()
        .describe(
          'Automatically create pipeline from source resource when resources are created in destination integrations',
        ),
      // How to enable these fields conditionally in the form? https://share.cleanshot.com/H1GQQCby
      defaultDestination: z
        .object({
          destinationResourceId: destResoId.optional(),
          sourceIntegrationids: z.array(srcIntId),
        })
        .optional()
        .describe(
          'Automatically create pipeline to destination resource when resources are created in source integrations',
        ),
    }),
  })
}

export const zAuth = {
  organization: z.object({
    id: zId('org'),
    slug: z.string(),
    publicMetadata: zOrgMetadata({
      srcResoId: zId('reso'),
      destResoId: zId('reso'),
      srcIntId: zId('int'),
      destIntId: zId('int'),
    }),
    privateMetadata: z.object({
      [kApikeyMetadata]: z.string().optional(),
    }),
  }),

  user: z.object({
    id: zId('user'),
    publicMetadata: z.object({}),
    privateMetadata: z.object({}),
    unsafeMetadata: z.object({}),
  }),
}

export type ZAuth = {
  [k in keyof typeof zAuth]: z.infer<(typeof zAuth)[k]>
}

type Pipeline = RouterOutput['listPipelines'][number]
type Resource = RouterOutput['listConnections'][number]
type Integration = RouterOutput['adminListIntegrations'][number]
type Provider = RouterOutput['getIntegrationCatalog'][string]

export const zClient = {
  pipeline: zRecord<Pipeline>().refine(
    (p) => zId('pipe').safeParse(p.id).success,
    {message: 'Invalid pipeline'},
  ),
  resource: zRecord<Resource>().refine(
    (r) => zId('reso').safeParse(r.id).success,
    {message: 'Invalid resource'},
  ),
  integration: zRecord<Integration>().refine(
    (i) => zId('int').safeParse(i.id).success,
    {message: 'Invalid integration'},
  ),
  provider: zRecord<Provider>().refine((p) => p.__typename === 'provider', {
    message: 'Invalid pipeline',
  }),
}
export type ZClient = {
  [k in keyof typeof zClient]: z.infer<(typeof zClient)[k]>
}
