import {makePostgresConfigService} from '@ledger-sync/core-integration-postgres'
import {type inferProcedureInput, makeSyncEngine} from '@ledger-sync/engine'

import {getEnv, ledgerSyncConfig} from './ledgerSync.config'

export * from '@ledger-sync/cdk-core'
export {
  parseWebhookRequest,
  type inferProcedureInput,
} from '@ledger-sync/engine'
export * from './constants'
export * from './ledgerSync.config'

export const [ledgerSync, ledgerSyncRouter, ledgerSyncMetaStore] =
  makeSyncEngine(
    ledgerSyncConfig,
    makePostgresConfigService({
      databaseUrl: getEnv('POSTGRES_URL'),
    }),
  )
export type LedgerSyncRouter = typeof ledgerSyncRouter
export type LedgerSyncInput = inferProcedureInput<
  LedgerSyncRouter['_def']['mutations']['syncPipeline']
>[0]
