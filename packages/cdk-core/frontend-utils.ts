import {Deferred} from '@ledger-sync/util'
import React from 'react'

export function loadScriptOnce(src: string) {
  const cachedScript = loadScriptOnce.cache.get(src)
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
loadScriptOnce.cache = new Map<string, HTMLScriptElement>()

export function useScript(src: string) {
  const deferred = React.useRef(new Deferred<void>())
  React.useEffect(() => {
    loadScriptOnce(src)
      .then(() => deferred.current.resolve())
      .catch(deferred.current.reject)
  }, [deferred, src])

  return deferred.current.promise
}

export const CANCELLATION_TOKEN = 'CANCELLED'
