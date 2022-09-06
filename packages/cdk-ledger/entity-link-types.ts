import type {SyncOperation} from '@ledger-sync/cdk-core'
import type {Standard} from '@ledger-sync/standard'
import {z, zCast} from '@ledger-sync/util'

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
  sourceId: string | undefined
}
export const zEntityPayloadWithExternal = zCast<EntityPayloadWithExternal>()
