import React from 'react'

import {Deferred} from '@ledger-sync/util'

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

export function DivContainer(props: {
  id: string
  /** Does not cause re-render */
  onMount?: () => void
  /** Does not cause re-render */
  onUnmount?: () => void
}) {
  React.useLayoutEffect(
    () => {
      setTimeout(() => {
        props.onMount?.()
      }, 0)
      return props.onUnmount
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  return <div id={props.id} />
}
