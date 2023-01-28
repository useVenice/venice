import '@usevenice/app-config/register.node'

import {
  backendEnv,
  veniceBackendConfig,
  veniceRouter,
} from '@usevenice/app-config/backendConfig'
import type {UserId} from '@usevenice/cdk-core'
import {makeSentryClient} from '../lib/makeSentryClient'
import {inngest} from './events'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const sentry = makeSentryClient({dsn: backendEnv.SENTRY_DSN!})

export const scheduleSyncs = inngest.createScheduledFunction(
  'Schedule pipeline syncs',
  '* * * * *',
  async () =>
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
    await veniceRouter
      .createCaller({isAdmin: true, userId: 'usr_TASK_NOOP' as UserId})
      .syncPipeline([{id: pipelineId}, {}])
    console.log('did sync pipeline', pipelineId)
    return pipelineId
  },
)
