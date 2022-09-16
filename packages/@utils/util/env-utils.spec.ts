import {z} from 'zod'

import {zEnvVars} from './env-utils'
import {zParser} from './zod-utils'

const env = zEnvVars({
  MY_KEY: z.string(),
})

test('Error thrown includes name of the env var', () => {
  expect(() => zParser(env).parseUnknown({MY_KEY2: 2})).toThrow(
    'MY_KEY is required',
  )
})
