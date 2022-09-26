import {createNodeRedisClient} from 'handy-redis'

import {implementProxyFn} from '@usevenice/util'

import {$createNodeRedisClient} from './redisKvStore'

implementProxyFn($createNodeRedisClient, () => createNodeRedisClient)
