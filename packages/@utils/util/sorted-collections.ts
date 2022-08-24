import {RBTree as BTree, Comparator} from 'bintrees'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DEFAULT_ENTRY_COMPARATOR: Comparator<[string | number, any]> = (
  a,
  b,
) => {
  if (a[0] < b[0]) {
    return -1
  }
  if (a[0] > b[0]) {
    return 1
  }
  return 0
}

type Setter<T> = (prev: T | undefined, nodeExists: boolean) => T

// TODO: Support number keys too
export class SortedMap<
  TKey extends string | number = string,
  TValue = unknown,
> {
  readonly tree: BTree<[TKey, TValue]>
  readonly map = new Map<TKey, [TKey, TValue]>()

  // Not sure how to fix this...
  constructor(
    entries: Array<[TKey, TValue]> = [],
    comparator: Comparator<[TKey, TValue]> = DEFAULT_ENTRY_COMPARATOR,
  ) {
    this.tree = new BTree(comparator)
    for (const entry of entries) {
      this.set(entry[0], entry[1])
    }
  }

  get(key: TKey) {
    return this.map.get(key)?.[1]
  }

  set(key: TKey, value: TValue | Setter<TValue>) {
    let node = this.map.get(key)
    // Maybe we can combine this with a simple `Map` to make look up
    // and insertion that much faster
    if (node) {
      // This would fail if value is a function itself.
      // We should probably improve the typing... Or have a diff set fn
      node[1] =
        typeof value === 'function'
          ? (value as Setter<TValue>)(node[1], true)
          : value
      return
    }

    node = [
      key,
      typeof value === 'function'
        ? (value as Setter<TValue>)(undefined, false)
        : value,
    ]
    this.map.set(key, node)
    this.tree.insert(node)
  }

  delete(key: TKey) {
    const node = this.map.get(key)
    if (node) {
      this.map.delete(key)
      this.tree.remove(node)
    }
  }

  get size() {
    return this.tree.size
  }

  keys() {
    return this.entries().map((e) => e[0])
  }

  values() {
    return this.entries().map((e) => e[1])
  }

  entries() {
    return [...this.iter('asc')]
  }

  toArray() {
    const ret = []
    const it = this.tree.iterator()
    let item
    while ((item = it.next()) !== null) {
      // do stuff with item
      ret.push(item)
    }
    return ret
  }

  iter(dir: 'asc' | 'desc'): IterableIterator<[TKey, TValue]> {
    const iter = this.tree.iterator()
    return {
      [Symbol.iterator]() {
        return this
      },
      next() {
        const value = iter[dir === 'asc' ? 'next' : 'prev']()
        return value ? {value, done: false} : {value: undefined, done: true}
      },
    }
  }

  [Symbol.iterator]() {
    return this.iter('asc')
  }

  first() {
    return this.tree.min()
  }

  last() {
    return this.tree.max()
  }
}

export class SortedSet<TItem, TKey extends string | number = string> {
  private readonly map = new SortedMap<TKey, TItem>()

  // Assume item is either string or number here...
  // If not it's going to intentionally fail...
  constructor(
    items: TItem[] = [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly getSortKey: (item: TItem) => TKey = (item) => item as any,
  ) {
    for (const item of items) {
      this.add(item)
    }
  }

  get size() {
    return this.map.size
  }

  has(item: TItem) {
    return this.map.get(this.getSortKey(item)) != null
  }

  add(item: TItem) {
    this.map.set(this.getSortKey(item), item)
  }

  delete(item: TItem) {
    this.map.delete(this.getSortKey(item))
  }

  toArray() {
    return this.map.values()
  }

  first() {
    return this.map.first()?.[1]
  }

  last() {
    return this.map.last()?.[1]
  }
}

export class SortedArray<TItem, TKey extends string | number = string> {
  private readonly map = new SortedMap<TKey, TItem[]>()

  // Assume item is either string or number here...
  // If not it's going to intentionally fail...
  constructor(
    items: TItem[] = [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly getSortKey = (item: TItem) => item as any as TKey,
    private readonly getEqualKey = (item: TItem) => item as unknown,
  ) {
    for (const item of items) {
      this.add(item)
    }
  }

  private _length = 0
  get length() {
    return this._length
  }

  add(item: TItem) {
    this.map.set(this.getSortKey(item), (prev) => {
      if (prev) {
        prev.push(item)
        return prev
      }
      return [item]
    })
    this._length++
  }

  delete(item: TItem) {
    const items = this.map.get(this.getSortKey(item))
    const itemKey = this.getEqualKey(item)
    const idx = items
      ? items.findIndex((i) => this.getEqualKey(i) === itemKey)
      : -1
    if (idx >= 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      items!.splice(idx, 1)
      this._length--
    }
  }

  first() {
    return this.map.first()?.[1][0]
  }

  last() {
    const items = this.map.last()?.[1]
    return items ? items[items.length - 1] : undefined
  }

  data() {
    const allItems: TItem[] = []
    this.map.values().forEach((items) => {
      allItems.push(...items)
    })
    return allItems
  }
}
