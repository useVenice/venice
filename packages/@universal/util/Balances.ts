import {A, AnyAmount, isAmountMap, isMultiAmount} from './amount-utils'
import {legacy_formatAmount} from './formatting-amount'
import {math} from './math-utils'

export class Balances {
  constructor(public readonly data: AmountMap = {}) {}

  set(amount: Amount | MultiAmount) {
    if (isMultiAmount(amount)) {
      for (const amt of amount.amounts) {
        this.set(amt)
      }

      return this
    }

    this.data[amount.unit] = amount.quantity

    return this
  }

  toString() {
    return legacy_formatAmount(this.multi())
  }

  equals(that: Balances) {
    const units = new Set([
      ...Object.keys(this.data),
      ...Object.keys(that.data),
    ])
    for (const unit of units) {
      if (!math.equals(this.data[unit] ?? 0, that.data[unit] ?? 0)) {
        return false
      }
    }
    return true
  }

  decr(amount: AnyAmount | undefined | null) {
    if (!amount) {
      return this
    }
    if (Array.isArray(amount)) {
      this.incr({amounts: amount.map(A.invert)})
      return this
    }
    if (isAmountMap(amount)) {
      for (const [unit, quantity] of Object.entries(amount)) {
        this.incr(A.invert(A(quantity, unit)))
      }
      return this
    }
    if (isMultiAmount(amount)) {
      this.incr({amounts: amount.amounts.map(A.invert)})
      return this
    }
    this.incr(A.invert(amount))
    return this
  }

  incr(amount: AnyAmount | undefined | null) {
    if (!amount) {
      return this
    }
    if (Array.isArray(amount)) {
      for (const amt of amount) {
        this.incr(amt)
      }
      return this
    }
    if (isAmountMap(amount)) {
      for (const [unit, quantity] of Object.entries(amount)) {
        this.incr(A(quantity, unit))
      }
      return this
    }
    if (isMultiAmount(amount)) {
      for (const amt of amount.amounts) {
        this.incr(amt)
      }
      return this
    }
    if (this.data[amount.unit] === undefined) {
      this.set(amount)
      return this
    }

    this.data[amount.unit] += amount.quantity

    return this
  }

  get(unit: Unit): Amount {
    return A(this.data[unit] ?? 0, unit)
  }

  copy(): Balances {
    return Balances.fromAmounts([this.multi()])
  }

  multi(): MultiAmount {
    return {
      amounts: Object.entries(this.data)
        // Hack alert: Temporarily excluding empty units
        .filter(([unit]) => unit.trim())
        .map(([unit, quantity]) => A(quantity, unit)),
    }
  }

  isZero() {
    return this.equals(new Balances())
  }

  isNonZero() {
    return !this.isZero()
  }

  first(filter?: (amount: Amount) => boolean) {
    for (const amount of this.multi().amounts) {
      if (!filter || filter(amount)) {
        return amount // already a copy
      }
    }

    return null
  }

  only() {
    const amounts = this.multi().amounts
    if (amounts.length !== 1) {
      throw new Error(`Expecting 1 amount. Got ${amounts.length}`)
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return amounts[0]!
  }

  static from(amount: AnyAmount | undefined | null) {
    const balances = new Balances()
    balances.incr(amount)
    return balances
  }

  static fromAmounts(amounts: Iterable<AnyAmount>) {
    const balances = new Balances()
    for (const amount of amounts) {
      balances.incr(amount)
    }
    return balances
  }

  static trialBalance(postings: Array<{amount: Amount}>) {
    const balances = new Balances()
    for (const p of postings) {
      balances.incr(p.amount)
    }
    return balances.multi()
  }
}
