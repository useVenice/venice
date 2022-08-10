import {RefCounter} from './RefCounter'

test('RefCounter simple string', () => {
  const deinitKeys: string[] = []
  const initKeys: string[] = []
  const counter = new RefCounter({
    onInit: (key) => initKeys.push(key),
    onDeinit: (key) => deinitKeys.push(key),
  })
  expect(counter.liveItems()).toEqual([])

  counter.retain('USD')

  expect(counter.liveItems()).toEqual(['USD'])
  expect(initKeys).toEqual(['USD'])

  counter.release('USD')

  expect(counter.liveItems()).toEqual([])
  expect(deinitKeys).toEqual(['USD'])
})

test('RefCounter object', () => {
  const initKeys: Array<{a: string; b: string}> = []
  const counter = new RefCounter<{a: string; b: string}>({
    toKey: JSON.stringify,
    onInit: (key) => initKeys.push(key),
  })
  expect(counter.liveItems()).toEqual([])

  counter.retain({a: 'hello', b: 'world'})

  expect(counter.liveItems()).toEqual([{a: 'hello', b: 'world'}])
  expect(initKeys).toEqual([{a: 'hello', b: 'world'}])
})

test('RefCounter sorted date', () => {
  const counter = new RefCounter()
  expect(counter.liveItems()).toEqual([])
  expect(counter.minItem()).toBeNull()
  expect(counter.maxItem()).toBeNull()

  counter.retain('2020-01-01')
  counter.retain('2020-10-01')
  counter.retain('2020-05-01')

  expect(counter.minItem()).toBe('2020-01-01')
  expect(counter.maxItem()).toBe('2020-10-01')

  counter.release('2020-10-01')
  expect(counter.maxItem()).toBe('2020-05-01')
})

test('RefCounter sorted number', () => {
  const counter = new RefCounter<number>()
  expect(counter.liveItems()).toEqual([])
  expect(counter.minItem()).toBeNull()
  expect(counter.maxItem()).toBeNull()

  counter.retain(123)
  counter.retain(33)
  counter.retain(55)

  expect(counter.minItem()).toBe(33)
  expect(counter.maxItem()).toBe(123)

  counter.release(123)
  expect(counter.maxItem()).toBe(55)
})

test('RefCounter sorted objects', () => {
  const counter = new RefCounter<{a: number; b: string}>({
    toKey: (o) => o.a,
  })

  counter.retain({a: 110, b: 'world'})
  counter.retain({a: 13, b: 'world'})
  counter.retain({a: 234, b: 'world'})

  expect(counter.minItem()).toEqual({a: 13, b: 'world'})
  expect(counter.maxItem()).toEqual({a: 234, b: 'world'})

  counter.release({a: 234, b: 'does not matter...not key'})

  expect(counter.maxItem()).toEqual({a: 110, b: 'world'})
})
