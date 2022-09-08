import {maxBy, minBy} from 'lodash'
import {DateTime} from 'luxon'
import {format as formatTimeAgo} from 'timeago.js'
import {catchAsNull, memoizeBy} from './function-utils'
import {shallowEqual} from './object-utils'
import {MPDate} from './schrono'

/**
 * @deprecated. Please use schrono
 */

// Fwiw new Date(1e11*1000) === '5138-11-16T09:46:40.000Z'
// maybe we can somehow tell seconds from milliseconds if num > 1e11?

export type PossibleDate =
  | number // Assume millis since epoch
  | string // Assume ISO
  | Date // JS Date
  | DateTime // Luxon Date
  | {seconds: number; nanoseconds: number} // Firestore timestamp

export function parseDateTime(value: PossibleDate): DateTime {
  const dt =
    (typeof value === 'number' && DateTime.fromMillis(value)) ||
    (typeof value === 'string' && MPDate.parse(value)) ||
    (value instanceof Date && DateTime.fromJSDate(value)) ||
    (value instanceof DateTime && value) ||
    (typeof value === 'object' &&
      'nanoseconds' in value &&
      DateTime.fromMillis(value.seconds * 1000 + value.nanoseconds / 1000000))
  if (!dt) {
    throw new Error(`Invalid datetime ${value}`)
  }
  return dt
}

export function parseOptionalDateTime(value: PossibleDate | null | undefined) {
  return catchAsNull(() => (value ? parseDateTime(value) : null))
}

export function parseOptionalDate(value: PossibleDate | null | undefined) {
  return parseOptionalDateTime(value)?.toJSDate()
}

export function parseOptionalISODateTime(
  value: PossibleDate | null | undefined,
) {
  return parseOptionalDateTime(value)?.toISO()
}

export function parseOptionalISODate(value: PossibleDate | null | undefined) {
  return parseOptionalDateTime(value)?.toISODate()
}

export const getDateTimeFormat = memoizeBy(
  (
    locales: string | string[] | undefined,
    options: Intl.DateTimeFormatOptions,
  ) => new Intl.DateTimeFormat(locales, options),
  (prev, next) =>
    shallowEqual(prev[0], next[0]) && shallowEqual(prev[1], next[1]),
)

export type FormatDateAs =
  | 'year'
  | 'quarter'
  | 'month'
  | 'week'
  | 'day'
  | 'date'
  | 'date_tabular'
  | 'datetime'
  | 'datetime_smart'
  | 'relative'

/** TODO: Clean me up a bit, shall format mixed precision date */
export function formatIsoDate(value: ISODate | ISODateTime, as?: FormatDateAs) {
  return as
    ? formatDate(value, as)
    : MPDate.parse(value as MixedPrecisionDateExpression)?.toDisplay() ??
        formatDate(value)
}

/** No longer guarantees `date`. This is now either date or time. */
export function formatDate(value: PossibleDate, as?: FormatDateAs) {
  const dt = parseDateTime(value)
  switch (as) {
    case 'year':
      return dt.toUTC().toFormat('yyyy')
    case 'quarter':
      return `Q${dt.toUTC().toFormat('q yyyy')}`
    case 'month':
      return dt.toUTC().toFormat('LLL yyyy')
    case 'week':
      return `Week of ${dt.toUTC().toFormat('DD')}`
    // ISO week number, unpadded
    // return `W${DateTime.fromISO(periodStart).toFormat('W yyyy')}`
    case 'day':
      // Localized date with abbreviated month
      return dt.toUTC().toFormat('DD')
    case 'date':
      return dt.toUTC().toLocaleString(DateTime.DATE_MED)
    case 'date_tabular':
      return dt.toUTC().toFormat('MMM dd, yyyy')
    case 'datetime':
      return dt.toLocal().toLocaleString(DateTime.DATETIME_MED)
    case 'datetime_smart': {
      const now = DateTime.local()
      return dt > now.startOf('day')
        ? formatTimeAgo(dt.toLocal().toJSDate())
        : dt.toLocal().toLocaleString(DateTime.DATETIME_MED)
    }
    case 'relative':
      return formatTimeAgo(dt.toLocal().toJSDate())
  }
  // Format firestore dates more precisely.
  if (typeof value === 'object' && 'nanoseconds' in value) {
    // TODO: We should format relative by default and format
    // as absolute on mouse-over as a convention
    return dt.toLocal().toFormat('ff')
  }
  return dt.toUTC().toFormat('MMM d, yyyy')
}

export function minDateTime(
  dates: Array<PossibleDate | null | undefined>,
): DateTime | undefined {
  return minBy(
    dates
      .map(parseOptionalDateTime)
      .filter((dt): dt is NonNullable<typeof dt> => !!dt),
    (dt) => dt,
  )
}

export function maxDateTime(
  dates: Array<PossibleDate | null | undefined>,
): DateTime | undefined {
  return maxBy(
    dates
      .map(parseOptionalDateTime)
      .filter((dt): dt is NonNullable<typeof dt> => !!dt),
    (dt) => dt,
  )
}

export * from 'luxon'
