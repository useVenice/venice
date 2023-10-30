import type {NoInfer, ObjectPartialDeep} from '@usevenice/util'

import type {EndUserId, Id, IDS} from './id.types'
import type {ZRaw} from './meta.types'

export interface MetaTable<
  TID extends string = string,
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  get(id: TID): Promise<T | undefined | null>
  list(options: {
    ids?: TID[]
    /** Maybe remove this? not applicable everywhere */
    endUserId?: EndUserId | null
    /** Maybe remove this? not applicable everywhere */
    integrationId?: Id['int'] | null
    /** Maybe remove this? not applicable everywhere */
    providerName?: string | null
    /** Used for search */
    keywords?: string | null
    /** Pagination, not necessarily supported */
    limit?: number
    offset?: number
  }): Promise<readonly T[]>
  set(id: TID, data: Omit<T, 'id'>): Promise<void>
  patch?(id: TID, partial: ObjectPartialDeep<NoInfer<T>>): Promise<void>
  delete(id: TID): Promise<void>
}

export interface EndUserResultRow {
  id: EndUserId
  resourceCount?: number
  firstCreatedAt?: unknown
  lastUpdatedAt?: unknown
}

export interface MetaService {
  tables: {
    [k in keyof ZRaw]: MetaTable<Id[(typeof IDS)[k]], ZRaw[k]>
  }
  // TODO: Make the following methods optional
  // and default to dumb listing all rows from table and in memory filter
  // if the corresponding methods are not implemented
  // This is useful for things like memory
  searchEndUsers: (options: {
    keywords?: string | null
    limit?: number
    offset?: number
  }) => Promise<readonly EndUserResultRow[]>
  searchInstitutions: (options: {
    /** Leave empty to list the top institutions */
    keywords?: string | null
    /** is there a stronger type here than string? */
    providerNames?: string[]
    limit?: number
    offset?: number
  }) => Promise<ReadonlyArray<ZRaw['institution']>>
  /** TODO: Implement limit & offset */
  findPipelines: (options: {
    resourceIds?: Array<Id['reso']>
    secondsSinceLastSync?: number
  }) => Promise<ReadonlyArray<ZRaw['pipeline']>>
  /** Id is used to check RLS policy right now for end user */
  listIntegrationInfos: (opts?: {
    id?: Id['int'] | null
    providerName?: string | null
  }) => Promise<
    ReadonlyArray<{
      id: Id['int']
      envName?: string | null
      displayName?: string | null
    }>
  >
}
