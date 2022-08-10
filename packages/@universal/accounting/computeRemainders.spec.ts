import {A} from '@alka/util'
import {computeRemainders} from './computeRemainders'

test('sanity check', () => {
  expect(
    computeRemainders({postings: [], remainderDate: '2020-01-01'}),
  ).toEqual({
    remainder: {},
    remainderByDate: {},
  })
})

test('remainder overall only', () => {
  expect(
    computeRemainders({
      postings: [{date: '2020-01-01', amount: A(100, 'USD')}],
      remainderDate: '2020-01-01',
    }),
  ).toEqual({
    remainder: {USD: -100},
    remainderByDate: {'2020-01-01': {USD: 0}},
  })
})

test('remainder by date only', () => {
  expect(
    computeRemainders({
      postings: [
        {date: '2020-01-01', amount: A(100, 'USD')},
        {date: '2020-01-02', amount: A(-100, 'USD')},
      ],
      remainderDate: '2020-01-03',
    }),
  ).toEqual({
    remainder: {USD: 0},
    remainderByDate: {'2020-01-01': {USD: -100}, '2020-01-02': {USD: 100}},
  })
})

test('remainder both overall and by date', () => {
  expect(
    computeRemainders({
      postings: [{date: '2020-01-01', amount: A(100, 'USD')}],
      remainderDate: '2020-01-02',
    }),
  ).toEqual({
    remainder: {USD: -100},
    remainderByDate: {'2020-01-01': {USD: -100}, '2020-01-02': {USD: 100}},
  })
})
