import {createClient} from '@supabase/supabase-js'

import {commonEnv} from '@usevenice/app-config/commonConfig'
import {jwtDecode} from '@usevenice/cdk-core'
import type {RouterOutput} from '@usevenice/engine-backend'
import type {MaybePromise} from '@usevenice/util'

// TODO: remove this whole file completely as supabase is an optional dependency
// and this includes not depending on Supabase real time to invalidate connection list changes.

export type Connection = RouterOutput['listConnections'][number]

export function createSupabaseClient(
  getToken: () => MaybePromise<string | null | undefined>,
) {
  return createClient(
    commonEnv.NEXT_PUBLIC_SUPABASE_URL,
    commonEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        storage: {
          async getItem() {
            const token = await getToken()
            const jwtData = token ? jwtDecode(token) : null
            return token && jwtData?.exp
              ? JSON.stringify({
                  access_token: token,
                  // Required fields for goTrue-js _isValidSession()
                  // @see https://share.cleanshot.com/1RCGjGrs
                  refresh_token: '',
                  expires_at: jwtData?.exp,
                })
              : null
          },
          removeItem() {},
          setItem() {},
        },
      },
    },
  )
}
