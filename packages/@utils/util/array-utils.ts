import {sameValueZeroEqual} from 'fast-equals'
import {
  difference as _difference,
  differenceBy as _differenceBy,
  differenceWith as _differenceWith,
  Comparator2,
  ValueIteratee,
} from 'lodash'
import {MaybeArray} from './type-utils'

export function nonEmpty<T>(arr: T[]) {
  if (arr.length === 0) {
    throw new Error('Expected non-empty array')
  }
  return arr as [T, ...T[]]
}

export function hasAny<T, U extends T>(
  input: readonly T[],
  ...toSearch: readonly U[]
) {
  return toSearch.some((element) => input.includes(element))
}

export function everySome<T>(
  input: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => unknown,
) {
  return input.length > 0 && input.every(predicate)
}

/** Reversing array without mutating the original */
export function arrayFromReverse<T>(input: readonly T[]): T[] {
  const out: T[] = []
  for (let i = input.length - 1; i >= 0; i--) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    out.push(input[i]!)
  }
  return out
}

/**
 * Performs a === comparsion of elements inside array. Order respecting
 * https://stackoverflow.com/a/16436975/692499
 */
export function arrayEquals<T>(
  a: T[],
  b: T[],
  isEqual: (a: T | undefined, b: T | undefined) => boolean = Object.is,
) {
  if (a === b) {
    return true
  }
  if (a.length !== b.length) {
    return false
  }
  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < a.length; ++i) {
    if (!isEqual(a[i], b[i])) {
      return false
    }
  }
  return true
}

/** https://github.com/ramda/ramda/blob/v0.26.1/source/groupWith.js#L33 */
export function groupWith<T>(arr: T[], fn: (x: T, y: T) => boolean): T[][] {
  const res = []
  let idx = 0
  const len = arr.length
  while (idx < len) {
    let nextIdx = idx + 1
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    while (nextIdx < len && fn(arr[nextIdx - 1]!, arr[nextIdx]!)) {
      nextIdx += 1
    }
    res.push(arr.slice(idx, nextIdx))
    idx = nextIdx
  }
  return res
}

export function randomItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** https://bost.ocks.org/mike/shuffle/ */
export function shuffleWithSeed<T>(arr: T[], seed: number) {
  let currentSeed = seed
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000
    return x - Math.floor(x)
  }

  const ret = [...arr]
  let currentIndex = arr.length
  let temporaryValue
  let randomIndex
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(random() * currentIndex)
    currentIndex -= 1
    // And swap it with the current element
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    temporaryValue = ret[currentIndex]!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ret[currentIndex] = ret[randomIndex]!
    ret[randomIndex] = temporaryValue
  }
  return ret
}

export function fromMaybeArray<T>(maybeArray: MaybeArray<T>) {
  return (
    maybeArray
      ? Array.isArray(maybeArray)
        ? maybeArray
        : [maybeArray]
      : undefined
  ) as T extends undefined ? undefined : T[]
}

export function delta<T>(a: T[], b: T[]) {
  return {
    added: _difference(b, a),
    removed: _difference(a, b),
  }
}

export function deltaWith<T>(
  a: T[],
  b: T[],
  comparator: Comparator2<T, T> = sameValueZeroEqual,
) {
  return {
    added: _differenceWith(b, a, comparator),
    removed: _differenceWith(a, b, comparator),
  }
}

export function deltaBy<T>(a: T[], b: T[], iteratee: ValueIteratee<T>) {
  return {
    added: _differenceBy(b, a, iteratee),
    removed: _differenceBy(a, b, iteratee),
  }
}

export function getPageFromArray<T>(input: {
  items: T[]
  pageSize?: number | undefined
  page?: number | undefined
}) {
  const {items, pageSize = 0, page = 0} = input
  if (pageSize < 0) {
    // Special case
    return items
  }
  // pageSize can be of Infinity value. 0 * Infinity is NaN
  const start = page === 0 ? 0 : page * pageSize
  const end = Number.isFinite(pageSize)
    ? page * pageSize + pageSize
    : Number.POSITIVE_INFINITY
  return items.slice(start, end)
}

/** https://github.com/clauderic/dnd-kit/blob/b40d70c4e091fb30f1f2b82be0e492bad375da92/packages/sortable/src/utilities/arrayMove.ts */
export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const ret = array.slice()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ret.splice(to < 0 ? ret.length + to : to, 0, ret.splice(from, 1)[0]!)
  return ret
}

export function normalizeArray<T>(val: T | T[]) {
  return Array.isArray(val) ? val : [val]
}

export interface ArrayLike<T> {
  [index: number]: T
  length: number
  slice(start?: number, end?: number): ArrayLike<T>
  [Symbol.iterator](): Iterator<T>
}

/**
 * Via https://stackoverflow.com/a/68703218
 * One caveat with typing
 * const prefix2 = commonPrefix('v1', 'v2')
 * typeof prefix2 will be equal to 'v1' | 'v2'
 * Which is not right, as it should be `string`
 */
export function commonPrefix<T extends ArrayLike<unknown>>(
  arr: T,
  ...rest: T[]
) {
  let i = 0
  // while all words have the same character at position i, increment i
  while (arr[i] && rest.every((a) => a[i] === arr[i])) {
    i++
  }

  // prefix is the substring from the beginning to the last successfully checked i
  return arr.slice(0, i) as T
}

export {inPlaceSort, sort} from 'fast-sort'
export {
  chunk,
  difference,
  intersection,
  intersectionBy,
  last,
  partition,
  pull,
  sortedIndexBy,
  union,
} from 'lodash'
export {chunk as makeChunks, compact, groupBy, uniq, uniqBy, zip} from 'remeda'
export {insert, removeAt, replaceAt} from 'timm'
