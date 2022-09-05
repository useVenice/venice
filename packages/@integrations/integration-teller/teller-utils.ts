import {loadScriptOnce} from '@ledger-sync/cdk-core'
import React from 'react'

function loadTellerConnect() {
  return new Promise((resolve) => {
    function check() {
      if (window.TellerConnect) {
        return resolve(window.TellerConnect)
      }
      loadScriptOnce('https://cdn.teller.io/connect/connect.js')
      setTimeout(check, 100)
    }

    check()
  })
}

interface TellerUserEnrollment {
  id?: string
}
interface TellerInstitutionEnrollment {
  name?: string
}
interface TellerEnrollment {
  id?: string
  institution?: TellerInstitutionEnrollment
}
export interface HandleSuccessTellerEnrollment {
  accessToken?: string
  user?: TellerUserEnrollment
  enrollment?: TellerEnrollment
  signatures?: string[]
}

interface TellerOption {
  environment?: 'sandbox' | 'development' | 'production'
  applicationId: string | null
  institution?: string
  onInit(): void
  onSuccess(enrollment: HandleSuccessTellerEnrollment): void
  onExit(): void
}

// Todo: Handle any
export function useTellerAPI(setupArgs: TellerOption) {
  const [tellerApi, setTellerApi] = React.useState<any>(null)
  React.useEffect(() => {
    loadTellerConnect()
      .then((tellerApiRes: any) => {
        if (!setupArgs.environment) {
          return
        }
        console.log('setup teller api', setupArgs, tellerApiRes)
        setTellerApi(tellerApiRes.setup(setupArgs))
      })
      .catch(console.log)
  }, [setupArgs, tellerApi])
  return tellerApi
}
