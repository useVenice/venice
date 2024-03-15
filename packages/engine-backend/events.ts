import {EventSchemas, Inngest} from 'inngest'
import {zId} from '@usevenice/cdk'
import type {NonEmptyArray} from '@usevenice/util'
import {R, z} from '@usevenice/util'

// TODO: Implement webhook as events too

export const zUserTraits = z
  .object({
    /** Also sets the display name in posthog ui */
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  })
  .partial()

// TODO: Can we learn from trpc to make all the events here easy to refactor across the codebase?
const eventMap = {
  // Backend events
  'debug/debug': {},
  'sync/scheduler-debug': {},
  'sync/pipeline-requested': {pipelineId: zId('pipe')},
  'sync/resource-requested': {resourceId: zId('reso')},
  'connect/resource-connected': {resourceId: zId('reso')},
  'webhook/received': {
    /** For debugging requests */
    traceId: z.string(),
    method: z.string(),
    path: z.string(),
    query: z.record(z.unknown()),
    headers: z.record(z.unknown()),
    body: z.unknown(),
  },
  // Analytics events
  'db/user-created': {},
  'db/user-deleted': {},
  'db/resource-created': {resourceId: zId('reso')},
  'db/resource-deleted': {resourceId: zId('reso')},
  'user/signin': {},
  'user/signout': {},
  'connect/session-started': {connectorName: z.string(), meta: z.unknown()},
  'connect/session-cancelled': {connectorName: z.string(), meta: z.unknown()},
  'connect/session-succeeded': {connectorName: z.string(), meta: z.unknown()},
  'connect/session-errored': {connectorName: z.string(), meta: z.unknown()},
  'api/token-copied': {},
  'api/graphql-request': {},
  'api/rest-request': {},
} satisfies Record<string, z.ZodRawShape>

export const zEvent = z.discriminatedUnion(
  'name',
  Object.entries(eventMap).map(([name, props]) =>
    z.object({name: z.literal(name), data: z.object(props)}),
  ) as unknown as NonEmptyArray<
    {
      [k in keyof typeof eventMap]: z.ZodObject<{
        name: z.ZodLiteral<k>
        data: z.ZodObject<(typeof eventMap)[k]>
      }>
    }[keyof typeof eventMap]
  >,
)

export type Event = z.infer<typeof zEvent>

const eventMapForInngest = R.mapValues(eventMap, (v) => ({
  data: z.object(v),
})) as unknown as {
  [k in keyof typeof eventMap]: {
    data: z.ZodObject<(typeof eventMap)[k]>
  }
}

export const inngest = new Inngest({
  id: 'Venice',
  schemas: new EventSchemas().fromZod(eventMapForInngest),
  // TODO: have a dedicated browser inngest key
  eventKey: process.env['INNGEST_EVENT_KEY'] ?? 'local',
  // This is needed in the browser otherwise we get failed to execute fetch on Window
  // due to the way Inngest uses this.fetch when invoking fetch
  fetch: globalThis.fetch.bind(globalThis),
})
