import {cookies} from 'next/headers'

import type {kAccessToken} from '../lib/constants'
import {createSSRHelpers} from './server-helpers'

export function createServerComponentHelpers(opts?: {
  params: {[kAccessToken]?: string | string[]}
}) {
  return createSSRHelpers({cookies, params: opts?.params})
}
