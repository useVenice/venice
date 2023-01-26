import type {Id} from '@usevenice/cdk-core'
import {Inngest} from 'inngest'

type ToEvents<T extends Record<string, unknown>> = {
  [k in keyof T]: {name: k; data: T[k]} // satisfies EventPayload
}

export type Events = ToEvents<{
  'sync/requested': {pipelineId: Id['pipe']}
  'test/demo': {mydata: string}
}>

export const inngest = new Inngest<Events>({name: 'Venice'})
