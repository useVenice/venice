/**
 * As far as I can tell, Generators  are nothing but IterableIterators
 * and `AsyncGenerators` are nothing but generators that yield Promises
 *
 * Most things a consumer would want to do with a generator can be done with an iterable
 *
 * https://stackoverflow.com/questions/37124006/iterator-and-a-generator-in-javascript
 */

// MARK: Async

export async function* asyncYieldNever() {}

export async function* asyncYieldInput<T>(input: T) {
  yield input
}

// eslint-disable-next-line require-yield
export async function* asyncYieldThrow(err: unknown) {
  throw err
}

/**
 * See .spec test for usage
 * is there a popularlibary that I missed somewhere?
 */
export async function* catchAsyncIterable<T>(
  iter: AsyncIterable<T>,
  /** Rethrow in here if need be */
  tryCatch: (error: unknown) => void,
) {
  try {
    yield* iter
  } catch (err) {
    tryCatch(err)
  }
}

export async function* combineAsyncIterables<T>(
  ...iterables: Array<AsyncIterable<T>>
) {
  for (const iter of iterables) {
    yield* iter
  }
}

export function isAsyncIterable<T>(input: unknown): input is AsyncIterable<T> {
  return (
    input != null &&
    typeof input === 'object' &&
    typeof (input as Record<string | symbol, unknown>)[Symbol.asyncIterator] ===
      'function'
  )
}

// MARK: Sync

export function* yieldNever() {}

export function* yieldInput<T>(input: T) {
  yield input
}

// eslint-disable-next-line require-yield
export function* yieldThrow(err: unknown) {
  throw err
}

export function* combineIterables<T>(...iters: Array<Iterable<T>>) {
  for (const iter of iters) {
    yield* iter
  }
}

export async function* catchIterables<T>(
  iter: Iterable<T>,
  /** Rethrow in here if need be */
  tryCatch: (error: unknown) => void,
) {
  try {
    yield* iter
  } catch (err) {
    tryCatch(err)
  }
}

export function isIterable<T>(input: unknown): input is Iterable<T> {
  return (
    input != null &&
    typeof input === 'object' &&
    typeof (input as Record<string | symbol, unknown>)[Symbol.iterator] ===
      'function'
  )
}

// MARK: Generator utils

export function flattenGenerator<T>(fn: () => Iterable<T[]>): T[] {
  return [...fn()].flat()
}
