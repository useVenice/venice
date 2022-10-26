 

 
import {run} from 'graphile-worker'

import {backendEnv} from '@usevenice/app-config/backendConfig'

export async function runWorker(opts: {timeout?: number}) {
  if (!backendEnv.POSTGRES_OR_WEBHOOK_URL.startsWith('postgres')) {
    console.warn('Worker exit: env.POSTGRES_OR_WEBHOOK_URL not postgres')
    return
  }
  // Run a worker to execute jobs:
   
  const runner = await run({
    connectionString: backendEnv.POSTGRES_OR_WEBHOOK_URL,
    concurrency: 5,
    // Install signal handlers for graceful shutdown on SIGINT, SIGTERM, etc
    noHandleSignals: false,
    pollInterval: 1000,
    // you can set the taskList or taskDirectory but not both
    crontab: '* * * * * scheduler ?fill=1m',
    taskList: {
      scheduler: (payload, helpers) => {
        console.log('ha', payload)
        helpers.logger.info('Scheduling')
      },
      syncPipeline: (payload, helpers) => {
        const {pipelineId} = payload as any
        helpers.logger.info(`syncPipeline, ${pipelineId}`)
      },
    },
    // or:
    //   taskDirectory: `${__dirname}/tasks`,
  })

  // Immediately await (or otherwise handled) the resulting promise, to avoid
  // "unhandled rejection" errors causing a process crash in the event of
  // something going wrong.

  await (!opts.timeout
    ? runner.promise
    : Promise.race([
        runner.promise,
        new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('Runner timeout, exiting...')
            runner
              .stop()
              .then(() => resolve(undefined))
              .catch((err) => reject(err))
          }, opts.timeout)
        }),
      ]))

  // If the worker exits (whether through fatal error or otherwise), the above
  // promise will resolve/reject.
}
