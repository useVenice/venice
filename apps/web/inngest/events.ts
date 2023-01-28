import type {Id} from '@usevenice/cdk-core'
import {Inngest} from 'inngest'

// TODO: Unify this with all analytics events as well
// TODO: Implement webhook as events too

type ToEvents<T extends Record<string, unknown>> = {
  [k in keyof T]: {name: k; data: T[k]} // satisfies EventPayload
}

export type Events = ToEvents<{
  'pipeline/sync-requested': {pipelineId: Id['pipe']}
  'webhook/received': {body: unknown; headers: Record<string, string>}
}>

export const inngest = new Inngest<Events>({name: 'Venice'})
