import {orderedMapEquals, orderMapBy} from './ordered-map-utils'

test.each([
  [{a: 9, b: 8, c: 7}, {a: 9, b: 8, c: 7}, true],
  [{a: 9, b: 8, c: 7}, {c: 7, b: 8, a: 9}, false],
  [{a: 9, b: 8, c: 7}, {}, false],
])('orderedMapEquals(%o, %o) -> %p', (a, b, equals) => {
  expect(orderedMapEquals(a, b)).toBe(equals)
})

test('orderMapBy', () => {
  // Would like to have a custom matcher but it's just plain annoying :(
  // https://github.com/facebook/jest/issues/10329
  function expectEquals(
    a: OrderedMap<unknown>,
    b: OrderedMap<unknown>,
    equals = true,
  ) {
    expect(orderedMapEquals(a, b)).toEqual(equals)
  }

  expectEquals({a: 9, b: 8, c: 7}, {c: 7, b: 8, a: 9}, false)

  expectEquals(orderMapBy({a: 9, b: 8, c: 7}), {a: 9, b: 8, c: 7})

  expectEquals(orderMapBy({a: 9, b: 8, c: 7}, [(v) => v, 'asc']), {
    c: 7,
    b: 8,
    a: 9,
  })
  expectEquals(orderMapBy({a: 9, b: 8, c: 7}, [(v) => v, 'desc']), {
    a: 9,
    b: 8,
    c: 7,
  })

  expectEquals(
    orderMapBy({a: 3, b: 3, c: 1}, (v) => v, [(_, k) => k, 'desc']),
    {c: 1, b: 3, a: 3},
  )
})
