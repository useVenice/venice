// Adapted from https://github.com/blend/promise-utils/blob/6ca9c71c55781b6db20a5d196e61b58489ed0478/src/delay.ts#L9
import {Sema} from 'async-sema'

export {RateLimit} from 'async-sema'

export type MaybePromise<T> = T | Promise<T>

/** Aka sleep */
export async function delay<T>(delayTimeMs: number, value: T): Promise<T>
export async function delay<T>(delayTimeMs: number): Promise<void>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function delay<T>(delayTimeMs: any, value?: T): Promise<void | T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delayTimeMs))
}

export async function delayUntil(predicate: () => boolean, timeoutMs: number) {
  let elapsedMs = 0
  while (elapsedMs < timeoutMs) {
    const ok = predicate()
    if (ok) {
      return true
    }

    await delay(DEFAULT_INTERVAL_MS)
    elapsedMs += DEFAULT_INTERVAL_MS
  }
  return false
}

const DEFAULT_INTERVAL_MS = 10

export class Deferred<T> {
  resolve!: (ret: T | PromiseLike<T>) => void
  reject!: (reason?: unknown) => void
  completed = false
  promise = new Promise<T>((resolve, reject) => {
    this.reject = (err) => {
      reject(err)
      this.completed = true
    }
    this.resolve = (val) => {
      resolve(val)
      this.completed = true
    }
  })
}

export function withConcurrency<Args extends unknown[], T>(
  concurrency: number,
  fn: (...args: Args) => Promise<T>,
) {
  const sema = new Sema(concurrency)
  return async (...args: Args) => {
    await sema.acquire()
    try {
      return await fn(...args)
    } finally {
      await sema.release()
    }
  }
}
