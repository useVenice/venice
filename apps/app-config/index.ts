import {inferProcedureInput, makeCoreSync} from '@ledger-sync/engine'
import {ledgerSyncConfig} from './ledgerSync.config'

export * from '@ledger-sync/cdk-core'
export * from '@ledger-sync/engine-frontend'
export * from './ledgerSync.config'
export * from './constants'

export const [ledgerSync, ledgerSyncRouter, ledgerSyncMetaStore] =
  makeCoreSync(ledgerSyncConfig)
export type LedgerSyncRouter = typeof ledgerSyncRouter
export type LedgerSyncInput = inferProcedureInput<
  LedgerSyncRouter['_def']['mutations']['sync']
>[0]
