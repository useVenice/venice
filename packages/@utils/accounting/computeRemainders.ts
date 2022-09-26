import type {Standard} from '@usevenice/standard'
import type {Amount, AmountMap, NonNullableOnly} from '@usevenice/util'
import {AM} from '@usevenice/util'

// TODO: Should we refactor the
export function computeRemainders({
  postings,
  remainderDate,
}: {
  postings: Array<NonNullableOnly<Standard.Posting, 'date'>>
  remainderDate: ISODate | ISODateTime
}) {
  const remainderByDate: Record<ISODate | ISODateTime, AmountMap> = {}
  const remainder = AM({})
  for (const posting of postings) {
    AM.decrInPlace(remainder, posting.amount)
    remainderByDate[posting.date] = AM.decrInPlace(
      remainderByDate[posting.date] ?? {},
      posting.amount,
    )
  }
  if (!AM.isZero(remainder)) {
    remainderByDate[remainderDate] = AM.add(
      remainderByDate[remainderDate] ?? {},
      AM.invert(remainder),
    )
  }
  return {remainder, remainderByDate}
}

export function computeTrialBalance(
  postings: Array<{amount?: Amount | null; date: ISODateTime | ISODate}>,
) {
  const balanceByDate: Record<ISODate | ISODateTime, AmountMap> = {}
  const balance = AM({})
  for (const posting of postings) {
    if (!posting.amount) {
      continue
    }
    AM.incrInPlace(balance, posting.amount)
    balanceByDate[posting.date] = AM.incrInPlace(
      balanceByDate[posting.date] ?? {},
      posting.amount,
    )
  }

  return {balanceByDate, balance}
}
