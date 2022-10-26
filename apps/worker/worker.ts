/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {run, runMigrations} from 'graphile-worker'

import {backendEnv} from '@usevenice/app-config/backendConfig'
import {makePostgresClient} from '@usevenice/core-integration-postgres'

export async function setupWorkerLoop(opts: {syncHttp?: boolean}) {
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

  // MARK: - Setup pg_cron

  // NOTE: Only database named `postgres` works with pg_cron by default
  await pool.query(sql`CREATE EXTENSION IF NOT EXISTS pg_cron;`)

  if (opts.syncHttp) {
    await pool.query(sql`CREATE EXTENSION IF NOT EXISTS http;`)
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
  } else {
    await pool.query(sql`CREATE EXTENSION IF NOT EXISTS pg_net;`)
    await pool.query(sql`
      SELECT
        cron.schedule('runWorkerEveryMinute', '* * * * *', -- every minute
          $$
          SELECT * FROM net.http_post(
            url:=${workerUrl},
            body:=jsonb_build_object('secret', ${secret})
          )
          $$
        );
    `)
  }

  // MARK: - Setup graphile worker
  await runMigrations({
    connectionString: backendEnv.POSTGRES_OR_WEBHOOK_URL,
  })

  // Supabase only, allow us to scale background tasks to much more than just
  // the default one request per minute and reduce latency of responding to new jobs to be near instant
  // scheduler will still run once per minute and that would be sufficient
  // https://supabase.com/blog/supabase-functions-updates#database-webhooks-alpha
  // Notably supabase/postgres docker image does not contain supabase_functions schema. Alas
  const isSupabase = await pool.oneFirst(sql`
    SELECT EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = 'supabase_functions')
  `)
  if (isSupabase) {
    await pool.query(sql`
      CREATE OR REPLACE TRIGGER "run_worker_on_new_job"
      AFTER INSERT ON graphile_worker.jobs
      FOR EACH ROW
      EXECUTE FUNCTION supabase_functions.http_request(${workerUrl}, 'POST', '{"Content-type":"application/json"}', '{}', '1000');
    `)
  }
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
