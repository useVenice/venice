import {implementProxyFn} from '@ledger-sync/util'
import * as slonik from 'slonik'
import {$slonik} from './makePostgresClient'

implementProxyFn($slonik, () => slonik)
