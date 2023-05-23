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

export const zAuth = {
  organization: z.object({
    id: zId('org'),
    slug: z.string(),
    publicMetadata: z.object({
      defaultSourceId: zId('reso').optional(),
      defaultDestinationId: zId('reso').optional(),
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
