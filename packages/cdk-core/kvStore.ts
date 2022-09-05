import type {
  Json,
  MaybePromise,
  NoInfer,
  ObjectPartialDeep,
} from '@ledger-sync/util'
import {R, zCast} from '@ledger-sync/util'

export interface KVStore<T = Json> {
  get(id: string): MaybePromise<T | null | undefined>
  list(): MaybePromise<ReadonlyArray<readonly [string, T]>>

  /** `null` to delete */
  set(id: string, data: T | null): MaybePromise<void>
  // Deep partial really
  patch?(id: string, data: ObjectPartialDeep<NoInfer<T>>): MaybePromise<void>

  // Do we need these? If so introduce soon
  // delete?(id: string): MaybePromise<void>
  commit?(): Promise<void>
  /** Clean up any resources, disconnect... */
  close?(): Promise<unknown>
}

export const zKVStore = zCast<KVStore<Record<string, unknown>>>()

/** Technically does not belong in FS, but we also don't have a good place for it for now... */
export function makeMemoryKVStore<T>(): KVStore<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cache: Record<string, any> = {}
  return {
    get: (id) => cache[id],
    list: () => R.toPairs(cache),
    set: (id, data) => {
      if (!data) {
        delete cache[id]
      } else {
        cache[id] = data
      }
    },
  }
}
