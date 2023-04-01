// Temporary file with exports that are safe to use on the frontend.

import {zUserId} from '@usevenice/cdk-core'
import {z} from '@usevenice/util'

export const zVeniceConnectJwtPayload = z.object({
  sub: zUserId,
  exp: z.number(),
  veniceConnect: z.object({
    displayName: z.string().nullish(),
  }),
})

export type VeniceConnectJwtPayload = z.infer<typeof zVeniceConnectJwtPayload>
