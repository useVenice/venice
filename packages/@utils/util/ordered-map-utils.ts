import {orderBy} from 'lodash'

// MARK: Deprecated. Use the sorted collections powered by rbt instead...

type ComparableValue = string | number | boolean

interface ComparableObject {
  valueOf(): ComparableValue
}

type NaturallyOrderedValue = ComparableValue | ComparableObject

export type SortIteratee<V, K extends string> = (
  v: V,
  k: K,
) => NaturallyOrderedValue | null | undefined

/** TODO: What is the behavior of naturally ordered value? */
export function orderMapBy<V, K extends string>(
  map: OrderedMap<V, K>,
  ...sortBys: Array<
    readonly [SortIteratee<V, K>, 'asc' | 'desc'] | SortIteratee<V, K>
  >
) {
  const iteratees = sortBys
    .map((i) => (Array.isArray(i) ? i[0] : i))
    .map(
      (fn) =>
        ([k, v]: [K, V]) =>
          fn(v, k),
    )
  const orders = sortBys.map((i) => (Array.isArray(i) ? i[1] : 'asc'))

  // TODO: Consider replacing with fast-sort here rather than lodash
  const orderedEntries = orderBy(
    Object.entries(map),
    iteratees,
    orders,
  ) as Array<[K, V]>

  return Object.fromEntries(orderedEntries)
}

/**
 * Does shallow comparison using === operator, does take order into account
 * For deep comparison, use deepEqusl(Object.entries(a), Object.entries(b))
 */
export function orderedMapEquals<T extends OrderedMap<unknown>>(a: T, b: T) {
  const aEntries = Object.entries(a)
  const bEntries = Object.entries(b)
  if (aEntries.length !== bEntries.length) {
    return false
  }

  for (let i = 0; i < aEntries.length; i++) {
    if (
      aEntries[i]?.[0] !== bEntries[i]?.[0] ||
      aEntries[i]?.[1] !== bEntries[i]?.[1]
    ) {
      return false
    }
  }
  return true
}
