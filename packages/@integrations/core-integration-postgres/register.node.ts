import {implementProxyFn} from '@ledger-sync/util'
import * as slonikMigrator from '@slonik/migrator'
import * as slonik from 'slonik'
import {$slonik, $slonikMigrator} from './makePostgresClient'

implementProxyFn($slonik, () => slonik)
implementProxyFn($slonikMigrator, () => slonikMigrator)
