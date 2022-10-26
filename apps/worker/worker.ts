 

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {run} from 'graphile-worker'

import {backendEnv} from '@usevenice/app-config/backendConfig'
import {makePostgresClient} from '@usevenice/core-integration-postgres'

export async function startWorkerLoop() {
  if (!backendEnv.POSTGRES_OR_WEBHOOK_URL.startsWith('postgres')) {
    console.warn('Worker exit: env.POSTGRES_OR_WEBHOOK_URL not postgres')
    return
  }
  const {sql, getPool} = makePostgresClient({
    databaseUrl: backendEnv.POSTGRES_OR_WEBHOOK_URL,
  })

  // Not sure why `literalValue` here is necessary, but without which postgres will fail
  // with bind message supplies 2 parameters, but prepared statement "" requires 0 error
  // @see related https://github.com/gajus/slonik/issues/138
  // TODO: Turn these into real values
  const workerUrl = sql.literalValue(
    'https://webhook.site/c62353a0-ebab-486f-860c-0db3f525c2df',
  )
  const secret = sql.literalValue('secret_' + new Date().toString())

  const pool = await getPool()
  // NOTE: Only database named `postgres` works with pg_cron by default
  await pool.query(sql`
    CREATE EXTENSION IF NOT EXISTS http;
    CREATE EXTENSION IF NOT EXISTS pg_cron;
  `)
  await pool.query(sql`
    SELECT
      cron.schedule('runWorkerEveryMinute', '* * * * *', -- every minute
        $$
        SELECT status
        FROM http_post(${workerUrl},
          json_build_object('secret', ${secret})::text,
          'application/json'
        )
        $$
      );
  `)
}

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
    taskList: {
      scheduleTasks: (payload, helpers) => {
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
