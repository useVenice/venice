import {implementProxyFn} from '@ledger-sync/util'
import {MongoClient} from 'mongodb'
import {$mongodb} from './mongoDBProvider'

implementProxyFn($mongodb, () => MongoClient)
