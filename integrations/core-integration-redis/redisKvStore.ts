import {createNodeRedisClient} from 'handy-redis'

import {zKVStore} from '@usevenice/cdk-core'
import {memoize, safeJSONParse, z, zFunction} from '@usevenice/util'

export const makeRedisKVStore = zFunction(
  z.object({redisUrl: z.string().optional()}),
  zKVStore,
  ({redisUrl}) => {
    const redis = memoize(() => createNodeRedisClient({url: redisUrl}))
    return {
      get: (id) =>
        redis().get(id).then(safeJSONParse) as Promise<Record<string, unknown>>,
      list: async () => {
        const keys = await redis().keys('*')
        return Promise.all(
          keys.map((k) =>
            redis()
              .get(k)
              .then(
                (v) =>
                  [k, safeJSONParse(v) as Record<string, unknown>] as const,
              ),
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
