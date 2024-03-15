import type {SendEventPayload} from 'inngest/helpers/types'
import type {Events, OrgProperties} from '@usevenice/engine-backend'

/**
 * Unlike functions, routines are designed to run without dependency on Inngest
 * So they can be used with any job queue system, such as BullMQ or home grown system built
 * on top of postgres / redis / pubsub / whatever.
 */
export interface FunctionInput<T extends keyof Events> {
  // NOTE: This is not the full set of fields exposed by Inngest. there are more...
  event: {data: Events[T]['data']; id?: string; name: T; user?: OrgProperties}
  step: {
    run: <T>(name: string, fn: () => Promise<T>) => Promise<T> | T
    sendEvent: (
      stepId: string,
      events: SendEventPayload<Events>,
    ) => Promise<unknown> // SendEventOutput
  }
}
type SingleNoArray<T> = T extends Array<infer U> ? U : T
export type EventPayload = SingleNoArray<SendEventPayload<Events>>

export async function sendWebhook({event}: FunctionInput<keyof Events>) {
  if (!event.user?.webhook_url) {
    return false
  }

  // We shall let inngest handle the retries and backoff for now
  // Would be nice to have a openSDK for sending webhook payloads that are typed actually, after all it has
  // the exact same shape as paths.
  const res = await fetch(event.user.webhook_url, {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      'content-type': 'application/json',
      // TODO: Adopt standardwebhooks and implement webhook signing
    },
  })
  const responseAsJson = await responseToJson(res)
  return {...responseAsJson, target: event.user.webhook_url}
}

async function responseToJson(res: Response) {
  return {
    headers: Object.fromEntries(res.headers.entries()),
    status: res.status,
    statusText: res.statusText,
    body: safeJsonParse(await res.text()),
  }
}

function safeJsonParse(str: string) {
  try {
    return JSON.parse(str) as unknown
  } catch {
    return str
  }
}
