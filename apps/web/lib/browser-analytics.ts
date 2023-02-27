import {commonEnv} from '@usevenice/app-config/commonConfig'
import {zEvent} from '@usevenice/engine-backend/events'
import {z} from '@usevenice/util'
import posthog from 'posthog-js'

export const browserAnalytics = {
  init: () =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    posthog.init(commonEnv.NEXT_PUBLIC_POSTHOG_WRITEKEY!, {
      // api_host: '/metrics',
      autocapture: true,
    }),
  track: z
    .function()
    .args(zEvent)
    .implement((event) => {
      // console.log('Will call posthog capture', event)
      posthog.capture(event.name, event.data)
    }),
  identify: z
    .function()
    .args(z.string())
    .implement((userId) => posthog.identify(userId)),
  reset: () => posthog.reset(),
}
