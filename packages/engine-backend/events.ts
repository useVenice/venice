import type {Id} from '@usevenice/cdk-core'
import {Inngest} from 'inngest'

// TODO: Unify this with all analytics events as well
// TODO: Implement webhook as events too

type ToEvents<T extends Record<string, unknown>> = {
  [k in keyof T]: {name: k; data: T[k]} // satisfies EventPayload
}

export type Events = ToEvents<{
  'pipeline/sync-requested': {pipelineId: Id['pipe']}
  'resource/sync-requested': {resourceId: Id['reso']}
  'webhook/received': {body: unknown; headers: Record<string, string>}
}>

export const inngest = new Inngest<Events>({
  name: 'Venice',
  // TODO: have a dedicated browser inngest key
  eventKey: process.env['INNGEST_EVENT_KEY'] ?? 'local',
  // This is needed in the browser otherwise we get failed to execute fetch on Window
  // due to the way Inngest uses this.fetch when invoking fetch
  fetch: globalThis.fetch.bind(globalThis),
})
