import type {clerkClient} from '@clerk/nextjs'

import {z} from '@usevenice/util'

import {zId} from '@/../../packages/cdk-core'
import {kApikeyMetadata} from '@/../app-config/constants'

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
