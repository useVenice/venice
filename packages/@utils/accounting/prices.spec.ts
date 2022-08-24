import {A} from '@ledger-sync/util'
import {
  _convertAmount,
  _getConversionPath,
  _getPriceAt,
  buildPriceMap,
  convertAmountMap,
  derivePrice,
  getDirectPrice,
  getPrice,
  invertPrice,
  P,
} from './prices'

const prices = [
  P('2019-05-01', 'USD', 1.25, 'CAD'),
  P('2019-07-01', 'USD', 1.5, 'CAD'),
  P('2019-08-01', 'USD', 1.66, 'CAD'),
  P('2019-09-01', 'USD', 1.7, 'CAD'),
  P('2019-09-01', 'USD', 1.8, 'CAD'),
  P('2019-05-01', 'USD', 15000, 'IDR'),
  P('2019-08-01', 'SGD', 10000, 'IDR'),
]

const morePrices = [
  P('2020-07-20', 'BTC', 1.25, 'USD'),
  P('2020-07-20', 'EUR', 1.25, 'MXN'),
  P('2020-07-20', 'MXN', 1.25, 'EUR'),
  P('2020-07-20', 'MXN', 1.25, 'IDR'),
  P('2020-07-20', 'MXN', 1.25, 'USD'),
  P('2020-07-20', 'USD', 1.25, 'BTC'),
  P('2020-07-20', 'USD', 1.25, 'XLM'),
  P('2020-07-20', 'USD', 1.25, 'MXN'),
  P('2020-07-20', 'XLM', 1.25, 'USD'),
]

const evenMorePrices = [...morePrices, P('2020-07-20', 'IDR', 1.25, 'MXN')]

test('parse prices', () => {
  expect(prices[0]).toEqual({
    baseUnit: 'USD',
    quote: A(1.25, 'CAD'),
    date: '2019-05-01',
  })
})

test('invert price', () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(invertPrice(prices[0]!)).toEqual({
    baseUnit: 'CAD',
    quote: A(0.8, 'USD'),
    date: '2019-05-01',
  })
})

test('derive price', () => {
  expect(
    derivePrice(
      P('2019-05-01', 'USD', 1.25, 'CAD'),
      P('2019-05-01', 'CAD', 10000, 'IDR'),
    ),
  ).toEqual({
    baseUnit: 'USD',
    quote: A(12500, 'IDR'),
    date: '2019-05-01',
  })
})

describe('get price at', () => {
  const cadPrices = prices.filter((p) => p.quote.unit === 'CAD')

  test('get price on exact date', () => {
    expect(_getPriceAt(cadPrices, '2019-07-01')).toEqual({
      baseUnit: 'USD',
      quote: A(1.5, 'CAD'),
      date: '2019-07-01',
    })
  })

  test('get price between range', () => {
    expect(_getPriceAt(cadPrices, '2019-07-05')).toEqual({
      baseUnit: 'USD',
      quote: A(1.5, 'CAD'),
      date: '2019-07-01',
    })
  })

  test('get price before range', () => {
    expect(_getPriceAt(cadPrices, '2019-01-05')).toEqual({
      baseUnit: 'USD',
      quote: A(1.25, 'CAD'),
      date: '2019-05-01',
    })
  })

  test('get price after range', () => {
    expect(_getPriceAt(cadPrices, '2019-10-05')).toEqual({
      baseUnit: 'USD',
      quote: A(1.8, 'CAD'),
      date: '2019-09-01',
    })
  })
})

test('building price map', () => {
  expect(buildPriceMap(prices)).toEqual({
    USD: {
      CAD: [
        P('2019-05-01', 'USD', 1.25, 'CAD'),
        P('2019-07-01', 'USD', 1.5, 'CAD'),
        P('2019-08-01', 'USD', 1.66, 'CAD'),
        P('2019-09-01', 'USD', 1.8, 'CAD'),
      ],
      IDR: [P('2019-05-01', 'USD', 15000, 'IDR')],
    },
    CAD: {
      USD: [
        P('2019-05-01', 'CAD', 1 / 1.25, 'USD'),
        P('2019-07-01', 'CAD', 1 / 1.5, 'USD'),
        P('2019-08-01', 'CAD', 1 / 1.66, 'USD'),
        P('2019-09-01', 'CAD', 1 / 1.8, 'USD'),
      ],
    },
    IDR: {
      USD: [P('2019-05-01', 'IDR', 1 / 15000, 'USD')],
      SGD: [P('2019-08-01', 'IDR', 1 / 10000, 'SGD')],
    },
    SGD: {
      IDR: [P('2019-08-01', 'SGD', 10000, 'IDR')],
    },
  })
})

describe('Get direct price', () => {
  const priceMap = buildPriceMap(prices)

  test('normal on exact date', () => {
    expect(
      getDirectPrice(priceMap, 'USD' as Unit, 'CAD' as Unit, '2019-05-01'),
    ).toEqual(P('2019-05-01', 'USD', 1.25, 'CAD'))
  })

  test('normal on latest date', () => {
    expect(getDirectPrice(priceMap, 'USD' as Unit, 'CAD' as Unit)).toEqual(
      P('2019-09-01', 'USD', 1.8, 'CAD'),
    )
  })

  test('inverse on exact date', () => {
    expect(
      getDirectPrice(priceMap, 'CAD' as Unit, 'USD' as Unit, '2019-05-01'),
    ).toEqual(P('2019-05-01', 'CAD', 0.8, 'USD'))
  })

  test('inverse on date between', () => {
    expect(
      getDirectPrice(priceMap, 'CAD' as Unit, 'USD' as Unit, '2019-05-05'),
    ).toEqual(
      // This is correct, but is it expected?
      P('2019-05-01', 'CAD', 0.8, 'USD'),
    )
  })

  test('not found', () => {
    expect(
      getDirectPrice(priceMap, 'CAD' as Unit, 'MXN' as Unit, '2019-05-05'),
    ).toBeNull()
  })
})

describe('Get transitive price', () => {
  const priceMap = buildPriceMap(prices)

  test('get conversion path to self returns just self', () => {
    expect(_getConversionPath(priceMap, 'USD' as Unit, 'USD' as Unit)).toEqual([
      'USD',
    ])
  })

  test('get direct conversion path', () => {
    expect(_getConversionPath(priceMap, 'USD' as Unit, 'CAD' as Unit)).toEqual([
      'USD',
      'CAD',
    ])
  })

  test('get transitive conversion path', () => {
    expect(_getConversionPath(priceMap, 'CAD' as Unit, 'IDR' as Unit)).toEqual([
      'CAD',
      'USD',
      'IDR',
    ])
  })

  test('get transitive conversion path (baseUnit missing but present as quote)', () => {
    expect(
      _getConversionPath(
        buildPriceMap(morePrices),
        'IDR' as Unit,
        'USD' as Unit,
      ),
    ).toEqual(['IDR', 'MXN', 'USD'])
  })

  test('get transitive conversion path (same as previous with baseUnit present)', () => {
    expect(
      _getConversionPath(
        buildPriceMap(evenMorePrices),
        'IDR' as Unit,
        'USD' as Unit,
      ),
    ).toEqual(['IDR', 'MXN', 'USD'])
  })

  test('normal on exact date', () => {
    expect(
      getPrice(priceMap, 'CAD' as Unit, 'IDR' as Unit, '2019-05-01'),
    ).toEqual(P('2019-05-01', 'CAD', (1 / 1.25) * 15000, 'IDR'))
  })
})

describe('_convertAmount', () => {
  test('self conversion should do nothing', () => {
    expect(_convertAmount(priceMap, A(100, 'USD'), 'USD' as Unit)).toEqual(
      A(100, 'USD'),
    )
  })

  const priceMap = buildPriceMap(prices)

  test('forward conversion', () => {
    expect(_convertAmount(priceMap, A(100, 'USD'), 'CAD' as Unit)).toEqual(
      A(180, 'CAD'),
    )
  })

  test('inverse conversion', () => {
    expect(
      _convertAmount(priceMap, A(125, 'CAD'), 'USD' as Unit, '2018-01-01'),
    ).toEqual(A(100, 'USD'))
  })

  test('indirect conversion', () => {
    expect(
      _convertAmount(priceMap, A(100, 'CAD'), 'IDR' as Unit, '2019-05-01'),
    ).toEqual(A(1200000, 'IDR'))
  })

  test('3 layer indirect conversion', () => {
    expect(
      _convertAmount(priceMap, A(100, 'CAD'), 'SGD' as Unit, '2019-08-01'),
    ).toEqual(A(100 * (((1 / 1.66) * 15000) / 10000), 'SGD'))
  })

  test('convertAmountMap empty', () => {
    expect(convertAmountMap(priceMap, {}, 'USD' as Unit)).toEqual({USD: 0})
  })
})
