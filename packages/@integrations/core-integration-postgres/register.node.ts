import {$slonik, $slonikMigrator} from './makePostgresClient'
import {implementProxyFn} from '@ledger-sync/util'
import * as slonikMigrator from '@slonik/migrator'
import * as slonik from 'slonik'

implementProxyFn($slonik, () => slonik)
implementProxyFn($slonikMigrator, () => slonikMigrator)
