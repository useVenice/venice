import '@usevenice/app-config/register.node'

import {veniceBackendConfig} from '@usevenice/app-config/backendConfig'
import {inngest} from './events'

export const demoFn = inngest.createStepFunction(
  'My first function',
  'test/demo',
  ({event, tools}) => {
    console.log('Will sleep')
    tools.sleep('1 second')
    console.log('Did sleep')
    return {event, body: 'hello!'}
  },
)

export const scheduleSyncs = inngest.createScheduledFunction(
  'Schedule syncs',
  '* * * * *',
  async () => {
    const pipelines = await veniceBackendConfig.metaService.findPipelines({
      secondsSinceLastSync: 24 * 60 * 60, // 24 hours
    })
    console.log(`Scheduling sync for ${pipelines.length} pipes`)
    await inngest.send(
      'sync/requested',
      pipelines.map((pipe) => ({data: {pipelineId: pipe.id}})),
    )
    console.log(`Scheduled ${pipelines.length} pipeline syncs`)
    return {scheduledCount: pipelines.length}
  },
)

export const syncPipeline = inngest.createStepFunction(
  'Sync pipeline',
  'sync/requested',
  async ({event}) => {
    console.log('Sync pipeline', event.data.pipelineId)
    return event.data.pipelineId
  },
)
