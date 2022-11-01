import React from 'react'

import {loadScriptOnce} from '@usevenice/cdk-core'

import type {TellerConnect, TellerInstance, TellerOptions} from './TellerClient'

function loadTellerConnect() {
  return new Promise<TellerConnect>((resolve) => {
    function check() {
      if (window.TellerConnect) {
        return resolve(window.TellerConnect)
      }
      void loadScriptOnce('https://cdn.teller.io/connect/connect.js')
      setTimeout(check, 100)
    }
    check()
  })
}

export function useTellerAPI(options: TellerOptions) {
  const [tellerApi, setTellerApi] = React.useState<TellerInstance | null>(null)
  React.useEffect(() => {
    loadTellerConnect()
      .then((tellerConnect) => {
        if (!options.environment) {
          return
        }
        console.log('setup teller api', options, tellerConnect)
        setTellerApi(tellerConnect.setup(options))
      })
      .catch(console.log)
  }, [options, tellerApi])
  return tellerApi
}
