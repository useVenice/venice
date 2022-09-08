import {createNodeRedisClient} from 'handy-redis'
import {implementProxyFn} from '@ledger-sync/util'
import {$createNodeRedisClient} from './redisKvStore'

implementProxyFn($createNodeRedisClient, () => createNodeRedisClient)
