import {zEvent} from '@usevenice/engine-backend/events'
import {z, zFunction} from '@usevenice/util'
import posthog from 'posthog-js'

export const browserAnalytics = {
  // Divided on whether we should use zFunction or use the more verbose z.function()...
  init: zFunction(z.string(), (writeKey) =>
    posthog.init(writeKey, {api_host: '/metrics', autocapture: true}),
  ),
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
;(globalThis as any).posthog = posthog
;(globalThis as any).browserAnalytics = browserAnalytics
