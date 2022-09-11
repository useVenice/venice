import {
  type inferProcedureInput,
  makeSyncEngine,
} from '@ledger-sync/engine-backend'

import {ledgerSyncConfig} from './ledgerSync.config'

export * from '@ledger-sync/cdk-core'
export {
  parseWebhookRequest,
  type inferProcedureInput,
} from '@ledger-sync/engine-backend'
export * from './ledgerSync.config'

export const [ledgerSync, ledgerSyncRouter, ledgerSyncMetaStore] =
  makeSyncEngine(ledgerSyncConfig)
export type LedgerSyncRouter = typeof ledgerSyncRouter
export type LedgerSyncInput = inferProcedureInput<
  LedgerSyncRouter['_def']['mutations']['syncPipeline']
>[0]
