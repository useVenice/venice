import type {JobHelpers, Task} from 'graphile-worker'

import {
  veniceBackendConfig,
  veniceRouter,
} from '@usevenice/app-config/backendConfig'
import {zId} from '@usevenice/cdk-core'
import type {MaybePromise} from '@usevenice/util'
import {mapAsync, rxjs, toCompletion, z} from '@usevenice/util'

const makeTask = <T extends z.ZodTypeAny>(
  schema: T,
  fn: (payload: z.infer<T>, helpers: JobHelpers) => MaybePromise<void>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const taskFn: Task = (payload, helpers) => fn(schema.parse(payload), helpers)
  return taskFn
}

export const scheduleTasks: Task = async (_, helpers) => {
  // We shall sync once per day. May not always be at same time each day
  console.log('Scheduling...')
  const pipelines = await veniceBackendConfig.metaService.findPipelines({
    secondsSinceLastSync: 24 * 60 * 60,
  })
  await toCompletion(
    rxjs.from(pipelines).pipe(
      mapAsync(
        (pipe) =>
          // TODO: it would be nice if addJob function could be typesafe
          // And thus support refactoring relative to the
          // current list of jobs in the codebase...
          helpers.addJob(
            'syncPipeline',
            {pipelineId: pipe.id},
            {
              jobKey: `syncPipeline-${pipe.id}`,
              maxAttempts: 3,
              // Perhaps `replace` jobKeyMode is a better fit, but we need to workaround
              // dupe job issue in graphile_worker @see https://github.com/graphile/worker/issues/303
              // TODO: Confirm stuck / stale jobs either get cleared or otherwise do not
              // permanently prevent new jobs with same key from executing.
              jobKeyMode: 'unsafe_dedupe',
            }, // At most one at a time... And 3 tries that's it.
          ),
        25, // Limit how many jobs we add at a time
      ),
    ),
  )
  console.log(`Scheduled ${pipelines.length} pipeline syncs`)
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

/** Task for debugging purposes... */
export const echo: Task = (payload) => {
  console.log('[echo] Task payload =', payload)
}
