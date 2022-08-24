import {inferProcedureInput, makeCoreSync} from '@ledger-sync/core-sync'
import {lsTestConfig} from './lsTestConfig'

// export * from './testOptions'
export * from './lsTestConfig'
export * from '@ledger-sync/core-sync'
export * from '@ledger-sync/core-sync-frontend'

export const [demoLedgerSync, demoRouter, demoMetaStore] =
  makeCoreSync(lsTestConfig)
export type DemoRouter = typeof demoRouter
export type DemoSyncInput = inferProcedureInput<
  DemoRouter['_def']['mutations']['sync']
>[0]
