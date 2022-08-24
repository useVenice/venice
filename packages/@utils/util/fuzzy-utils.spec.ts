import {sort} from './array-utils'
import {fuzzyMatch, fuzzyTest} from './fuzzy-utils'

describe('fuzzyMatch', () => {
  test('given no query returns a truthy match', () => {
    expect(fuzzyMatch('', 'anything')).toMatchObject({
      match: true,
      ranges: [{start: 0, stop: 8}],
      score: 1,
    })
  })

  test('given no source returns a falsy match', () => {
    expect(fuzzyMatch('foo', '')).toMatchObject({
      match: false,
      ranges: [],
      score: 0,
    })
  })

  test('given no source returns a truthy match if both strings are empty', () => {
    expect(fuzzyMatch('', '')).toMatchObject({
      match: true,
      ranges: [{start: 0, stop: 0}],
      score: 1,
    })
  })

  test('given a query bigger than source returns a falsy match', () => {
    expect(fuzzyMatch('foo', 'f')).toMatchObject({
      match: false,
      ranges: [],
      score: 0,
    })
  })

  test('given a matching query returns a truthy match', () => {
    expect(fuzzyMatch('cash idr', 'FR Cash/IDR')).toMatchObject({
      match: true,
    })
    expect(fuzzyMatch('abc', 'Ananas Banana Caramel')).toMatchObject({
      match: true,
    })
    expect(fuzzyMatch('abc', 'ananas banana caramel')).toMatchObject({
      match: true,
    })
    expect(fuzzyMatch('abc', 'abc')).toMatchObject({
      match: true,
    })
  })

  test('given a non-matching query returns a falsy match', () => {
    expect(fuzzyMatch('abc', 'foobar')).toMatchObject({
      match: false,
      ranges: [],
      score: 0,
    })
  })

  test('given a matching query returns correct ranges', () => {
    expect(fuzzyMatch('a', 'Ananas Banana Caramel')).toMatchObject({
      match: true,
      ranges: [{start: 0, stop: 1}],
    })
    expect(fuzzyMatch('ab', 'Ananas Banana Caramel')).toMatchObject({
      match: true,
      ranges: [
        {start: 0, stop: 1},
        {start: 7, stop: 8},
      ],
    })
    expect(fuzzyMatch('anaba', 'Ananas Banana Caramel')).toMatchObject({
      match: true,
      ranges: [
        {start: 0, stop: 3},
        {start: 7, stop: 9},
      ],
    })
  })

  test('given a matching query returns correct scores', () => {
    expect(fuzzyMatch('a', 'Ananas Banana Caramel')).toMatchObject({
      match: true,
      score: 10,
    })
    expect(fuzzyMatch('ab', 'Ananas Banana Caramel')).toMatchObject({
      match: true,
      score: 1,
    })
    expect(fuzzyMatch('abc', 'Ananas Banana Caramel')).toMatchObject({
      match: true,
      score: 12,
    })
    expect(fuzzyMatch('anbaca', 'Ananas Banana Caramel')).toMatchObject({
      match: true,
      score: 30,
    })
    expect(fuzzyMatch('an ba cal', 'Ananas Banana Caramel')).toMatchObject({
      match: true,
      score: 43,
    })
    expect(fuzzyMatch('anabancar', 'Ananas Banana Caramel')).toMatchObject({
      match: true,
      score: 48,
    })
  })

  test('sorting example', () => {
    const sources = ['Reconnect connection', 'Revoke connection']
    expect(
      sort(sources).desc((source) => {
        const res = fuzzyMatch('reconnec', source)
        return res.score
      }),
    ).toMatchObject(sources)
  })

  test('sorting example 2', () => {
    const sources = [
      'Categorize',
      'Categorize and create rule',
      'Reset category',
    ]
    expect(
      sort(sources).desc((source) => {
        const res = fuzzyMatch('categ', source)
        return res.score
      }),
    ).toMatchObject(sources)
  })
})

describe('fuzzyTest', () => {
  it('given no query returns true', () => {
    expect(fuzzyTest('', 'anything')).toBe(true)
  })

  it('given no source returns false', () => {
    expect(fuzzyTest('foo', '')).toBe(false)
  })

  it('given no source returns true if both strings are empty', () => {
    expect(fuzzyTest('', '')).toBe(true)
  })

  it('given a query bigger than source returns false', () => {
    expect(fuzzyTest('foo', 'f')).toBe(false)
  })

  it('given a matching query returns true', () => {
    expect(fuzzyTest('abc', 'Ananas Banana Caramel')).toBe(true)
    expect(fuzzyTest('abc', 'ananas banana caramel')).toBe(true)
    expect(fuzzyTest('abc', 'abc')).toBe(true)
  })

  it('given a matching non-ASCII query and an ASCII source returns true', () => {
    expect(fuzzyTest('föÔ', 'foo')).toBe(true)
  })

  it('given a non-matching non-ASCII query and an ASCII source returns false', () => {
    expect(fuzzyTest('föÔ', 'foz')).toBe(false)
  })

  it('given a matching ASCII query and a non-ASCII source returns true', () => {
    expect(fuzzyTest('foo', 'föÔ')).toBe(true)
  })

  it('given a non-matching ASCII query and a non-ASCII source returns false', () => {
    expect(fuzzyTest('foz', 'föÔ')).toBe(false)
  })

  it('given a matching non-ASCII query and a non-ASCII source returns true', () => {
    expect(fuzzyTest('fôö', 'föô')).toBe(true)
  })
})
