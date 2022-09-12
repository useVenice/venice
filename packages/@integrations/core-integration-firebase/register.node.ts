import admin from 'firebase-admin'

import {implementProxyFn} from '@ledger-sync/util'

import {$admin} from './FirebaseProvider'

implementProxyFn($admin, () => admin)
