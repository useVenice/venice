// Temporary file with exports that are safe to use on the frontend.

import * as jwt from 'jsonwebtoken'
import {zUserId} from '@usevenice/cdk-core'
import {z} from '@usevenice/util'

export const zVeniceConnectJwtPayload = z.object({
  sub: zUserId,
  /** Required by supabase/goTrue-js and supabase/realtime */
  exp: z.number(),
  /** Required by supabase/realtime */
  role: z.string(),
  /** Extra metadata for us, though may be better off specified via url params as they do not need to be secure */
  veniceConnect: z.object({
    displayName: z.string().nullish(),
  }),
})

export type VeniceConnectJwtPayload = z.infer<typeof zVeniceConnectJwtPayload>

export {jwt}
