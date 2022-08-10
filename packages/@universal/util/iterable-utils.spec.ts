import {
  asyncYieldInput,
  asyncYieldNever,
  asyncYieldThrow,
  catchAsyncIterable,
  combineAsyncIterables,
  isAsyncIterable,
  isIterable,
  yieldInput,
  yieldNever,
} from './iterable-utils'

test('asyncYieldThrow', async () => {
  await expect(
    (async () => {
      for await (const _ of asyncYieldThrow(new Error('BAD'))) {
        // Empty
      }
    })(),
  ).rejects.toThrow('BAD')
})

test('catchAsyncGenerator', async () => {
  await expect(
    (async () => {
      const gen = asyncYieldThrow(new Error('BAD'))
      const enhancedGen = catchAsyncIterable(gen, () => {
        // Do nothing, all good
      })
      for await (const _ of enhancedGen) {
        // Empty
      }
      return 'SUCCESS'
    })(),
  ).resolves.toBe('SUCCESS')

  await expect(
    (async () => {
      const gen = asyncYieldThrow(new Error('BAD'))
      const enhancedGen = catchAsyncIterable(gen, () => {
        throw new Error('REPLACED ERROR')
      })
      for await (const _ of enhancedGen) {
        // Empty
      }
    })(),
  ).rejects.toThrow('REPLACED ERROR')
})

test('combineAsyncIterables normal', async () => {
  await expect(
    (async () => {
      const gen = combineAsyncIterables(
        asyncYieldInput(1),
        asyncYieldInput(2),
        asyncYieldInput(3),
      )
      const inputs: number[] = []
      for await (const n of gen) {
        inputs.push(n)
      }
      return inputs
    })(),
  ).resolves.toEqual([1, 2, 3])
})

test('combineAsyncIterables edge case', async () => {
  await expect(
    (async () => {
      const gen = combineAsyncIterables(asyncYieldInput(1))
      const inputs: number[] = []
      for await (const n of gen) {
        inputs.push(n)
      }
      return inputs
    })(),
  ).resolves.toEqual([1])
})

test('for of asynchrnous generator does not work', async () => {
  await expect(
    (async () => {
      const gen = asyncYieldInput(1)
      const inputs: number[] = []
      // @ts-expect-error
      for (const n of gen) {
        inputs.push(n)
      }
      return inputs
    })(),
  ).rejects.toThrow('is not iterable')
})

test('for await for synchrnous generator works (somehow)', async () => {
  await expect(
    (async () => {
      const gen = yieldInput(1)
      const inputs: number[] = []
      for await (const n of gen) {
        inputs.push(n)
      }
      return inputs
    })(),
  ).resolves.toEqual([1])
})

test('isIterable', () => {
  expect(isIterable({})).toBe(false)
  expect(isIterable(null)).toBe(false)
  expect(isIterable([])).toBe(true)

  expect(isIterable(yieldNever())).toBe(true)
  expect(isIterable(asyncYieldNever())).toBe(false)
})

test('isAsyncIterable', () => {
  expect(isAsyncIterable({})).toBe(false)
  expect(isAsyncIterable(null)).toBe(false)
  expect(isAsyncIterable([])).toBe(false)

  expect(isAsyncIterable(yieldNever())).toBe(false)
  expect(isAsyncIterable(asyncYieldNever())).toBe(true)
})
