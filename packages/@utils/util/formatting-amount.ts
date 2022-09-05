// TODO: Add support for formatting with unit support, such as 100k or $1m
// This would be especially useful in tight spaces like charts and reports
// This should probably exist in the format-decimal layer and get used over here
// Should be supported in both intlFormat and customFormat layer
// MARK: Built in commodities
import type {AnyAmount} from './amount-utils'
import {A, toAmountOrMultiAmount, toAmounts} from './amount-utils'
import type {StrictIntlNumberFormatOptions} from './formatting-number'
import {formatDecimal, getIntlNumberFormat} from './formatting-number'
import {DBL_EPSILON} from './math-utils'
import {
  currencies as ISO_CURRENCIES,
  map as ISO_CURRENCY_SYMBOL_TO_INFO,
} from '@blossomfinance/iso-4217-currencies'
import pluralize from 'pluralize'

/** Will format into an unambiguous format */
export function legacy_parsableFormatAmount(
  amount?: Amount | MultiAmount | AmountMap | null,
  {separator}: {separator?: string} = {},
) {
  return amount == null
    ? ''
    : legacy_formatAmount(amount, {
        separator,
        useGrouping: false,
        currencySign: 'standard',
      })
}

export type Legacy_FormatAmountOptions = StrictIntlNumberFormatOptions & {
  omitUnit?: boolean
  locales?: string | string[] | undefined
  invert?: boolean
  separator?: string
}

export function legacy_formatAmount(
  amountOrQuantity: AnyAmount | number,
  {separator = ';', ...restOpts}: Legacy_FormatAmountOptions = {},
): string {
  const amount =
    typeof amountOrQuantity === 'number'
      ? A(amountOrQuantity, '')
      : toAmountOrMultiAmount(amountOrQuantity)

  if ('amounts' in amount) {
    return amount.amounts.length === 0
      ? // Do not use decimal here. Better to format as empty
        ''
      : amount.amounts
          .map((a) => _legacy_formatAmount(a, {...restOpts, omitUnit: false}))
          .join(`${separator.trim()} `)
  }

  return _legacy_formatAmount(amount, restOpts)
}

export function _legacy_formatAmount(
  _amount: Amount,
  opts: Omit<Legacy_FormatAmountOptions, 'separator'> = {},
) {
  const amount = fixFloatingPointError(_amount)
  let ret = formatDecimal(amount.quantity * (opts.invert ? -1 : 1), {
    ...opts,
    minimumFractionDigits:
      opts.minimumFractionDigits ??
      minPrecisionForAmountQuantity(amount.quantity),
    maximumFractionDigits:
      opts.maximumFractionDigits ??
      maxPrecisionForAmountQuantity(amount.quantity),
  })
  if (amount.unit !== '' && !opts.omitUnit) {
    ret += ` ${amount.unit}`
  }
  const currencySign = opts.currencySign ?? 'accounting'
  if (currencySign === 'accounting' && ret.startsWith('-')) {
    ret = `(${ret.slice(1)})`
  }
  return ret
}

export function minPrecisionForAmountQuantity(quantity: number) {
  if (Math.abs(quantity) > 1 || quantity === 0) {
    return 2
  }

  const fracDigits = quantity.toFixed(10).split('.')[1]?.split('') ?? []
  let padding = 0
  for (const [index, digit] of fracDigits.entries()) {
    if (digit !== '0') {
      padding = index + 1
      break
    }
  }

  return Math.min(10, padding)
}

export function maxPrecisionForAmountQuantity(quantity: number) {
  return Math.abs(quantity) > 1 || quantity === 0 ? 2 : 10
}

// Fixes floating point errors in numbers like -399.99999999356993
export function fixFloatingPointError(amount: Amount) {
  const quantity = amount.quantity
  if (
    Math.floor(quantity + DBL_EPSILON) !== Math.floor(quantity) ||
    Math.floor(quantity - DBL_EPSILON) !== Math.floor(quantity)
  ) {
    return {
      ...amount,
      quantity: Number.parseFloat(
        Number.parseFloat(String(quantity)).toFixed(4),
      ),
    }
  }
  return amount
}

// MARK: New amount formatting module used in Tabs to be moved back to Alka

export interface _IntlFormatAmountOptions
  extends StrictIntlNumberFormatOptions {
  locales?: string | string[]
}

export interface _CustomFormatAmountOptions extends _IntlFormatAmountOptions {
  formatCommodity?: (unit: Unit) => string
  pluralize?: boolean
}

export interface FormatAmountOptions extends _CustomFormatAmountOptions {
  separator?: string
}

export function formatAmount(
  amt: AnyAmount,
  {separator = '; ', ...opts}: FormatAmountOptions = {},
) {
  return toAmounts(amt)
    .map((a) => _formatSingleAmount(a, opts))
    .join(separator)
}

export function _formatSingleAmount(
  amount: Amount,
  {
    formatCommodity,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    pluralize,
    ...intlOpts
  }: _CustomFormatAmountOptions = {},
) {
  try {
    return _intlFormatAmount(amount, intlOpts)
  } catch (err) {
    // What is the performance implication of throw? Do we want to proactively check?
    if (!(err instanceof RangeError && err.message.includes('currency'))) {
      // multiple error message possibilities, include 'Invalid currency',
      // And 'currency is not a well-formed currency code
      console.error(err)
    }
    // Always fall back to custom format anyways, should as much as possible never crash
    return _customFormatAmount(amount, {
      ...intlOpts,
      formatCommodity,
      pluralize,
    })
  }
}

export function _intlFormatAmount(
  amount: Amount,
  {locales, ...opts}: _IntlFormatAmountOptions = {},
) {
  // WARNING: narrowSymbol can be a problem because CA$ and US$ can no longer be told apart...
  let currencyDisplay = opts.currencyDisplay ?? 'symbol'
  // Special case for IDR, whose symbol is `IDR` rather than `Rp`
  if (amount.unit === 'IDR' && currencyDisplay === 'symbol') {
    currencyDisplay = 'narrowSymbol'
  }
  const fmt = getIntlNumberFormat(locales, {
    ...opts,
    style: 'currency',
    currency: amount.unit,
    currencyDisplay,
    minimumFractionDigits:
      opts.minimumFractionDigits ?? getMinimumFractionDigits(amount.unit),
  })
  return fmt.format(amount.quantity)
}

/** Commodity will be suffixed */
export function _customFormatAmount(
  amount: Amount,
  {
    formatCommodity,
    pluralize: _pluralize,
    ...opts
  }: _CustomFormatAmountOptions = {},
) {
  const number = formatDecimal(amount.quantity, opts)
  const commDisplay = formatCommodity
    ? formatCommodity(amount.unit)
    : amount.unit // Lowercase is thus allowed, no need for uppercase first
  const pluraizedCommDisplay = _pluralize
    ? pluralize(commDisplay, amount.quantity)
    : commDisplay

  return `${number} ${pluraizedCommDisplay}`
}

// TODO: Support top crypto currencies as well in addition to physical currencies
export const STANDARD_CURRENCY_SYMBOL_TO_INFO = ISO_CURRENCY_SYMBOL_TO_INFO

export const STANDARD_CURRENCIES = ISO_CURRENCIES

export function getCurrencyInfo(symbol: string) {
  // TODO: Should this be locale dependent? So in Canada USD should be `US$`
  // but according to iso4217 it is `$`.
  // This means that there will be formatting inconsistency as it stands between
  // output vs. input
  // Consider hacking the Intl API to return a standard commodity that takes it into account
  return STANDARD_CURRENCY_SYMBOL_TO_INFO[symbol]
}

export function getMinimumFractionDigits(symbol: string) {
  return getCurrencyInfo(symbol)?.decimalDigits ?? 0
}
