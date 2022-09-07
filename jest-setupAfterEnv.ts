import type {Balances} from '@ledger-sync/util'

/**
 * Workaround for jest limitations of lack of custom matcher
 * https://github.com/facebook/jest/pull/7352
 * https://github.com/facebook/jest/issues/1751
 *
 * Types for these are declared in global.d.ts
 */
expect.extend({
  toEqualBalances(received: Balances, expected: Balances) {
    const pass = received.equals(expected)
    if (pass) {
      return {
        message: () => `expected ${received} not to equal balances ${expected}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to equal balances ${expected}`,
        pass: false,
      }
    }
  },
})
