import {implementProxyFn} from '@ledger-sync/util'
import * as mongoDB from 'mongodb'
import {$mongodb} from './mongoDBProvider'

implementProxyFn($mongodb, () => mongoDB)
