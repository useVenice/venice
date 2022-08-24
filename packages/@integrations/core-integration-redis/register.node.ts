import {implementProxyFn} from '@ledger-sync/util'
import {createNodeRedisClient} from 'handy-redis'
import {$createNodeRedisClient} from './redisKvStore'

implementProxyFn($createNodeRedisClient, () => createNodeRedisClient)
