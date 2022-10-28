import type {JobHelpers, Task} from 'graphile-worker'

import {zId} from '@usevenice/cdk-core'
import type {MaybePromise} from '@usevenice/util'
import {z} from '@usevenice/util'

const makeTask = <T extends z.ZodTypeAny>(
  schema: T,
  fn: (payload: z.infer<T>, helpers: JobHelpers) => MaybePromise<void>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const taskFn: Task = (payload, helpers) => fn(schema.parse(payload), helpers)
  return taskFn
}

export const syncPipeline: Task = makeTask(
  z.object({pipelineId: zId('pipe')}),
  ({pipelineId}) => {
    console.log('Shall sync pipeline id', pipelineId)
  },
)

export const scheduleTasks: Task = () => {
  console.log('Scheduling...')
}
