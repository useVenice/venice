import {DateTime, Interval} from 'luxon'
import {Options as _RRuleOptions, RRule, RRuleSet} from 'rrule'
import {MPDate, MPInterval} from './schrono'

/**
 * @deprecated. Please use schrono
 */

function _formatDate(input: DateTime | Date) {
  const dt =
    input instanceof Date
      ? MPDate.fromJSDate(input, {precision: 'day'})
      : MPDate.create(input, 'day', undefined)
  return dt.toDisplay()
}
// MARK: Range expressions

export function parseDateRangeExpression(input?: string | null) {
  if (!input) {
    return null
  }
  return MPInterval.parse(input)
}

export function formatDateRangeExpression(interval?: Interval | null) {
  if (!interval || !interval.isValid) {
    return null
  }

  return [
    _formatDate(interval.start),
    'to',
    _formatDate(interval.end.minus({milliseconds: 1})),
  ]
    .filter(Boolean)
    .join(' ') as DateRangeExpression
}

export function reformatDateRangeExpression(input?: string | null) {
  return formatDateRangeExpression(parseDateRangeExpression(input))
}

// MARK: Schedule expressions

/**
 * Inspired by https://hledger.org/hledger.html#period-expressions
 * Implemented in practice as 1 or 2 dates plus an RRule
 */
export type RRuleOptions = _RRuleOptions
/**
 * TODO: Combine Period/Frequency, which are simple enums
 */

export function makeRRuleSet(opts?: Partial<RRuleOptions>) {
  const set = new RRuleSet()
  if (!opts) {
    return set
  }
  set.rrule(new RRule(opts))
  return set
}

function makeRRule(opts: Partial<RRuleOptions>) {
  return new RRule(opts)
}

export function boundRRuleSetInInterval(
  origRRuleSet: RRuleSet,
  interval: Interval,
) {
  const rruleSet = makeRRuleSet()
  const fixedDate = origRRuleSet?.rdates()[0]
  const rrule = origRRuleSet?.rrules()[0]
  if (fixedDate) {
    if (interval.contains(DateTime.fromJSDate(fixedDate))) {
      rruleSet.rdate(fixedDate)
    }
  } else if (rrule) {
    const options = {...rrule.origOptions}
    if (
      !options.dtstart ||
      !interval.contains(DateTime.fromJSDate(options.dtstart))
    ) {
      options.dtstart = interval.start.toJSDate()
    }
    if (
      !options.until ||
      !interval.contains(DateTime.fromJSDate(options.until))
    ) {
      options.until = interval.end.toJSDate()
    }
    rruleSet.rrule(makeRRule(options))
  }
  return rruleSet
}

// Every month on 2nd tuesday should work
// Single day events should work
// every day should *not* turn into every day at 5
export function parseScheduleExpression(text?: string | null): RRuleSet | null {
  if (!text) {
    return null
  }
  const rruleSet = new RRuleSet()
  let rrule: RRule | null
  try {
    rrule = parseRRule(text)
  } catch (err) {
    if (err instanceof Error && !/expected every/.test(err.message)) {
      console.warn('Failed to parse RRule', text, err)
    }
    rrule = null
  }
  if (rrule) {
    // Would result in warning, figure out how to suppress it would be good
    rruleSet.rrule(rrule)
  } else {
    const dateTime = MPDate.parse(text)
    if (dateTime) {
      rruleSet.rdate(dateTime.toJSDate())
    }
  }
  if (rruleSet.rrules().length === 0 && rruleSet.rdates().length === 0) {
    // Has to have at least one rule / date, otherwise we consider to be invalid
    return null
  }
  return rruleSet
}

export function formatScheduleExpression(rruleSet?: RRuleSet | null) {
  if ((rruleSet?.rrules().length ?? 0) > 1) {
    console.warn(`RRuleSet has more than one rule, only first one will be used`)
  }
  const rrule = rruleSet?.rrules()?.[0]
  if (rrule) {
    return formatRRule(rrule)
  }
  const date = rruleSet?.rdates()?.[0]
  return date ? _formatDate(date) : null
}

export function reformatScheduleExpression(text?: string) {
  const rrule = parseScheduleExpression(text)
  if (!rrule) {
    return null
  }
  return formatScheduleExpression(rrule) as ScheduleExpression
}

function formatRRule(rrule?: RRule | null) {
  if (!rrule) {
    return null
  }
  // Only respect start and until in origOptions
  const {dtstart, until} = rrule.origOptions
  const {
    //#region Intentionally ignored
    dtstart: _dtstart,
    until: _until,
    byhour,
    byminute,
    bysecond,
    //#endregion Intentionally ignored
    ...options
  } = rrule.options
  const hackRule = new RRule(options)
  if (!hackRule.isFullyConvertibleToText()) {
    console.warn(`RRule is not fully convertible to text`, hackRule.options)
  }

  let text = hackRule.toText()

  if (dtstart) {
    text = `${text} from ${_formatDate(dtstart)}`
  } else {
    // Hack: Otherwise rrule automatically adds dtstart with today
    // Which is not desirable in our case
    text = text.replace(/from.+/, '').trim()
  }
  if (until) {
    text = `${text} until ${_formatDate(until)}`
  }
  return text as ScheduleExpression
}

function parseRRule(text?: string | null) {
  if (!text) {
    return null
  }
  const toRegex = /\bto|until|till\b/i
  const fromRegex = /\bfrom|since\b/i

  // Custom handling for from / to
  let [ruleText, fromText] = text.split(fromRegex) as [string, string?]
  let toText = ''

  if (toRegex.test(ruleText)) {
    const [r, t] = ruleText.split(toRegex) as [string, string]
    ruleText = r
    toText = t
  } else if (fromText?.match(toRegex)) {
    const [f, t] = fromText.split(toRegex) as [string, string]
    fromText = f
    toText = t
  }

  // Custom handling for common expressions
  ruleText = ruleText.replace(/\bdaily\b/i, 'every day')
  ruleText = ruleText.replace(/\bweekly\b/i, 'every week on Monday')
  ruleText = ruleText.replace(/\bbiweekly\b/i, 'every 2 weeks on Monday')
  ruleText = ruleText.replace(/\bmonthly\b/i, 'every month on the 1st')
  ruleText = ruleText.replace(/\bbimonthly\b/i, 'every 2 months on the 1st')
  ruleText = ruleText.replace(/\bquarterly\b/i, 'every 3 months on the 1st') // not quite right, fix me
  ruleText = ruleText.replace(/\byearly\b/i, 'every January on the 1st')
  ruleText = ruleText.replace(/\bannually\b/i, 'every January on the 1st')

  // Every other week should work
  ruleText = ruleText.replace(/\bother\b/i, '2')

  const options = RRule.parseText(ruleText)
  if (!options) {
    return null
  }

  options.dtstart = fromText ? MPDate.parse(fromText)?.toJSDate() : undefined
  options.until = MPDate.parse(toText)?.toJSDate()

  return new RRule(options)
}
