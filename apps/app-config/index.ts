import {inferProcedureInput, makeCoreSync} from '@ledger-sync/core-sync'
import {ledgerSyncConfig} from './ledgerSync.config'

export * from '@ledger-sync/core-sync'
export * from '@ledger-sync/core-sync-frontend'
export * from './ledgerSync.config'
export * from './constants'

export const [ledgerSync, ledgerSyncRouter, ledgerSyncMetaStore] =
  makeCoreSync(ledgerSyncConfig)
export type LedgerSyncRouter = typeof ledgerSyncRouter
export type LedgerSyncInput = inferProcedureInput<
  LedgerSyncRouter['_def']['mutations']['sync']
>[0]
