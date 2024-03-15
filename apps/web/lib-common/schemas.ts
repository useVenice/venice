import type {clerkClient} from '@clerk/nextjs'
import {
  kApikeyMetadata,
  kWebhookUrlMetadata,
} from '@usevenice/app-config/constants'
import {zId} from '@usevenice/cdk'
import type {RouterOutput} from '@usevenice/engine-backend'
import {z, zRecord} from '@usevenice/util'

export type ClerkOrg = Awaited<
  ReturnType<(typeof clerkClient)['organizations']['getOrganization']>
>

export type ClerkUser = Awaited<
  ReturnType<(typeof clerkClient)['users']['getUser']>
>

export function zOrgMetadata() {
  return z.object({})
}

export const zAuth = {
  organization: z.object({
    id: zId('org'),
    slug: z.string(),
    publicMetadata: zOrgMetadata(),
    privateMetadata: z.object({
      [kApikeyMetadata]: z.string().optional(),
      [kWebhookUrlMetadata]: z.string().optional(),
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
type ConnectorConfig = RouterOutput['adminListConnectorConfigs'][number]
type ConnectorMeta = RouterOutput['listConnectorMetas'][string]

export const zClient = {
  pipeline: zRecord<Pipeline>().refine(
    (p) => zId('pipe').safeParse(p.id).success,
    {message: 'Invalid pipeline'},
  ),
  resource: zRecord<Resource>().refine(
    (r) => zId('reso').safeParse(r.id).success,
    {message: 'Invalid resource'},
  ),
  connector_config: zRecord<ConnectorConfig>().refine(
    (i) => zId('ccfg').safeParse(i.id).success,
    {message: 'Invalid connector config'},
  ),
  connector: zRecord<ConnectorMeta>().refine(
    (p) => p.__typename === 'connector',
    {message: 'Invalid connector meta'},
  ),
}
export type ZClient = {
  [k in keyof typeof zClient]: z.infer<(typeof zClient)[k]>
}
