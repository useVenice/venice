import React from 'react'

export function loadScriptOnce(src: string) {
  const cachedScript = cache.get(src)
  if (cachedScript) {
    return Promise.resolve(cachedScript)
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src

    const handleLoad = () => {
      resolve(script)
      script.removeEventListener('load', handleLoad)
    }
    const handleError = () => {
      reject(new Error(`Failed to load ${src}`))
      script.removeEventListener('error', handleError)
    }

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)

    document.head.append(script)
  })
}

const cache = new Map<string, HTMLScriptElement>()

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
        setTellerApi(tellerApiRes.setup(setupArgs))
      })
      .catch(console.log)
  }, [setupArgs, tellerApi])
  return tellerApi
}
