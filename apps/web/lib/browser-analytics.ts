import {zUserId} from '@usevenice/cdk-core'
import {zEvent, zUserTraits} from '@usevenice/engine-backend/events'
import {z, zFunction} from '@usevenice/util'
import posthog from 'posthog-js'

export const browserAnalytics = {
  // Divided on whether we should use zFunction or use the more verbose z.function()...
  init: zFunction(z.string(), (writeKey) =>
    posthog.init(writeKey, {api_host: '/metrics', autocapture: true}),
  ),
  identify: z
    .function()
    .args(zUserId, zUserTraits.optional())
    .implement((userId, traits) => posthog.identify(userId, traits)),
  track: z
    .function()
    .args(zEvent)
    .implement((event) => posthog.capture(event.name, event.data)),
  reset: () => posthog.reset(),
}
;(globalThis as any).posthog = posthog
;(globalThis as any).browserAnalytics = browserAnalytics
