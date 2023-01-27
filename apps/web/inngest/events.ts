import type {Id} from '@usevenice/cdk-core'
import {Inngest} from 'inngest'

type ToEvents<T extends Record<string, unknown>> = {
  [k in keyof T]: {name: k; data: T[k]} // satisfies EventPayload
}

export type Events = ToEvents<{
  'pipeline/sync-requested': {pipelineId: Id['pipe']; forReal?: boolean}
}>

export const inngest = new Inngest<Events>({name: 'Venice'})
