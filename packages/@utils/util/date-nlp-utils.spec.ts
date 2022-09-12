import {advanceTo, clear} from 'jest-date-mock'
import {DateTime} from 'luxon'
import {RRule} from 'rrule'

import type {RRuleOptions} from './date-nlp-utils'
import {
  boundRRuleSetInInterval,
  formatScheduleExpression,
  makeRRuleSet,
  parseDateRangeExpression,
  parseScheduleExpression,
  reformatScheduleExpression,
} from './date-nlp-utils'
import {formatDate, parseOptionalISODate} from './date-utils'

const now = DateTime.fromISO('2020-04-13', {zone: 'utc'})

beforeAll(() => {
  advanceTo(now.toJSDate())
})

afterAll(() => {
  clear()
})

test('damn it timezones', () => {
  const pt = DateTime.fromISO('2020-06-01', {zone: 'America/Los_Angeles'})
  expect(pt.toISODate()).toBe('2020-06-01')
  expect(pt.zoneName).toBe('America/Los_Angeles')
  expect(pt.toISO()).toBe('2020-06-01T00:00:00.000-07:00')

  expect(pt.toUTC().toISODate()).toBe('2020-06-01')
  expect(pt.toUTC().zoneName).toBe('UTC')
  expect(pt.toUTC().toISO()).toBe('2020-06-01T07:00:00.000Z')

  const utc = DateTime.fromISO('2020-06-01', {zone: 'utc'})
  expect(utc.toISO()).toBe('2020-06-01T00:00:00.000Z')
  expect(utc.setZone('America/Los_Angeles').toISO()).toBe(
    '2020-05-31T17:00:00.000-07:00',
  )

  expect(
    utc.setZone('America/Los_Angeles', {keepLocalTime: true}).toISO(),
  ).toBe('2020-06-01T00:00:00.000-07:00')
  expect(
    DateTime.fromISO(utc.toISODate(), {zone: 'America/Los_Angeles'}).toISO(),
  ).toBe('2020-06-01T00:00:00.000-07:00')

  expect(DateTime.fromISO('2020-06-01T00:00:00Z', {zone: 'utc'}).zoneName).toBe(
    'UTC',
  )
  expect(
    DateTime.fromISO('2020-06-01T00:00:00Z', {zone: 'utc'}).toFormat(
      'MMM d, yyyy',
    ),
  ).toBe('Jun 1, 2020')

  expect(formatDate('2020-06-01')).toBe('Jun 1, 2020')
})

describe('Schedule expressions', () => {
  test('basic with until', () => {
    const rrule = new RRule({
      freq: RRule.MONTHLY,
      until: new Date('2020-05-05'),
    })
    expect(rrule.toText()).toBe('every month until May 5, 2020')
  })

  function validateRRuleRoundtrip(options: Partial<RRuleOptions>) {
    const r1 = makeRRuleSet(options)
    const r1Text = formatScheduleExpression(r1)
    const r2 = parseScheduleExpression(r1Text)
    expect(r2?.origOptions).toEqual(r1.origOptions)
  }

  function validateTextRoundtrip(text: string, outText?: string) {
    expect(reformatScheduleExpression(text)).toEqual(outText ?? text)
  }

  function validateRawRRuleTextRoundTrip(text: string, outText?: string) {
    const rrule = RRule.fromText(text)
    expect(rrule.toText()).toEqual(outText ?? text)
  }

  test('single day', () => {
    validateTextRoundtrip('jan 5, 2020', 'Jan 5, 2020')
  })

  test('daily', () => {
    validateRRuleRoundtrip({freq: RRule.DAILY})
    validateTextRoundtrip('every day')
    validateTextRoundtrip('daily', 'every day')
  })

  test('weekly', () => {
    validateRRuleRoundtrip({freq: RRule.WEEKLY})
    validateTextRoundtrip(
      'every week',
      `every week on ${DateTime.utc().weekdayLong}`,
    )
    validateTextRoundtrip('weekly', 'every week on Monday')
  })

  test('parse natural rrule and unparse', () => {
    validateTextRoundtrip(
      'every month on the 5th, 6th and 7th until may 5, 2020',
      'every month on the 5th, 6th and 7th until May 5, 2020',
    )
  })

  test('dtstart is used as start date when no by* field is specified', () => {
    // expect(rrule.toText()).toEqual('every month until May 4, 2020')
    expect(
      new RRule({
        freq: RRule.MONTHLY,
        dtstart: new Date('2020-01-03'),
        until: new Date('2020-05-02'),
      })
        .all()
        .map((d) => d.toISOString().slice(0, 10)),
    ).toEqual(['2020-01-03', '2020-02-03', '2020-03-03', '2020-04-03'])
  })

  test('dtstart is used as bound when by* fields is specified', () => {
    // expect(rrule.toText()).toEqual('every month until May 4, 2020')
    expect(
      new RRule({
        freq: RRule.MONTHLY,
        bymonthday: [5],
        dtstart: new Date('2020-01-03'),
        until: new Date('2020-05-02'),
      })
        .all()
        .map((d) => d.toISOString().slice(0, 10)),
    ).toEqual(['2020-01-05', '2020-02-05', '2020-03-05', '2020-04-05'])
  })

  // Custom alka functionality

  test('day of month', () => {
    validateRawRRuleTextRoundTrip('every month on the 10th')
    validateTextRoundtrip(
      'every month from Jan 10, 2020',
      'every month on the 10th from Jan 10, 2020',
    )
    validateTextRoundtrip('every month on the 10th')
  })

  test('parse from/since and to/until', () => {
    const rruleSet = parseScheduleExpression(
      'every month from jan 10, 2020 until mar 30, 2020',
    )
    const rrule = rruleSet?.rrules()?.[0]

    expect(parseOptionalISODate(rrule?.options.dtstart)).toBe('2020-01-10')
    expect(parseOptionalISODate(rrule?.options.until)).toBe('2020-03-30')
    expect(rrule?.options.freq).toEqual(RRule.MONTHLY)

    expect(formatScheduleExpression(rruleSet)).toBe(
      'every month on the 10th from Jan 10, 2020 until Mar 30, 2020',
    )
    expect(rruleSet?.all().map((d) => d.toISOString().slice(0, 10))).toEqual([
      '2020-01-10',
      '2020-02-10',
      '2020-03-10',
    ])
  })

  test('parse from/since and to/until (for ayan)', () => {
    const rrule = parseScheduleExpression(
      'every month on the first tuesday from jan 1 till march 30',
    )
    expect(rrule?.all().map((d) => d.toISOString().slice(0, 10))).toEqual([
      '2020-01-07',
      '2020-02-04',
      '2020-03-03',
    ])
  })

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('parse from/since and to/until (for ayan again)', () => {
    const rrule = parseScheduleExpression(
      'every month on the first tuesday from two weeks ago till 3 months from now',
    )
    expect(rrule?.all().map((d) => d.toISOString().slice(0, 10))).toEqual([
      '2020-04-07',
      '2020-05-05',
      '2020-06-02',
      '2020-07-07',
    ])
  })

  // eslint-disable-next-line jest/no-identical-title
  test('parse from/since and to/until', () => {
    const rrule = parseScheduleExpression(
      'every day from jan 1 2020 until jan 15 2020',
    )
    expect(rrule?.all().map((d) => d.toISOString().slice(0, 10))).toEqual([
      '2020-01-01',
      '2020-01-02',
      '2020-01-03',
      '2020-01-04',
      '2020-01-05',
      '2020-01-06',
      '2020-01-07',
      '2020-01-08',
      '2020-01-09',
      '2020-01-10',
      '2020-01-11',
      '2020-01-12',
      '2020-01-13',
      '2020-01-14',
      '2020-01-15',
    ])
  })

  test.todo('parse in year/month/quarter')

  test.todo('parse count token after range token')

  // TODO: Fix up NLP for every month on 2nd tuesday type of expression
  test('FIXME: monthly on 2nd Wednesday is not yet supported :(', () => {
    const rrule = RRule.fromString(
      'FREQ=MONTHLY;BYSETPOS=2;BYDAY=WE;INTERVAL=1;DTSTART=20200101T000000Z',
    )
    // This is the correct behavior
    expect(
      rrule.all((_, i) => i < 10).map((d) => d.toISOString().slice(0, 10)),
    ).toEqual([
      '2020-01-08',
      '2020-02-12',
      '2020-03-11',
      '2020-04-08',
      '2020-05-13',
      '2020-06-10',
      '2020-07-08',
      '2020-08-12',
      '2020-09-09',
      '2020-10-14',
    ])
    // Bad! we want `every month on the 2nd Wednesday`
    expect(rrule.toText()).toBe('every month on Wednesday')
  })

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  test('bounding rrule by interval', () => {
    const interval = parseDateRangeExpression('Jan 1, 2020 to Dec 1, 2020')!
    const rruleSet = parseScheduleExpression('every month on the 1st')!

    const bounded = boundRRuleSetInInterval(rruleSet, interval)

    expect(bounded.all().map((d) => d.toISOString().slice(0, 10))).toEqual([
      '2020-01-01',
      '2020-02-01',
      '2020-03-01',
      '2020-04-01',
      '2020-05-01',
      '2020-06-01',
      '2020-07-01',
      '2020-08-01',
      '2020-09-01',
      '2020-10-01',
      '2020-11-01',
      '2020-12-01',
    ])
  })

  test('bounding rdate by interval', () => {
    const interval = parseDateRangeExpression('Jan 1, 2020 to Dec 1, 2020')!
    const rruleSet = parseScheduleExpression('dec 1, 2019')!

    const bounded = boundRRuleSetInInterval(rruleSet, interval)

    expect(bounded.all().map((d) => d.toISOString().slice(0, 10))).toEqual([])
  })
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
})
