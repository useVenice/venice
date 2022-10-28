import type {JobHelpers, Task} from 'graphile-worker'

import {veniceRouter} from '@usevenice/app-config/backendConfig'
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
  async ({pipelineId}) => {
    console.log('Shall sync pipeline id', pipelineId)
    // TODO: need to figure out how to deal with missing ledgerId when running
    // in service-worker mode without ledgerId (e.g. background sync)
    await veniceRouter
      .createCaller({isAdmin: true, ledgerId: 'ldgr_TASK_NOOP'})
      .mutation('syncPipeline', [{id: pipelineId}, {}])
  },
)

export const scheduleTasks: Task = async (_, helpers) => {
  console.log('Scheduling...')
  for (let i = 0; i < 5; i++) {
    await helpers.addJob('echo', {i})
  }
  console.log('Scheduled')
}

/** Task for debugging purposes... */
export const echo: Task = (payload) => {
  console.log('[echo] Task payload =', payload)
}
