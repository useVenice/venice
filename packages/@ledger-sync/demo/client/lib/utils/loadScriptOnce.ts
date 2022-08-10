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
