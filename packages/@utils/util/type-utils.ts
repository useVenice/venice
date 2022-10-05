import type {Primitive, UnionToIntersection} from 'type-fest'

export type {
  Merge,
  SetNonNullable,
  SetOptional,
  SetRequired,
  Split,
  UnionToIntersection,
  ValueOf,
} from 'type-fest'

export type AnyArray<T> = T[] | readonly T[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction<T = any> = (...args: any[]) => T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>
export type NonEmptyArray<T> = [T, ...T[]]
export type Builtin = Primitive | AnyFunction | Date | Error | RegExp

/**
 * Make a runtime mapping type for a literal union
 */
export type EnumOf<E extends string | number | symbol> = {[K in E]: K}

/**
 * Same as EnumOf, but values are for display rather than key
 */
export type DisplayOf<E extends string | number | symbol> = {[K in E]: string}

/**
 * Create a type that represents either the value or an array of the value type
 */
export type MaybeArray<T> = T | T[]

/**
 * Create a type that represents either the value or a promise of the value type
 */
export type MaybePromise<T> = T | Promise<T>

/**
 * Like `Partial` but recursive
 */
export declare type PartialDeep<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? Map<PartialDeep<K>, PartialDeep<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<PartialDeep<K>, PartialDeep<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<PartialDeep<K>, PartialDeep<V>>
  : T extends Set<infer U>
  ? Set<PartialDeep<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<PartialDeep<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<PartialDeep<U>>
  : T extends Array<infer U>
  ? T extends IsTuple<T>
    ? {[K in keyof T]?: PartialDeep<T[K]>}
    : Array<PartialDeep<U>>
  : T extends Promise<infer U>
  ? Promise<PartialDeep<U>>
  : T extends Branded<infer U, infer B>
  ? Branded<U, B>
  : T extends {}
  ? {[K in keyof T]?: PartialDeep<T[K]>}
  : Partial<T>

/**
 * Like `PartialDeep` but Array/Map/Set/Promise elements are unchanged
 */
export declare type ObjectPartialDeep<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? Map<K, V>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<K, V>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<K, V>
  : T extends Set<infer U>
  ? Set<U>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<U>
  : T extends WeakSet<infer U>
  ? WeakSet<U>
  : T extends Array<infer U>
  ? T extends NonEmptyArray<U>
    ? T
    : U[]
  : T extends Promise<infer U>
  ? Promise<U>
  : T extends Branded<infer U, infer B>
  ? Branded<U, B>
  : T extends {}
  ? {[K in keyof T]?: ObjectPartialDeep<T[K]>}
  : T extends unknown
  ? unknown
  : Partial<T>

/**
 * Check whether a type is a tuple type
 */
export type IsTuple<T extends {length: number}> = number extends T['length']
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends NonEmptyArray<any>
    ? T
    : never
  : T

/**
 * Prevent usage of type `T` from being inferred in other generics
 * @see https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-504042546
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NoInfer<T> = [T][T extends any ? 0 : never]

/**
 * Mark some properties as required, leaving others optional
 */
export type RequiredOnly<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>

/**
 * Make properties non-nullable, leaving others unchanged
 */
export type NonNullableOnly<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}

/**
 * Distribute the Omit across a union
 * @see https://davidgomes.com/pick-omit-over-union-types-in-typescript/
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributiveOmit<T, K extends keyof T> = T extends any
  ? Omit<T, K>
  : never

/**
 * Distribute the Pick across a union
 * @see https://davidgomes.com/pick-omit-over-union-types-in-typescript/
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributivePick<T, K extends keyof T> = T extends any
  ? Pick<T, K>
  : never

/**
 * Remove keys with possibly undefined value from an object
 */
export type PickRequiredKeys<T extends object> = Pick<T, RequiredKeys<T>>

/**
 * Extract keys that map to a required value
 */
export type RequiredKeys<T extends object> = Exclude<
  {[K in keyof T]: undefined extends T[K] ? never : K}[keyof T],
  undefined
>

/**
 * Swap keys and values in an object
 */
export type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [V in T[keyof T]]: KeyFromValue<V, T>
}

/**
 * Find key in an object corresponding to the given value
 */
export type KeyFromValue<V, T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T]: V extends T[K] ? K : never
}[keyof T]

/**
 * Generates a union of "dotted paths" for the given type.
 * Capped at 3 levels of depth by default
 */
export type PathsOf<T, TMaxDepth extends number = 2> = NonNullable<
  PathsOfObject<T, T, TMaxDepth>
>

export type PathsOfObject<
  T,
  // Keep track of self and ancestors to prevent circular reference issues
  TSelf = T,
  TMaxDepth extends number = 2,
  TDepth extends number = 0,
> =
  // Array
  number extends keyof T
    ? PathsOfProp<number, NonNullable<T[number]>, TSelf, TMaxDepth, TDepth>
    : // Map
    string extends keyof T
    ? PathsOfProp<string, NonNullable<T[string]>, TSelf, TMaxDepth, TDepth>
    : // Plain object
      {
        [P in keyof T]: T[P] extends infer V | null | undefined
          ? PathsOfProp<P, V, TSelf, TMaxDepth, TDepth>
          : never
      }[keyof T]

export type PathsOfProp<
  P,
  V,
  TSelf,
  TMaxDepth extends number = 2,
  TDepth extends number = 0,
> = V extends unknown
  ? {
      0: `${string & P}`
      1:
        | `${string & P}`
        | `${string & P}.${PathsOfObject<
            V,
            V | TSelf,
            TMaxDepth,
            Increment<TDepth>
          >}`
    }[TDepth extends TMaxDepth
      ? 0
      : V extends object
      ? V extends string
        ? 0
        : TSelf extends V
        ? V extends TSelf
          ? 0
          : 1
        : 1
      : 0]
  : never

type Increment<T extends number> = T extends keyof IncrementMap
  ? IncrementMap[T]
  : never

interface IncrementMap {
  0: 1
  1: 2
  2: 3
  3: 4
  4: 5
  5: 6
  6: 7
  7: 8
  8: 9
  9: 10
}

export type NonDiscriminatedUnion<T> = {
  [K in AllUnionKeys<T> & string]: Indexify<T>[K]
}

type AllUnionKeys<T> = keyof UnionToIntersection<{[K in keyof T]: undefined}>
type Indexify<T> = T & Record<string, undefined>

/**
 * Inspired by https://github.com/krzkaczor/ts-essentials#exhaustive-switch-cases
 */
export class UnreachableCaseError extends Error {
  override name = 'UnreachableCaseError'

  constructor(message: never) {
    super(message)
    Object.setPrototypeOf(this, UnreachableCaseError.prototype)
  }
}

export function infer<T>() {
  return <U extends T>(input: U) => input
}
