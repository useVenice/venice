import {
  A,
  Balances,
  inPlaceSort,
  objectKeys,
  setAt,
  sortedIndexBy,
  toMultiAmount,
} from '@ledger-sync/util'

// MARK: buildPriceMap

/** baseUnit.quoteUnit.date: Standard.Price */
export type RawPriceMap = Record<
  string /* baseUnit */,
  Record<string /* quoteUnit */, Record<string /* date */, Standard.Price>>
>

/**
 * baseUnit.quoteUnit: Standard.Price
 * e.g. {USD: {CAD: [Standard.Price] }}
 */
export type PriceMap = Record<
  string /* baseUnit */,
  Record<string /* quoteUnit */, Standard.Price[]>
>

export function buildPriceMap(inputPrices: Standard.Price[]): PriceMap {
  /** baseUnit.quoteUnit.date: Standard.Price */
  const rawPriceMap: RawPriceMap = {}
  for (const price of inputPrices) {
    if (!price.baseUnit || !price.quote.unit || !price.date) {
      continue
    }

    setAt(rawPriceMap, [price.baseUnit, price.quote.unit, price.date], price)
  }

  const priceMap: PriceMap = {}
  for (const [baseUnit, pricesByQuoteUnit] of Object.entries(rawPriceMap)) {
    for (const [quoteUnit, pricesByDate] of Object.entries(pricesByQuoteUnit)) {
      const inversePricesByDate = rawPriceMap[quoteUnit]?.[baseUnit] ?? {}
      const [prices, inversePrices] = _mergeInverseAndSort(
        pricesByDate,
        inversePricesByDate,
      )

      setAt(priceMap, [baseUnit, quoteUnit], prices)
      setAt(priceMap, [quoteUnit, baseUnit], inversePrices)
    }
  }
  return priceMap
}

export function _mergeInverseAndSort(
  p1: Record<string, Standard.Price>,
  p2: Record<string, Standard.Price>,
) {
  const l1 = Object.keys(p1).length
  const l2 = Object.keys(p2).length
  const [primary, secondary] = l1 >= l2 ? [p1, p2] : [p2, p1]
  for (const price of Object.values(secondary)) {
    if (primary[price.date]) {
      continue
    }
    primary[price.date] = invertPrice(price)
  }
  const primarySorted = inPlaceSort(Object.values(primary)).asc('date')
  const secondarySorted = primarySorted.map((p) => invertPrice(p))

  return l1 >= l2
    ? ([primarySorted, secondarySorted] as const)
    : ([secondarySorted, primarySorted] as const)
}

export function invertPrice(price: Standard.Price): Standard.Price {
  return {
    date: price.date,
    quote: A(1 / price.quote.quantity, price.baseUnit),
    baseUnit: price.quote.unit,
  }
}

// MARK: P

export function P(
  date: ISODate,
  baseUnit: string,
  quantity: number,
  quoteUnit: string,
): Standard.Price {
  return {
    baseUnit: baseUnit as Unit,
    date,
    quote: A(quantity, quoteUnit),
  }
}

// MARK: getPrice

export function getPrice(
  priceMap: PriceMap,
  baseUnit: Unit,
  quoteUnit: Unit,
  date?: ISODate,
) {
  const path = _getConversionPath(priceMap, baseUnit, quoteUnit)
  if (!path || path.length <= 1) {
    return null
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let price = getDirectPrice(priceMap, path[0]!, path[1]!, date)!
  path.shift()
  // const priceSteps = [price]
  while (path.length >= 2) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const unit = path.shift()!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const price2 = getDirectPrice(priceMap, unit, path[0]!, date)!
    // priceSteps.push(price2)
    price = derivePrice(price, price2)
  }
  // console.debug(priceSteps, price)
  return price
}

// Breadth-first-search with path retention
export function _getConversionPath(
  priceMap: PriceMap,
  start: Unit, // base unit
  end: Unit, // quote unit
) {
  const visited = new Set([start])
  const queue = [[start]] // this maintains the working paths.

  while (queue.length > 0) {
    const path = queue.shift()
    if (!path) {
      // no more paths to explore
      return null
    }
    if (path[0] === end) {
      // our path ends at the desired location
      return path.reverse()
    }
    if (path[0]) {
      for (const _unit of objectKeys(priceMap[path[0]] ?? {})) {
        const unit = _unit as Unit
        if (!visited.has(unit)) {
          queue.push([unit, ...path])
          visited.add(unit)
        }
      }
    }
  }
  return null
}

/** Only direct inverses */
export function getDirectPrice(
  priceMap: PriceMap,
  baseUnit: Unit,
  quoteUnit: Unit,
  date?: ISODate,
) {
  const data = priceMap[baseUnit]?.[quoteUnit]
  return data ? _getPriceAt(data, date) : null
}

export function _getPriceAt(sortedPrices: Standard.Price[], date?: ISODate) {
  if (!date) {
    return sortedPrices[sortedPrices.length - 1]
  }
  const index = sortedIndexBy(
    sortedPrices,
    {date} as Standard.Price,
    (p) => p.date,
  )
  // after range, use last value
  if (index === sortedPrices.length) {
    return sortedPrices[sortedPrices.length - 1]
  }
  // Before range, use first value
  if (index === 0) {
    return sortedPrices[0]
  }
  // On exact value, well use exact value...
  if (sortedPrices[index]?.date === date) {
    return sortedPrices[index]
  }
  // Between ranges, use prev value
  return sortedPrices[index - 1]
}

/** CAD/IDR 11250 */
export function derivePrice(
  /** CAD/USD 0.75 */
  p1: Standard.Price,
  /** USD/IDR 15000 */
  p2: Standard.Price,
): Standard.Price {
  return {
    date: p1.date > p2.date ? p1.date : p2.date,
    baseUnit: p1.baseUnit,
    quote: A(p1.quote.quantity * p2.quote.quantity, p2.quote.unit),
  }
}

// MARK: convertAmountMap

/**
 * TODO: Combine this with convertAmount?
 * Also, instead of dealing with Amounts, we probably need to deal with
 * positions soon
 */
export function convertAmountMap(
  priceMap: PriceMap,
  amount: Amount | AmountMap | MultiAmount,
  targetUnit: Unit,
  date?: ISODate,
): AmountMap {
  return {
    [targetUnit]: 0, // Always ensure we have a target unit is better
    ...Balances.fromAmounts(
      toMultiAmount(amount).amounts.map(({unit, quantity}) => {
        if (unit === targetUnit) {
          return {unit, quantity}
        }
        return _convertAmount(priceMap, A(quantity, unit), targetUnit, date)
      }),
    ).data,
  }
}

/** Returns a tuple. remainder = amount not converted... */
export function convertAmount(
  priceMap: PriceMap,
  amount: Amount | AmountMap | MultiAmount,
  targetUnit: Unit,
  date?: ISODate,
): [result: Amount | null, remainder: AmountMap | null] {
  const {[targetUnit]: quantity, ...remainder} = convertAmountMap(
    priceMap,
    amount,
    targetUnit,
    date,
  )
  return [
    quantity != null ? A(quantity, targetUnit) : null,
    Object.keys(remainder).length > 0 ? remainder : null,
  ]
}

/** TODO: Return price used for the conversion */
export function _convertAmount(
  priceMap: PriceMap,
  amount: Amount,
  destUnit: Unit,
  date?: ISODate,
) {
  const price = getPrice(priceMap, amount.unit, destUnit, date)
  // Should cover degenerative cases as well
  if (!price) {
    return amount
  }
  return A(amount.quantity * price.quote.quantity, destUnit)
}
