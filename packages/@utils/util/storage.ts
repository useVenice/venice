import type {Promisable} from './type-utils'

export interface Storage {
  getItem(key: string): Promisable<string | null>
  setItem(key: string, value: string): Promisable<void>
  removeItem(key: string): Promisable<void>
}

export function makeInMemoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value)
    },
    removeItem: (key) => {
      map.delete(key)
    },
  }
}
