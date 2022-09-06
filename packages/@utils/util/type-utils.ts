import type {rxjs} from './observable-utils'
import type {JsonValue, Primitive, UnionToIntersection} from 'type-fest'

export type AnyArray<T> = T[] | readonly T[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction<T = any> = (...args: any[]) => T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>
export type NonEmptyArray<T> = [T, ...T[]]
export interface NonFunction {
  apply?: never
}
export type Builtin = Primitive | AnyFunction | Date | Error | RegExp
export type Serializable = JsonValue | (object & NonFunction)

/**
 * Make a runtime mapping type for a literal union
 */
export type EnumOf<E extends string | number | symbol> = {[K in E]: K}

/**
 * Same as EnumOf, but values are for display rather than key
 */
export type DisplayOf<E extends string | number | symbol> = {[K in E]: string}

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
 * Returns tuple types that include every string in union
 * > TupleOf<keyof {bar: string; leet: number}>
 * ['bar', 'leet'] | ['leet', 'bar']
 * @see https://github.com/microsoft/TypeScript/issues/13298#issuecomment-692864087
 */
export type TupleOf<U extends string, R extends string[] = []> = {
  [S in U]: Exclude<U, S> extends never
    ? [...R, S]
    : TupleOf<Exclude<U, S>, [...R, S]>
}[U] &
  string[]

/**
 * Identical to `SetStateAction` from React
 */
export type SetStateAction<TInput, TOutput = TInput> =
  | TInput
  | ((prevState: TOutput) => TInput)

/**
 * Like `SetStateAction` but the input is allowed to be partial
 */
export type PatchStateAction<TInput, TOutput = TInput> =
  | ObjectPartialDeep<TInput>
  | ((prevState: TOutput) => ObjectPartialDeep<TInput>)

/**
 * Create a type that represents either the value or an array of the value type
 */
export type MaybeArray<T> = T | T[]

/**
 * Like an intersection but only the common keys are required
 */
export type OneOfTwo<T, U> = RequiredOnly<T & U, Extract<keyof T, keyof U>>

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
 * Extract from `T` those types that are assignable to `U`, where `U` must exist
 * in `T`. Similar to `Extract` but requires the extraction list to be composed
 * of valid members of `T`.
 * @see https://github.com/pelotom/type-zoo/issues/37
 */
export type ExtractStrict<T, U extends T> = T extends U ? T : never

/**
 * Exclude from `T` those types that are assignable to `U`, where `U` must exist
 * in `T`. Similar to `Exclude` but requires the exclusion list to be composed
 * of valid members of `T`.
 *
 * @see https://github.com/pelotom/type-zoo/issues/37
 */
export type ExcludeStrict<T, U extends T> = T extends U ? never : T

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
 * Remove index signature from an object
 */
export type PickKnownKeys<T extends object> = Pick<T, KnownKeys<T>>

/**
 * Extract known keys from an object -- i.e. ignore index signature
 * @see https://stackoverflow.com/a/54568976
 */
export type KnownKeys<T extends object> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends {[_ in keyof T]: infer U}
  ? {} extends U
    ? never
    : U
  : never

/**
 * Remove keys with `never` value from an object
 */
export type PickNonNeverKeys<T extends object> = Pick<T, NonNeverKeys<T>>

/**
 * Extract keys that map to a non-never (non-undefined) value
 */
export type NonNeverKeys<T extends object> = Exclude<
  {[K in keyof T]: [T[K]] extends [undefined] ? never : K}[keyof T],
  undefined
>

/**
 * Extract optional property keys
 */
export type OptionalKeys<T extends object> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K
  }[keyof T],
  undefined
>

/**
 * Extract non-optional property keys
 */
export type NonOptionalKeys<T extends object> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? K : never
  }[keyof T],
  undefined
>

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
 * Returns the type that is wrapped inside an `Observable` type
 */
export type ObservableValue<TObservable> = TObservable extends rxjs.Observable<
  infer T
>
  ? T
  : never

/**
 * Like `PathsOf` but doesn't include number of string interpolations at the root
 */
export type MappablePathsOf<T, TMaxDepth extends number = 2> = NonNullable<
  {
    [P in keyof T]: T[P] extends infer V | null | undefined
      ? // Array
        number extends keyof V
        ? `${string & P}` | `${string & P}.length`
        : // Map
        string extends keyof V
        ? `${string & P}`
        : PathsOfProp<P, V, T, TMaxDepth>
      : never
  }[keyof T]
>

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

/**
 *  Access property using "dotted path"
 */
export type ValueAtPath<T, TPath extends string> = string extends TPath
  ? unknown
  : string extends keyof T
  ? TPath extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? ValueAtPath<UnionToIntersectionIfNeeded<NonNullable<T[K]>>, R>
      : unknown
    : unknown
  : TPath extends keyof T
  ? T[TPath]
  : TPath extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? ValueAtPath<UnionToIntersectionIfNeeded<NonNullable<T[K]>>, R>
    : unknown
  : unknown

type UnionToIntersectionIfNeeded<T> = keyof T extends never
  ? UnionToIntersection<T>
  : T

export type RecordValue<T> = T extends Record<string | number | symbol, infer U>
  ? U
  : never

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

export type NonVoid<T> = T extends undefined ? never : T

/**
 * Courtesy of https://dev.to/lucianbc/union-type-merging-in-typescript-9al
 * Not sure maybe it can be implemented with MergeUnion?
 * Also what's the diff between this vs. UnionToIntersection?
 */
export type MergeUnion<T extends object> = {
  [k in CommonKeys<T>]: PickTypeOf<T, k>
} & {
  [k in NonCommonKeys<T>]?: PickTypeOf<T, k>
}

/** Need to figure out the diff between this vs. MergeUnion */
export type MergeUnion2<T extends object> = {
  [k in AllKeys<T>]: PickType<T, k>
}

type CommonKeys<T extends object> = keyof T
type Subtract<A, C> = A extends C ? never : A
type NonCommonKeys<T extends object> = Subtract<AllKeys<T>, CommonKeys<T>>
type AllKeys<T> = T extends any ? keyof T : never
type PickType<T, K extends AllKeys<T>> = T extends {[k in K]?: any}
  ? T[K]
  : undefined
type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T>
  ? PickType<T, K>
  : never

export type {
  Class,
  Merge,
  Primitive,
  Promisable,
  PromiseValue,
  SetOptional,
  SetRequired,
  Simplify,
  Split,
  UnionToIntersection,
  ValueOf,
} from 'type-fest'
