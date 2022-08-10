import {z, zCast} from '@alka/util'
import {SyncOperation} from '@ledger-sync/core-sync'

export type EntityPayload =
  | {entityName: 'account'; entity: Standard.Account | null; id: string}
  | {entityName: 'transaction'; entity: Standard.Transaction | null; id: string}
  | {entityName: 'commodity'; entity: Standard.Commodity | null; id: string}
export const zEntityPayload = zCast<EntityPayload>()

// How to reduce duplication?
export const zEntityName = z.enum(['account', 'transaction', 'commodity'])

export type StdSyncOperation = SyncOperation<EntityPayload>

export type EntityPayloadWithExternal = EntityPayload & {
  external: unknown
  externalId: string
  providerName: string
  connectionId: string | undefined
}
export const zEntityPayloadWithExternal = zCast<EntityPayloadWithExternal>()
