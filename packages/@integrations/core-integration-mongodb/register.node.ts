import {$mongodb} from './mongoDBProvider'
import {implementProxyFn} from '@ledger-sync/util'
import * as mongodb from 'mongodb'

implementProxyFn($mongodb, () => mongodb)
