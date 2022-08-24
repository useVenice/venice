import {AM, parseAmountMap, parseMoney} from './amount-utils'

test('AmountMap equals', () => {
  expect(AM.equals({}, {})).toBe(true)
  expect(AM.equals({USD: 0}, {EUR: 0})).toBe(true)

  expect(AM.equals({USD: 0}, {EUR: 1})).toBe(false)

  expect(AM.equals({USD: 5.1234567890123456}, {USD: 5.123456789012345})).toBe(
    true,
  )
})

test.each([
  ['US$12000.00', 12000],
  ['MX$12000.00', 12000],
  ['CA$12000.00', 12000],
  ['AU$12000.00', 12000],
])('parseMoney("%s") -> %o', (input, output) => {
  expect(parseMoney(input)).toEqual(output)
})

test.each([
  ['', {}, {}],
  ['100 USD', {}, {USD: 100}],
  ['100 USD; 50000 IDR', {}, {USD: 100, IDR: 50000}],
  ['100 USD | 50000 IDR', {separator: '|'}, {USD: 100, IDR: 50000}],
])('parseAmountMap("%s") -> %o', (input, options, output) => {
  expect(parseAmountMap(input, options)).toEqual(output)
})
