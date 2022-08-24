import {Balances} from './Balances'

test('Balances equals', () => {
  expect(new Balances()).toEqualBalances(new Balances())
  expect(new Balances({USD: 0})).toEqualBalances(new Balances({EUR: 0}))

  expect(new Balances({USD: 0})).not.toEqualBalances(new Balances({EUR: 1}))

  expect(new Balances({USD: 5.1234567890123456})).toEqualBalances(
    new Balances({USD: 5.123456789012345}),
  )
})
