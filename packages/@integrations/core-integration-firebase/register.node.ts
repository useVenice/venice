import {$admin} from './FirebaseProvider'
import {implementProxyFn} from '@ledger-sync/util'
import admin from 'firebase-admin'

implementProxyFn($admin, () => admin)
