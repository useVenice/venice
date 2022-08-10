import {implementProxyFn} from '@alka/util'
import {createNodeRedisClient} from 'handy-redis'
import {$createNodeRedisClient} from './redisKvStore'

implementProxyFn($createNodeRedisClient, () => createNodeRedisClient)
