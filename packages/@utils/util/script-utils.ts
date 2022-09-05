import type {AnyFunction, Promisable} from './type-utils'

export async function withTimer<T>(
  nameOrFn: string | AnyFunction<unknown>,
  fn: (checkpoint: (checkpointName: string) => void) => Promisable<T>,
) {
  const name = typeof nameOrFn === 'string' ? nameOrFn : nameOrFn.name

  const startStart = performance.now()
  let start = startStart
  if (!name.startsWith('_')) {
    console.debug(`\n--- ${name}: Will start`)
  }
  const ret = await fn((checkpointName) => {
    const end = performance.now()
    console.debug(`- ${name}/${checkpointName}: ${(end - start).toFixed(1)}ms`)
    start = end
  })
  if (!name.startsWith('_')) {
    console.debug(
      `--- ${name}: Did end ${(performance.now() - startStart).toFixed(1)}ms\n`,
    )
  }
  return ret
}

export async function runMain(
  name: string,
  fn: (
    checkpoint: (checkpointName: string) => void,
  ) => Promisable<void | boolean>,
) {
  if (name.startsWith('_')) {
    return
  }
  let complete = false
  if (typeof process !== 'undefined') {
    process.once('exit', () => {
      if (!complete) {
        // https://github.com/nodejs/promises-debugging/issues/16
        console.error(
          'ERROR: Process exits without reaching end of runMain.' +
            ' Check for unresolved promieses',
        )
      }
    })
  }
  let ret: void | boolean
  try {
    ret = await withTimer(`/runMain/${name}`, fn)
  } catch (err) {
    console.error(err)
  }
  complete = true
  if (typeof process !== 'undefined' && ret !== false) {
    process.exit(0)
  }
}
