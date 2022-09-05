/** Development time assertions to catch errors */
import {arrayEquals, sort, uniqBy} from './array-utils'
import {identity} from './converter-utils'
import {fastEnsureUTC} from './schrono'
import invariant from 'tiny-invariant'

/**
 * This works for now. Though we could probably write a babel plugin to remove
 * expensive assertions from production builds entirely.
 * TODO: Add a command to toggle this. Maybe persist in local storage. So we can
 * dynamically turn assertions on and off for performance reasons
 */
export function __DEV__() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && (window as any).__DEV__ != null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).__DEV__ === true
  }
  return (
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
  )
}

export function assertSorted<T>(
  arr: T[],
  selector: (item: T) => unknown = identity,
) {
  if (!__DEV__()) {
    return
  }
  const sorted = sort(arr).asc(selector)
  invariant(arrayEquals(arr, sorted), 'Array not sorted')
}

export function assertUnique<T>(
  arr: T[],
  selector: (item: T) => unknown = identity,
) {
  if (!__DEV__()) {
    return
  }
  const uniqued = uniqBy(arr, selector)
  invariant(arr.length === uniqued.length, 'Array not unique')
}

export function assertUTC<T>(
  arr: T[],
  selector: (item: T) => ISODateTime | ISODateTime /** How do we default? */,
) {
  if (!__DEV__()) {
    return
  }
  for (const item of arr) {
    const date = selector(item)
    invariant(fastEnsureUTC(date) === date, 'Date not in UTC')
  }
}
