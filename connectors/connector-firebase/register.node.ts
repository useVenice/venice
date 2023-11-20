import admin from 'firebase-admin'

import {implementProxyFn} from '@usevenice/util'

import {$admin} from './server'

implementProxyFn($admin, () => admin)
