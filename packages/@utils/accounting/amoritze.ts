import type {Standard} from '@usevenice/standard'
import type {Amount, Interval} from '@usevenice/util'
import {A, formatDate, iterateSubintervals, math} from '@usevenice/util'

// Should we support AmountMap?
export function computeAmortization(
  totalAmount: Amount,
  totalInterval: Interval,
  frequency: Standard.Frequency,
) {
  const segments = [...iterateSubintervals(totalInterval, frequency)]
  let ratioToDate = 0
  let quantityToDate = 0

  return segments.map(({interval, ratio, duration}, index) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let [durUnit, durQuantity] = Object.entries(duration.toObject())[0]!
    // TODO: Extract this logic elsewhere
    durQuantity = math.round(durQuantity, 2)
    durUnit = durQuantity > 1 ? durUnit : durUnit.replace(/s$/, '')
    const percent = `${math.round((ratioToDate += ratio) * 100, 1)}%`

    // All amount should be accounted for on a discrete basis
    // TODO: This should be extracted into its own logic as well.
    // Also logic is shared by A.splitEqually
    const amount = A.multiply(totalAmount, ratio)
    amount.quantity = math.round(amount.quantity, 2)
    quantityToDate += amount.quantity
    if (index === segments.length - 1) {
      amount.quantity += math.round(totalAmount.quantity - quantityToDate, 2)
    }

    // TODO: Store amoritization info in posting custom metadata
    return {
      date: interval.start.toISODate(),
      amount,
      memo: `For ${formatDate(interval.start)} - ${formatDate(
        interval.end,
      )} (${durQuantity} ${durUnit}). Period ${index + 1}/${
        segments.length
      } ${percent}`,
      extra: {
        interval: interval.toISODate(),
        ratio,
        ratioToDate,
        duration: duration.toObject(),
      },
    }
  })
}
