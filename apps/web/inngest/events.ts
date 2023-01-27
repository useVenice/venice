import type {Id} from '@usevenice/cdk-core'
import {Inngest} from 'inngest'

type ToEvents<T extends Record<string, unknown>> = {
  [k in keyof T]: {name: k; data: T[k]} // satisfies EventPayload
}

// TODO: Unify this with all analytics events as well...
export type Events = ToEvents<{
  'pipeline/sync-requested': {pipelineId: Id['pipe']; forReal?: boolean}
  // TODO: Implement webhook as queries
  'webhook/received': {body: unknown; headers: Record<string, string>}
}>

export const inngest = new Inngest<Events>({name: 'Venice'})
