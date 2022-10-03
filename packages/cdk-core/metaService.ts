import type {NoInfer, ObjectPartialDeep} from '@usevenice/util'

import type {Id, IDS} from './id.types'
import type {ZRaw} from './meta.types'

export interface MetaTable<
  TID extends string = string,
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  get(id: TID): Promise<T | undefined | null>
  list(options: {
    ids?: TID[]
    /** Maybe remove this? not applicable everywhere */
    ledgerId?: Id['ldgr'] | null
    /** Used for search */
    keywords?: string | null
    /** Pagination, not necessarily supported */
    limit?: number
    offset?: number
  }): Promise<readonly T[]>
  set(id: TID, data: T): Promise<void>
  patch?(id: TID, partial: ObjectPartialDeep<NoInfer<T>>): Promise<void>
  delete(id: TID): Promise<void>
}

export interface LedgerIdResultRow {
  id: Id['ldgr']
  connectionCount?: number
  firstCreatedAt?: unknown
  lastUpdatedAt?: unknown
}

export interface MetaService {
  tables: {
    [k in keyof ZRaw]: MetaTable<Id[typeof IDS[k]], ZRaw[k]>
  }
  // TODO: Make the following methods optional
  // and default to dumb listing all rows from table and in memory filter
  // if the corresponding methods are not implemented
  // This is useful for things like memory
  searchLedgerIds: (options: {
    keywords?: string | null
    limit?: number
    offset?: number
  }) => Promise<readonly LedgerIdResultRow[]>
  searchInstitutions: (options: {
    /** Leave empty to list the top institutions */
    keywords?: string | null
    /** is there a stronger type here than string? */
    providerNames?: string[]
    limit?: number
    offset?: number
  }) => Promise<ReadonlyArray<ZRaw['institution']>>
  findPipelines: (options: {
    connectionIds: Array<Id['conn']>
  }) => Promise<ReadonlyArray<ZRaw['pipeline']>>
}
