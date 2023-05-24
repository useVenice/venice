import {createHTTPClient} from '@usevenice/util'

export function makeSentryClient(opts: {dsn: string}) {
  if (!opts.dsn) {
    console.warn('Sentry DSN missing, sentry calls will be noop')
  }

  // @see https://docs.sentry.io/product/crons/getting-started/
  const sentry = createHTTPClient({
    baseURL: 'https://sentry.io/api/0',
    headers: {Authorization: `DSN ${opts.dsn}`},
  })

  interface Checkin {
    /** Required. The status of your job execution and whether it was completed successfully or unsuccessfully. The values accepted are in_progress, ok or error. */
    status: 'in_progress' | 'ok' | 'error'
    /** Optional. The runtime of the job in milliseconds. If this value is not provided, a duration will be automatically calculated based on the amount of time elapsed from check-in creation to updating a check-in as successful or failed. */
    duration?: number

    dateCreated?: string // '2023-01-27T07:19:49.902586Z'
    id?: string // 'cb65a7ee-26ae-49a9-8c4f-4d17c5afa933'
  }

  const client = {
    createCheckin: async (monitorId: string, data: Checkin) =>
      sentry
        .post<{id: string}>(`/monitors/${monitorId}/checkins/`, data)
        .then((r) => r.data),
    updateCheckin: async (
      monitorId: string,
      checkinId: string,
      data: Checkin,
    ) =>
      sentry
        .put<Required<Checkin>>(
          `/monitors/${monitorId}/checkins/${checkinId}/`,
          data,
        )
        .then((r) => r.data),
  }
  return {
    ...client,
    withCheckin: async <T>(
      monitorId: string | undefined,
      fn: (checkinId: string | undefined) => T | Promise<T>,
    ): Promise<T> => {
      if (!monitorId || !opts.dsn) {
        // if (process.env['VERCEL_ENV'] === 'production') {
        //   throw new Error('monitorId missing for withCheckin')
        // }
        return fn(undefined)
      }
      const {id: checkinId} = await client.createCheckin(monitorId, {
        status: 'in_progress',
      })
      try {
        const ret = await fn(checkinId)
        await client.updateCheckin(monitorId, checkinId, {status: 'ok'})
        return ret
      } catch (err) {
        await client.updateCheckin(monitorId, checkinId, {status: 'error'})
        throw err
      }
    },
  }
}
