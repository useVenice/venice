import {withPerf} from './perf-utils'
import {
  DEFAULT_ENTRY_COMPARATOR,
  SortedArray,
  SortedMap,
  SortedSet,
} from './sorted-collections'
import {NodeManagerJsNumber, Tree} from '@subspace/red-black-tree'
import {RBTree} from 'bintrees'

// MARK: - Correctness

test('RBTree: Does not allow dupe key', () => {
  const tree = new RBTree<number>((a, b) => a - b)
  tree.insert(1)
  tree.insert(2)
  tree.insert(3)
  expect(tree.size).toBe(3)
  expect(tree.max()).toBe(3)

  tree.insert(3)
  expect(tree.size).toBe(3)
  expect(tree.max()).toBe(3)

  tree.remove(3)
  expect(tree.size).toBe(2)
  expect(tree.max()).toBe(2)
})

test('SortedMap: Handle duplicate keys', () => {
  const ss = new SortedMap([['k1' as string, 1]])

  expect(ss.entries()).toEqual([['k1', 1]])

  ss.set('k2', 2)
  expect(ss.entries()).toEqual([
    ['k1', 1],
    ['k2', 2],
  ])
  ss.set('k2', 100)
  expect(ss.entries()).toEqual([
    ['k1', 1],
    ['k2', 100],
  ])

  expect(ss.size).toBe(2)

  ss.set('k2', (v) => (v ?? 0) + 15)
  expect(ss.get('k2')).toBe(115)

  expect(ss.first()?.[0]).toBe('k1')
  expect(ss.last()?.[0]).toBe('k2')

  ss.delete('k2')
  expect(ss.size).toBe(1)
  expect(ss.get('k2')).toBeUndefined()
})

test('SortedSet: Handle duplicate keys', () => {
  const ss = new SortedSet([1])
  expect(ss.toArray()).toEqual([1])
  ss.add(2)
  expect(ss.toArray()).toEqual([1, 2])
  ss.add(2)
  expect(ss.toArray()).toEqual([1, 2])

  expect(ss.first()).toBe(1)
  expect(ss.last()).toBe(2)

  ss.delete(1)
  expect(ss.toArray()).toEqual([2])
})

test('SortedArray: allows duplicate sort keys', () => {
  const ss = new SortedArray([1])
  expect(ss.data()).toEqual([1])
  expect(ss.length).toBe(1)

  ss.add(2)
  expect(ss.data()).toEqual([1, 2])

  ss.add(2)
  expect(ss.length).toBe(3)
  expect(ss.data()).toEqual([1, 2, 2])

  expect(ss.first()).toBe(1)
  expect(ss.last()).toBe(2)

  ss.delete(1)
  expect(ss.data()).toEqual([2, 2])

  ss.delete(2)
  expect(ss.data()).toEqual([2])

  ss.delete(3)
  expect(ss.data()).toEqual([2])
  expect(ss.length).toBe(1)

  ss.delete(2)
  expect(ss.length).toBe(0)
})

test('SortedArray: Stable order', () => {
  const ss = new SortedArray([{k: 1, v: 'b'}], (i) => i.k)

  expect(ss.data()).toEqual([{k: 1, v: 'b'}])
  ss.add({k: 1, v: 'a'})
  expect(ss.data()).toEqual([
    {k: 1, v: 'b'},
    {k: 1, v: 'a'},
  ])
})

// MARK: - Performance

const iterations = 100_000

describe(`Perf ${iterations} iterations`, () => {
  const randomArray = Array.from({length: iterations})
    .fill(0)
    .map(() => Math.random())

  test('array perf (benchmark / bisect investigation)', () => {
    // Too slow for 1m iterations... Aborting...
    // withPerf('array.splice', () => {
    //   const initial = [...randomArray]
    //   for (let i = 0; i < iterations; i++) {
    //     initial.splice(i + 5000, 0, i)
    //   }
    //   return [...initial]
    // })

    // 55ms for 1m
    withPerf('array.push', () => {
      const initial = [...randomArray]
      for (let i = 0; i < iterations; i++) {
        initial.push(i + 5000)
      }
      return [...initial]
    })

    withPerf('Map.set', () => {
      const initial = [...randomArray]
      const map = new Map(initial.length > 0 ? [] : [])
      for (let i = 0; i < iterations; i++) {
        map.set(i, i)
      }
      return [...map.values()]
    })

    withPerf('object[key] = value', () => {
      const initial = [...randomArray]
      const map: Record<number, unknown> = initial ? {} : {}
      for (let i = 0; i < iterations; i++) {
        map[i] = i
      }
      return [...Object.values(map)]
    })
  })

  // Almost everything has shitty performance...
  // https://share.getcloudapp.com/Z4uyKEmw
  // red-black-tree is by far the best
  // Also somehow test failed when we were at 1m items
  // @subspace/red-black-tree is still faster
  // but it does not work in the browser and is really complicated...
  // So we will omit it...
  // https://share.getcloudapp.com/yAulrRm7
  test('sorting performance', () => {
    // Baseline
    // normal map with single sort at the end (in 6650.447851002216ms) for 1m iterations
    // actually fairly bad
    const sorted = withPerf('normal map with single sort at the end', () => {
      const map = new Map<number, null>()
      for (const item of randomArray) {
        map.set(item, null)
      }
      // Would not be fair comparison without sorting
      return [...map.keys()].sort()
    })

    // red black tree (in 2167.1343980133533ms) for 1m iterations. Not bad
    const sortedRbt = withPerf('@subspace/red-black-tree direct', () => {
      const manager = new NodeManagerJsNumber<null>()
      const map = new Tree(manager)
      withPerf('@subspace/red-black-tree: adding nodes', () => {
        for (const item of randomArray) {
          // // Makes the per terrible
          // map.getClosestNode(item) // intentionally slower

          map.addNode(item, null)
        }
      })
      return withPerf('@subspace/red-black-tree: iterate', () => {
        const node = manager.getRoot()
        const keys: number[] = []
        function whatever(n: typeof node) {
          if (!n) {
            return
          }
          whatever(n.getLeft())
          keys.push(n.getKey())
          whatever(n.getRight())
        }
        whatever(node)
        return keys
      })
    })

    const sortedViaSS = withPerf('bintrees direct', () => {
      const ss = new RBTree<[number, null]>(DEFAULT_ENTRY_COMPARATOR)
      // const sm = new CSortedSet.Instance(randomArray.map((i) => [i, null]))
      for (const item of randomArray) {
        ss.find([item, null]) // intentionally slower
        ss.insert([item, null])
      }
      const ret = []
      const it = ss.iterator()
      let item
      while ((item = it.next()) !== null) {
        // do stuff with item
        ret.push(item)
      }
      return ret
    })

    const sortedViaMap = withPerf('sortedMap', () => {
      const sm = new SortedMap<number, null>()
      for (const item of randomArray) {
        sm.set(item, null)
      }
      return sm.keys()
    })

    const sortedViaSet = withPerf('sorted set', () => {
      const sset = new SortedSet()
      for (const item of randomArray) {
        sset.add(item)
      }
      return sset.toArray()
    })

    expect(sorted.length).toEqual(sortedViaSS.length)
    expect(sorted.length).toEqual(sortedRbt.length)
    expect(sorted.length).toEqual(sortedViaMap.length)
    expect(sorted.length).toEqual(sortedViaSet.length)
  })
})
