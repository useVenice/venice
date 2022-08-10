import {implementProxyFn} from '@ledger-sync/util'
import admin from 'firebase-admin'
import {$admin} from './FirebaseProvider'

implementProxyFn($admin, () => admin)
