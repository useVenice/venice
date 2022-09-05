import {Finance} from 'financejs'

const finance = new Finance()

test('simple IRR', () => {
  expect(finance.IRR(-100, 10, 10, 100)).toMatchInlineSnapshot('6.89')
})
