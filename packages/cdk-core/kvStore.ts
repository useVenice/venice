import type {
  Json,
  MaybePromise,
  NoInfer,
  ObjectPartialDeep,
} from '@ledger-sync/util'
import {R, zCast} from '@ledger-sync/util'

import type {Id, IDS} from './id.types'
import type {ZMeta, zMeta} from './meta.types'

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

export interface MetaTable<
  TID extends string = string,
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  get(id: TID): Promise<T | undefined | null>
  list?(options: {
    ledgerId?: Id['ldgr']
    /** Used for search */
    keywords?: string
    /** Pagination, not necessarily supported */
    limit?: number
    offset?: number
  }): Promise<readonly T[]>
  set(id: TID, data: T): Promise<void>
  patch?(id: TID, partial: ObjectPartialDeep<NoInfer<T>>): Promise<void>
  delete?(id: TID): Promise<void>
}

export type MetaBase = {
  [k in keyof typeof zMeta]: MetaTable<Id[typeof IDS[k]], ZMeta[k]> //& {entityName: k}
} & {
  findPipelines: (options: {
    connectionId: Id['conn']
  }) => Promise<ReadonlyArray<ZMeta['pipeline']>>
}
