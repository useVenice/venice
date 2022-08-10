import {implementProxyFn} from '@alka/util'
import admin from 'firebase-admin'
import {$admin} from './FirebaseProvider'

implementProxyFn($admin, () => admin)
