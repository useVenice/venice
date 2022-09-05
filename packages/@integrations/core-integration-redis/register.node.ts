import {$createNodeRedisClient} from './redisKvStore'
import {implementProxyFn} from '@ledger-sync/util'
import {createNodeRedisClient} from 'handy-redis'

implementProxyFn($createNodeRedisClient, () => createNodeRedisClient)
