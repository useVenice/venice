import {Rx, rxjs} from './observable-utils'
import {ObservableState} from './ObservableState'

test('.get and .set with subscribe', async () => {
  const state$ = new ObservableState<string>('hello')
  expect(state$.value).toBe('hello')

  const nextFn = jest.fn()
  state$.subscribe(nextFn)

  await expect(rxjs.firstValueFrom(state$)).resolves.toBe('hello')

  expect(nextFn).toHaveBeenCalledWith('hello')

  state$.set('world')
  expect(state$.value).toBe('world')
  await expect(rxjs.firstValueFrom(state$)).resolves.toBe('world')
  expect(nextFn).toHaveBeenCalledWith('world')
})

test('.set with function', () => {
  const state$ = new ObservableState<number>(11)

  state$.set((prev) => prev + 11)

  expect(state$.value).toBe(22)
})

test('.pipe(Rx.map) observable state', async () => {
  const state$ = new ObservableState<number>(11)

  await expect(rxjs.firstValueFrom(state$)).resolves.toBe(11)

  const nextFn = jest.fn()
  const newState$ = state$.pipe(Rx.map((state) => state * 100))
  newState$.subscribe(nextFn)

  await expect(rxjs.firstValueFrom(newState$)).resolves.toBe(1100)

  expect(nextFn).toHaveBeenCalledWith(1100)
})

test('.pipe(Rx.filter) observable state', async () => {
  const state$ = new ObservableState<number>(11)

  const nextFn = jest.fn()
  state$.pipe(Rx.filter((state) => state > 50)).subscribe(nextFn)

  state$.set(30)
  state$.set(100)

  await expect(rxjs.firstValueFrom(state$)).resolves.toBe(100)

  expect(nextFn).toHaveBeenCalledWith(100)
  expect(nextFn).not.toHaveBeenCalledWith(30)
  expect(nextFn).not.toHaveBeenCalledWith(11)
})

test('.patch with deep partial', async () => {
  const state$ = new ObservableState({
    app: {key1: 'value1', key2: 'value2'},
    token: 'token1',
  })
  state$.patch({
    app: {key1: 'supppp'},
  })
  expect(state$.value).toStrictEqual({
    app: {key1: 'supppp', key2: 'value2'},
    token: 'token1',
  })

  state$.patch((prev) => ({
    app: {key2: `${prev.app.key2}-suffix`},
  }))
  expect(state$.value).toStrictEqual({
    app: {key1: 'supppp', key2: 'value2-suffix'},
    token: 'token1',
  })

  await expect(rxjs.firstValueFrom(state$)).resolves.toStrictEqual({
    app: {key1: 'supppp', key2: 'value2-suffix'},
    token: 'token1',
  })
})

test('.set and .patch equal states does not fire subscriber', async () => {
  const state$ = new ObservableState({key1: 1, key2: 2})

  const nextFn = jest.fn()
  state$.subscribe(nextFn)

  expect(nextFn).toHaveBeenCalledTimes(1)

  state$.set({key1: 1, key2: 2})
  expect(nextFn).toHaveBeenCalledTimes(1)

  state$.set({key1: 11, key2: 2})
  expect(nextFn).toHaveBeenCalledTimes(2)

  state$.patch({key1: 11})
  expect(nextFn).toHaveBeenCalledTimes(2)

  state$.patch({key2: 3333})
  expect(nextFn).toHaveBeenCalledTimes(3)
})

test('multiple observers and unsubscribe', async () => {
  const state$ = new ObservableState<number>(1)
  const next1 = jest.fn()
  const next2 = jest.fn()
  const sub1 = state$.subscribe(next1)
  const sub2 = state$.pipe(Rx.map((s) => s * 10)).subscribe(next2)

  expect(next1).toHaveBeenCalledWith(1)
  expect(next2).toHaveBeenCalledWith(10)

  sub1.unsubscribe()
  state$.set(5)
  expect(next1).toHaveBeenCalledTimes(1)
  expect(next2).toHaveBeenCalledTimes(2)

  sub2.unsubscribe()
  state$.set(10)
  expect(next1).toHaveBeenCalledTimes(1)
  expect(next2).toHaveBeenCalledTimes(2)
})
