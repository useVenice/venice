import {inferProcedureInput, makeCoreSync} from '@ledger-sync/core-sync'
import {lsTestConfig} from './ledgerSync.config'

export * from '@ledger-sync/core-sync'
export * from '@ledger-sync/core-sync-frontend'

export * from './ledgerSync.config'

export const [demoLedgerSync, demoRouter, demoMetaStore] =
  makeCoreSync(lsTestConfig)
export type DemoRouter = typeof demoRouter
export type DemoSyncInput = inferProcedureInput<
  DemoRouter['_def']['mutations']['sync']
>[0]
