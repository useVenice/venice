import '@usevenice/app-config/register.node'

import {
  backendEnv,
  veniceBackendConfig,
  veniceRouter,
} from '@usevenice/app-config/backendConfig'
import type {UserId} from '@usevenice/cdk-core'
import {inngest} from '@usevenice/engine-backend/events'
import {makeSentryClient} from '../lib/makeSentryClient'
import {ensureDefaultLedger, getPool, sql} from '../server'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const sentry = makeSentryClient({dsn: backendEnv.SENTRY_DSN!})

export const scheduleSyncs = inngest.createScheduledFunction(
  'Schedule pipeline syncs',
  '* * * * *',
  () =>
    sentry.withCheckin(backendEnv.SENTRY_CRON_MONITOR_ID, async () => {
      const pipelines = await veniceBackendConfig.metaService.findPipelines({
        secondsSinceLastSync: 1 * 60 * 60, // Every hour
      })
      console.log(`Found ${pipelines.length} pipelines needing to sync`)
      if (pipelines.length > 0) {
        await inngest.send(
          'pipeline/sync-requested',
          pipelines.map((pipe) => ({data: {pipelineId: pipe.id}})),
        )
        // https://discord.com/channels/842170679536517141/845000011040555018/1068696979284164638
        // We can use the built in de-dupe to ensure that we never schedule two pipeline syncs automatically within an hour...
        console.log(`Scheduled ${pipelines.length} pipeline syncs`)
      }
      return {scheduledCount: pipelines.length}
    }),
)

export const syncPipeline = inngest.createStepFunction(
  'Sync pipeline',
  'pipeline/sync-requested',
  async ({event}) => {
    const {pipelineId} = event.data
    console.log('Will sync pipeline', pipelineId)
    // TODO: Figure out what is the userId we ought to be using...
    // Otherwise connections could be overwritten with the wrong id...
    // This upsert stuff is dangerous...
    await veniceRouter
      .createCaller({isAdmin: true, userId: 'usr_TASK_NOOP' as UserId})
      .syncPipeline([{id: pipelineId}, {}])
    console.log('did sync pipeline', pipelineId)
    return pipelineId
  },
)

export const syncResource = inngest.createStepFunction(
  'Sync resource',
  'resource/sync-requested',
  async ({event}) => {
    try {
      const {resourceId} = event.data
      console.log('Will sync resource', resourceId)
      // TODO: Figure out what is the userId we ought to be using...

      const pool = await getPool()
      const creatorId = await pool.oneFirst<UserId>(
        sql`SELECT creator_id FROM resource WHERE id = ${resourceId}`,
      )
      console.log('creatorId', creatorId)
      const [ledgerId] = await ensureDefaultLedger(creatorId)
      await veniceRouter
        .createCaller({userId: creatorId})
        .syncResource([
          {id: resourceId as never},
          {connectWith: {destinationId: ledgerId}},
        ])

      console.log('did sync pipeline', resourceId)
      return resourceId
    } catch (err) {
      console.error('Error running syncResource', err)
      throw err
    }
  },
)
