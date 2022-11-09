import * as mongodb from 'mongodb'

import {implementProxyFn} from '@usevenice/util'

import {$mongodb} from './mongoDBProvider'

implementProxyFn($mongodb, () => mongodb)
