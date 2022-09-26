// MARK: - Hint types

// TODO: Switch all impl below to BrandedString
declare type ISODate = string
declare type ISOTime = string
declare type ISODateTime = string
declare type ISOInterval = string

declare type Unit = BrandedString<'Unit'>
declare type ScheduleExpression = BrandedString<'ScheduleExpression'>
declare type DateRangeExpression = BrandedString<'DateRangeExpression'>
declare type MathExpression = BrandedString<'MathExpression'>
declare type MixedPrecisionDateExpression =
  BrandedString<'MixedPrecisionDateExpression'>

// MARK: - Utility types

// TODO: Revise once https://github.com/microsoft/TypeScript/pull/33290 lands
declare interface Brand<B> {
  readonly __brand__: B
}
declare type Branded<T, B> = T & Brand<B>
declare type BrandedString<B> = Branded<string, B>

/**
 * Based on https://github.com/microsoft/TypeScript/issues/202#issuecomment-811246768
 * Currently causes lots of type errors, hence not being used
 */
declare class BrandedString2<B> extends String {
  protected readonly __brand__: B
  // This object is already an opaque a string, but calling this makes method
  // makes tsc recognize it as a string
  toString(): string
}

/**
 * Rely on javascript natural order
 */
declare type OrderedMap<T, TKey extends string = string> = Record<TKey, T>

// For tests only

declare namespace jest {
  interface Matchers<R> {
    toEqualBalances(expected: import('@usevenice/util').Balances): R
  }
}
