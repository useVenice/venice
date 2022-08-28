import {type inferProcedureInput, makeSyncEngine} from '@ledger-sync/engine'
import {ledgerSyncConfig} from './ledgerSync.config'

export * from '@ledger-sync/cdk-core'
export {
  parseWebhookRequest,
  type inferProcedureInput,
} from '@ledger-sync/engine'
export * from './constants'
export * from './ledgerSync.config'

export const [ledgerSync, ledgerSyncRouter, ledgerSyncMetaStore] =
  makeSyncEngine(ledgerSyncConfig)
export type LedgerSyncRouter = typeof ledgerSyncRouter
export type LedgerSyncInput = inferProcedureInput<
  LedgerSyncRouter['_def']['mutations']['syncPipeline']
>[0]
