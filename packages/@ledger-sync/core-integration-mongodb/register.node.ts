import {implementProxyFn} from '@ledger-sync/util'
import * as mongodb from 'mongodb'
import {$mongodb} from './mongoDBProvider'

implementProxyFn($mongodb, () => mongodb)
