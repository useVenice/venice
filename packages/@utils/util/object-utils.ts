import {createCustomEqual, deepEqual, shallowEqual} from 'fast-equals'
import {
  isEmpty as _isEmpty,
  isPlainObject as _isPlainObject,
  pickBy as _pickBy,
} from 'lodash'
import {omit as _omit, pick as _pick, compact} from 'remeda'
import {mergeDeep as _deepMerge} from 'timm'
import {R} from './data-utils'
import {math} from './math-utils'
import type {AnyRecord, ObjectPartialDeep} from './type-utils'

export const floatingDeepEqual = createCustomEqual(
  (_deepEqual) => (a, b, meta) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return math.equals(a, b)
    }
    return _deepEqual(a, b, meta)
  },
)

/** Shallow partial */
export function shallowPartialDeepEqual<T extends Record<string, unknown>>(
  _obj: T,
  _matching: Partial<T>,
): boolean {
  const obj = shallowOmitUndefined(_obj)
  const matching = shallowOmitUndefined(_matching)
  return deepEqual(pick(obj, Object.keys(matching)), matching)
}

/**
 * Works *mostly* like https://jestjs.io/docs/expect#tomatchobjectobject
 * In particular missing value and undefined value will be considered equal,
 * So `{}` will match `{key: undefined}`
 * In practice this means there is no need to deepOmitUndefined when using
 * deepPartialDeepEqual (for the undefined cases anyways)
 */
export function deepPartialDeepEqual<
  T extends object /* Record<string, unknown> */ | unknown[],
>(
  obj: T,
  matching: ObjectPartialDeep<T>,
  opts?: {nullMatchesUndefined?: boolean},
): boolean {
  if (isPlainObject(obj) && isPlainObject(matching)) {
    for (const [key, pv] of Object.entries(matching)) {
      if (
        // @ts-expect-error
        !deepPartialDeepEqual(obj[key] as Record<string, unknown>, pv, opts)
      ) {
        return false
      }
    }
  } else if (Array.isArray(obj) && Array.isArray(matching)) {
    // Array length does matter, special case
    if (obj.length !== matching.length) {
      return false
    }
    for (let i = 0; i < matching.length; i++) {
      if (
        !deepPartialDeepEqual(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          obj[i]! as Record<string, unknown>,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          matching[i]!,
          opts,
        )
      ) {
        return false
      }
    }
  } else if (
    opts?.nullMatchesUndefined &&
    obj === undefined &&
    matching === null
  ) {
    // Special case
    return true
  } else if (matching !== undefined) {
    if (!deepEqual(obj, matching)) {
      return false
    }
  }
  return true
}

// export const partialDeepEqual = createCustomEqual(
//   (_deepEqual) => (a, b, meta) => {
//     if (typeof a === 'number' && typeof b === 'number') {
//       return math.equals(a, b)
//     }
//     return _deepEqual(a, b, meta)
//   },
// )

export type DiffComparator =
  | ((a: unknown, b: unknown) => boolean)
  | 'shallowEqual'
  | 'deepEqual'

type ChangeOf<T> =
  | {
      type: 'added'
      key: keyof T
      value: T[keyof T]
      prevValue?: undefined
    }
  | {
      type: 'updated'
      key: keyof T
      value: T[keyof T]
      prevValue: T[keyof T]
    }
  | {
      type: 'removed'
      key: keyof T
      value?: undefined
      prevValue: T[keyof T]
    }
export interface DiffOf<T> {
  // Keys
  added: Array<keyof T>
  updated: Array<keyof T>
  removed: Array<keyof T>
  unchanged: Array<keyof T>

  // Good stuff
  changes: Array<ChangeOf<T>>
}

export function shallowDiff<T extends Record<string, unknown>>(
  a: T,
  b: T,
  _compare?: DiffComparator,
) {
  const diff: DiffOf<T> = {
    added: [],
    updated: [],
    removed: [],
    unchanged: [],
    changes: [],
  }

  const compare =
    _compare === 'shallowEqual'
      ? shallowEqual
      : _compare === 'deepEqual'
      ? deepEqual
      : !_compare
      ? (a1: unknown, b1: unknown) => a1 === b1
      : _compare

  for (const key of new Set([...objectKeys(a), ...objectKeys(b)])) {
    if (key in b && !(key in a)) {
      diff.added.push(key)
      diff.changes.push({type: 'added', key, value: b[key] as T[keyof T]})
    } else if (key in a && !(key in b)) {
      diff.removed.push(key)
      diff.changes.push({type: 'removed', key, prevValue: a[key] as T[keyof T]})
    } else if (!compare(a[key], b[key])) {
      diff.updated.push(key)
      diff.changes.push({
        type: 'updated',
        key,
        prevValue: a[key] as T[keyof T],
        value: b[key] as T[keyof T],
      })
    } else {
      diff.unchanged.push(key)
    }
  }
  return diff
}

export function isPlainObject<T extends Record<string, unknown>>(
  value: unknown | T,
): value is T {
  return _isPlainObject(value)
}

export function deepMerge<T extends AnyRecord>(
  ...args: [(T | null)?, ...Array<Partial<T> | null | undefined>]
): T {
  const objs = compact(args) as [T, ...Array<Partial<T>>]
  return objs.length === 0
    ? (undefined as unknown as T) // Not technically correct...
    : (_deepMerge(...objs) as T)
}

/** Strictly typed version of lodash/omit */
export function omit<T extends AnyRecord, K extends keyof T>(
  obj: T | null | undefined,
  keys: K[],
) {
  return _omit((obj ?? {}) as T, keys)
}

/** Strictly typed version of lodash/pick */
export function pick<T extends AnyRecord, K extends keyof T>(
  obj: T | null | undefined,
  keys: K[],
) {
  return _pick((obj ?? {}) as T, keys)
}

export function pickNonNull<T extends AnyRecord>(obj: T) {
  return _pickBy(obj, (val): val is NonNullable<typeof val> => val != null) as T
}

export function shallowOmitUndefined<T extends AnyRecord>(input: T): T {
  if (!isPlainObject(input)) {
    return input
  }
  const newObj: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) {
      continue
    }
    newObj[key] = value
  }
  return newObj as T
}

export function mapDeep<T, U = T>(
  input: T,
  fn: (value: unknown, key: string | number) => unknown,
): U {
  if (Array.isArray(input)) {
    return (input as unknown[]).map((item, i) =>
      mapDeep(fn(item, i), fn),
    ) as unknown as U
  }
  if (input && isPlainObject(input)) {
    return R.mapValues(input as Record<string, unknown>, (v, k) =>
      mapDeep(fn(v, k), fn),
    ) as unknown as U
  }
  return input as unknown as U
}

export function deepOmitUndefined<T>(
  input: T,
  opts: {
    pruneEmptyKey?: boolean
    pruneUndefinedArrayElements?: boolean
    pruneEmptyObjectProperties?: boolean
    redact?: (key: string, value: unknown) => boolean
  } = {},
): T extends undefined ? null : T {
  if (Array.isArray(input)) {
    return (input as unknown[])
      .filter((item) => !opts.pruneUndefinedArrayElements || item !== undefined)
      .map(
        (item) => deepOmitUndefined(item, opts),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any
  }
  if (input && typeof input === 'object') {
    if (!isPlainObject(input)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return input as any
    }

    const newObj: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(input)) {
      if (value === undefined) {
        continue
      }
      if (opts.pruneEmptyKey && !key) {
        continue
      }
      if (opts.redact && !opts.redact(key, value)) {
        continue
      }
      const newValue = deepOmitUndefined(value, opts)
      if (
        opts.pruneEmptyObjectProperties &&
        isPlainObject(newValue) &&
        _isEmpty(newValue)
      ) {
        continue
      }
      newObj[key] = newValue
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return newObj as any
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (input === undefined ? null : input) as any
}

// TODO: @yenbekbay How do we make the order of this consistent with
// `objectFromObject` while still remaining convenient?
export function objectFromIterable<T, U = T, K extends string = string>(
  iter: Iterable<T>,
  /** Return `undefined` to filter out */
  keySelector: (item: T, index: number) => K | undefined,
  valueSelector: (item: T, index: number) => U = (i) => i as unknown as U,
) {
  const ret = {} as Record<K, U>
  let index = 0
  for (const item of iter) {
    const key = keySelector(item, index)
    if (key != null) {
      if (key in ret) {
        console.warn(`Duplicate key ${key} during objectFromArray`)
      }
      ret[key] = valueSelector(item, index)
    }
    index++
  }
  return ret
}

export const objectFromArray = objectFromIterable

// TODO: Fix key type to be generic
export function objectFromObject<T, U = T>(
  obj: Record<string, T>,
  valueSelector: (key: string, value: T, index: number) => U,
  /** Return `undefined` to filter out */
  keySelector: (key: string, value: T, index: number) => string | undefined = (
    key,
  ) => key,
) {
  let index = 0
  const ret: Record<string, U> = {}
  for (const [key, value] of Object.entries(obj)) {
    const newKey = keySelector(key, value, index)
    if (newKey != null) {
      if (newKey in ret) {
        console.warn(
          `Duplicate key "${newKey.toString()}" during objectFromObject`,
        )
      }
      ret[newKey] = valueSelector(key, value, index)
    }
    index++
  }
  return ret
}

export function arrayFromObject<T, U = T>(
  obj: Record<string, T>,
  selector: (key: string, value: T) => U,
) {
  const items: U[] = []
  for (const key of objectKeys(obj)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    items.push(selector(key, obj[key]!))
  }
  return items
}

/** Mostly safe workaround. @see https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript */
export function objectKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

/** Mostly safe workaround. @see https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript */
export function objectEntries<T extends object>(
  obj: T,
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}

/**
 * @returns Technically Partial<T> but that makes it hard to use in practice.
 * So we will let it slide
 */
export function filterObject<T extends object>(
  obj: T,
  fn: (key: keyof T, value: T[keyof T]) => boolean,
): T {
  const out = {} as T
  for (const [key, value] of objectEntries(obj)) {
    if (fn(key, value)) {
      out[key] = value
    }
  }
  return out
}

type Falsy = null | undefined | false | '' | 0

// items: readonly (T | null | undefined | false | '' | 0)[]
export function compactObject<T extends object>(obj: T) {
  return filterObject(obj, (_, value) => !!value) as {
    [k in keyof T]: Exclude<T[k], Falsy>
  }
}

/** Very useful together wth immer and optional values */
export function setDefault<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: NonNullable<T[K]>,
): NonNullable<T[K]> {
  if (obj[key] != null) {
    return obj[key] as NonNullable<T[K]>
  }
  obj[key] = value
  return value
}

export {default as deepClone} from 'fast-copy'
export {
  circularDeepEqual,
  circularShallowEqual,
  createCustomEqual,
  deepEqual,
  sameValueZeroEqual,
  shallowEqual,
} from 'fast-equals'
export {flattie} from 'flattie'
export {invert, isEmpty, omitBy, pickBy, setWith as setAtWith} from 'lodash'
export {default as diff} from 'microdiff'
export {nestie} from 'nestie'
export {mapKeys, mapValues, mergeAll} from 'remeda'
export {get as getAt, set as setAt} from 'shvl'
