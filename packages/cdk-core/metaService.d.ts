import type {NoInfer, ObjectPartialDeep} from '@ledger-sync/util'

import type {Id, IDS} from './id.types'
import type {ZMeta, zMeta} from './meta.types'

export interface MetaTable<
  TID extends string = string,
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  get(id: TID): Promise<T | undefined | null>
  list(options: {
    ids?: TID[]
    ledgerId?: Id['ldgr'] | null
    /** Used for search */
    keywords?: string | null
    /** Pagination, not necessarily supported */
    limit?: number
    offset?: number
  }): Promise<readonly T[]>
  set(id: TID, data: T): Promise<void>
  patch?(id: TID, partial: ObjectPartialDeep<NoInfer<T>>): Promise<void>
  delete?(id: TID): Promise<void>
}

export interface MetaService {
  tables: {
    [k in keyof typeof zMeta]: MetaTable<Id[typeof IDS[k]], ZMeta[k]>
  }
  // Add tables in here instead...
  listTopInstitutions: () => Promise<ReadonlyArray<ZMeta['institution']>>
  findPipelines: (options: {
    connectionId: Id['conn']
  }) => Promise<ReadonlyArray<ZMeta['pipeline']>>
}
