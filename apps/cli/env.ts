import {createEnv} from '@t3-oss/env-core'

import {z} from '@usevenice/util'

export function getEnv<T extends z.ZodTypeAny = z.ZodString>(
  name: string,
  schema?: T,
): z.infer<T> {
  const env = createEnv({
    server: {[name]: schema ?? z.string()},
    runtimeEnv: process.env,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return env[name]
}
