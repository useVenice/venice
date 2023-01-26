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
  () => {
    console.log('Scheduling sync...')
    return {now: new Date().toISOString(), another: 123}
  },
)
