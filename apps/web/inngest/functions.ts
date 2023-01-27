import '@usevenice/app-config/register.node'

import {
  veniceBackendConfig,
  veniceRouter,
} from '@usevenice/app-config/backendConfig'
import type {UserId} from '@usevenice/cdk-core'
import {inngest} from './events'

export const scheduleSyncs = inngest.createScheduledFunction(
  'Schedule pipeline syncs',
  '* * * * *',
  async () => {
    const pipelines = await veniceBackendConfig.metaService.findPipelines({
      secondsSinceLastSync: 24 * 60 * 60, // 24 hours
    })
    console.log(`Scheduling sync for ${pipelines.length} pipes`)
    await inngest.send(
      'pipeline/sync-requested',
      pipelines.map((pipe) => ({data: {pipelineId: pipe.id}})),
    )
    console.log(`Scheduled ${pipelines.length} pipeline syncs`)
    return {scheduledCount: pipelines.length}
  },
)

export const syncPipeline = inngest.createStepFunction(
  'Sync pipeline',
  'pipeline/sync-requested',
  async ({
    event: {
      data: {pipelineId, forReal},
    },
  }) => {
    console.log('Will sync pipeline', pipelineId)
    if (forReal) {
      // TODO: Figure out what is the userId we ought to be using...
      await veniceRouter
        .createCaller({isAdmin: true, userId: 'usr_TASK_NOOP' as UserId})
        .mutation('syncPipeline', [{id: pipelineId}, {}])
    }
    console.log('did sync pipeline', pipelineId)
    return pipelineId
  },
)
