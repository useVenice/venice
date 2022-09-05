import type {ArrayLike} from './array-utils'
import {arrayFromReverse, commonPrefix, getPageFromArray} from './array-utils'

test.each([
  [[0, 1, 2, 3], undefined, undefined, []],
  [[0, 1, 2, 3], -1, 0, [0, 1, 2, 3]],
  [[0, 1, 2, 3], 0, 0, []],
  [[0, 1, 2, 3], 1, 0, [0]],
  [[0, 1, 2, 3], 1, 1, [1]],
  [[0, 1, 2, 3], 2, 1, [2, 3]],
  [[0, 1, 2, 3], Number.POSITIVE_INFINITY, 0, [0, 1, 2, 3]],
  [[0, 1, 2, 3], Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, []],
  [[0, 1, 2, 3], 0, Number.POSITIVE_INFINITY, []],
])('getPageFromArray(%p, %o, %o) -> %p', (items, pageSize, page, output) => {
  expect(getPageFromArray({items, pageSize, page})).toEqual(output)
})

test.each([
  [
    [0, 1, 2, 3],
    [3, 2, 1, 0],
  ],
  [[], []],
  [[1], [1]],
])('arrayFromReverse(%p) -> %p', (input, output) => {
  expect(arrayFromReverse(input)).toEqual(output)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
test.each<[input: [any, ...any[]], output: ArrayLike<any>]>([
  [['Session', 'Sessions'], 'Session'],
  [['USD', 'USDS'], 'USD'],
  [['thesis', 'thEses'], 'th'],
  [['flower', 'flow', 'flight'], 'fl'],
  [['', 'flow', 'flight'], ''],
  [['', 'flow', 'flight'], ''],
  [[''], ''],
  [
    [
      [1, 2, 3],
      [1, 2, 4],
    ],
    [1, 2],
  ],
  [[[], [1, 2, 4]], []],
])('commonPrefix(%j) -> %p', (input, output) => {
  expect(commonPrefix(...input)).toEqual(output)
})
