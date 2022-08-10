import {implementProxyFn} from '@ledger-sync/util'
import {Pool} from 'pg'
import {$pgPool} from './makePostgresKVStore'

implementProxyFn($pgPool, () => Pool)
