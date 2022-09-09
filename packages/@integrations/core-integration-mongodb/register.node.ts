import * as mongodb from 'mongodb'
import {implementProxyFn} from '@ledger-sync/util'
import {$mongodb} from './mongoDBProvider'

implementProxyFn($mongodb, () => mongodb)
