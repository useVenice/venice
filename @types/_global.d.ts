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

// MARK: - Amount types

declare interface AmountMeta {
  color?: string
}
declare interface Amount {
  unit: Unit
  quantity: number
  meta?: AmountMeta
}
declare interface MultiAmount {
  amounts: Amount[]
}

/**
 * Map from unit -> quantity
 * TODO: Turn me into the new MultiAmount?
 * TODO: Should this be ReadOnly to reduce mistake?
 */
type AmountMap = Record<string, number> // Should we add a __brand__ to this?

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
 * Make a runtime mapping type for a literal union
 */
declare type EnumOf<E extends string | number | symbol> = {[K in E]: K}

/** Same as EnumOf, but values are for display rather than key */
declare type DisplayOf<E extends string | number | symbol> = {[K in E]: string}

/**
 * Distribute the Omit across a union
 * @see https://davidgomes.com/pick-omit-over-union-types-in-typescript/
 */
declare type DistributiveOmit<
  T,
  K extends keyof T,
> = import('@ledger-sync/util').DistributiveOmit<T, K>

/**
 * Rely on javascript natural order
 */
declare type OrderedMap<T, TKey extends string = string> = Record<TKey, T>

// For tests only

declare namespace jest {
  interface Matchers<R> {
    toEqualBalances(expected: import('@ledger-sync/util').Balances): R
  }
}
