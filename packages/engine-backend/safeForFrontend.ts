// Temporary file with exports that are safe to use on the frontend.

import {zUserId} from '@usevenice/cdk-core'
import {z} from '@usevenice/util'

export const zVeniceConnectJwtPayload = z.object({
  sub: z.string(),
  exp: z.number(),
  veniceConnect: z.object({
    tenantId: zUserId,
    ledgerId: z.string(),
    displayName: z.string().nullish(),
  }),
})

export type VeniceConnectJwtPayload = z.infer<typeof zVeniceConnectJwtPayload>
