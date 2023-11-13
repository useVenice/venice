import type {IntegrationClient} from '@usevenice/cdk'
import {useScript} from '@usevenice/cdk'

import type {tellerSchemas} from './def'

export const tellerClient = {
  useConnectHook: (_) => {
    const loaded = useScript('//cdn.teller.io/connect/connect.js')
    return async (opts, {institutionExternalId}) => {
      await loaded
      const institution = institutionExternalId
        ? `${institutionExternalId}`
        : undefined
      return new Promise((resolve, reject) => {
        const tellerConnect = window.TellerConnect.setup({
          applicationId: opts.applicationId,
          ...(institution && {institution}),
          onInit() {
            console.log('Teller Connect has initialized')
          },
          // Part 3. Handle a successful enrollment's accessToken
          onSuccess(enrollment) {
            console.log('User enrolled successfully', enrollment)
            resolve({token: enrollment.accessToken})
          },
          onFailure(failure) {
            console.error('User enrolled failed', failure)
            reject(new Error(failure.message))
          },
          onExit() {
            console.log('User closed Teller Connect')
          },
        })
        tellerConnect.open()
      })
    }
  },
} satisfies IntegrationClient<typeof tellerSchemas>

export default tellerClient
