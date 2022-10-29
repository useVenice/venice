export function makeLogger(tag?: string, data?: Record<string, unknown>) {
  function wrapLogFunction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (message?: any, ...optionalParams: any[]) => void,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (message?: any, ...optionalParams: any[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const args: any[] = []
      if (typeof tag == 'string') {
        args.push(`[${tag}]`)
      }
      if (typeof message === 'string') {
        args.push(message)
      }
      args.push(...optionalParams)
      if (data) {
        args.push(data)
      }

      fn(...args)
    }
  }

  return {
    log: wrapLogFunction(console.log),
    info: wrapLogFunction(console.info),
    warn: wrapLogFunction(console.warn),
    error: wrapLogFunction(console.error),
    debug: wrapLogFunction(console.debug),
  }
}

export type Logger = ReturnType<typeof makeLogger>
