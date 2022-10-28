import {run} from 'graphile-worker'

import {backendEnv} from '@usevenice/app-config/backendConfig'

import * as tasks from './tasks'

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
    crontab: '* * * * * scheduleTasks ?fill=1m',
    taskList: tasks,
    // We tend ot use pgBouncer on Supabase
    noPreparedStatements: true,
  })

  // How do we solve this in an `rxjs` way?

  let idleTimeout: NodeJS.Timeout | undefined = undefined

  runner.events.addListener('job:start', () => {
    if (idleTimeout) {
      console.log('Starting job and clearing idleTimeout')
      clearTimeout(idleTimeout)
      idleTimeout = undefined
    }
  })

  runner.events.addListener('worker:getJob:empty', () => {
    if (!opts.timeout || idleTimeout) {
      return
    }
    console.log(`No job, will wait ${opts.timeout}ms then quit`)
    idleTimeout = setTimeout(async () => {
      console.log('Runner timeout, exiting...')
      await runner.stop()
    }, opts.timeout)
  })

  // Immediately await (or otherwise handled) the resulting promise, to avoid
  // "unhandled rejection" errors causing a process crash in the event of
  // something going wrong.
  await runner.promise
  // If the worker exits (whether through fatal error or otherwise), the above
  // promise will resolve/reject.
}
