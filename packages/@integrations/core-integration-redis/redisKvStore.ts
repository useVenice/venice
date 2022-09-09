import type {createNodeRedisClient} from 'handy-redis'
import {zKVStore} from '@ledger-sync/cdk-core'
import {
  defineProxyFn,
  memoize,
  safeJSONParse,
  z,
  zFunction,
} from '@ledger-sync/util'

export const $createNodeRedisClient = defineProxyFn<
  () => typeof createNodeRedisClient
>('createNodeRedisClient')

export const makeRedisKVStore = zFunction(
  z.object({redisUrl: z.string().optional()}),
  zKVStore,
  ({redisUrl}) => {
    const redis = memoize(() => $createNodeRedisClient()({url: redisUrl}))

    return {
      get: async (id) => redis().get(id).then(safeJSONParse),
      list: async () => {
        const keys = await redis().keys('*')
        return Promise.all(
          keys.map((k) =>
            redis()
              .get(k)
              .then((v) => [k, safeJSONParse(v)] as const),
          ),
        )
      },
      set: (id, data) =>
        redis()
          .set(id, JSON.stringify(data))
          .then(() => {}),
      close: () => redis().quit(),
    }
  },
)
