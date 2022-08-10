import {implementProxyFn} from '@alka/util'
import {Pool} from 'pg'
import {$pgPool} from './makePostgresKVStore'

implementProxyFn($pgPool, () => Pool)
