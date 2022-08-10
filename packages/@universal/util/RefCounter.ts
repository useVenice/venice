// TODO: Make key parsing / unparsing part of refCounter
import {RBTree} from 'bintrees'

// TODO: Add sorting capability to ref counter via using a backing BTree
export class RefCounter<T = string> {
  /** For counting */
  private readonly countByKey: Record<string, number> = {}
  /** For retrieving */
  private readonly itemByKey: Record<string, T> = {}
  /** For sorting */
  private readonly sortedKeySet = new RBTree<string | number>((a, b) =>
    a < b ? -1 : a > b ? 1 : 0,
  )

  constructor(
    private readonly opts: {
      toKey?: (item: T) => string | number
      onInit?: (item: T) => void
      onDeinit?: (item: T) => void
    } = {},
  ) {}

  private adjustCount(item: T, delta: number) {
    const k = this.objectToKey(item)
    const prevCount = this.countByKey[k] ?? 0
    const nextCount = prevCount + delta
    if (nextCount < 0) {
      console.warn(
        `NOOP: ${item} has a refCount of ${nextCount}. Check that every call to retain has a corresponding call to release`,
      )
      return
    }
    this.countByKey[k] = nextCount

    if (prevCount === 0 && nextCount > 0) {
      this.sortedKeySet.insert(k)
      this.itemByKey[k] = item
      this.opts.onInit?.(item)
    } else if (prevCount > 0 && nextCount === 0) {
      this.sortedKeySet.remove(k)
      this.opts.onDeinit?.(item)
      delete this.itemByKey[k]
    }
  }

  objectToKey(key: T) {
    return this.opts.toKey?.(key) ?? (typeof key === 'number' ? key : `${key}`)
  }

  getCount(key: T) {
    return this.countByKey[this.objectToKey(key)]
  }

  retain(item: T) {
    this.adjustCount(item, 1)
  }

  release(item: T) {
    this.adjustCount(item, -1)
  }

  minItem() {
    const k = this.sortedKeySet.min()
    return k ? this.itemByKey[k] : null
  }

  maxItem() {
    const k = this.sortedKeySet.max()
    return k ? this.itemByKey[k] : null
  }

  liveItems() {
    return Object.values(this.itemByKey)
  }
}
