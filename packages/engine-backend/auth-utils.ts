import {TRPCError} from '@trpc/server'
import * as jwt from 'jsonwebtoken'

import {zEndUserId, zId} from '@usevenice/cdk-core'
import {z, zFunction, zGuard} from '@usevenice/util'
import {xAdminAppMetadataKey} from './safeForFrontend'

export type UserInfo = z.infer<typeof __zUserInfo>
const __zUserInfo = z.object({
  endUserId: zEndUserId.nullish(), // Is this right?
  // TODO: Consider how to reconcile between userId vs. endUserId.

  // Cannot have this return zUserId for some reason.. not working...
  userId: z.string().nullish(),
  role: z.enum(['end_user', 'authenticated']).nullish(),
  /** @deprecated */
  isAdmin: z.boolean().nullish(),

  workspaceId: zId('ws').nullish(),
})

export type ParseJwtPayload = (jwtPayload: jwt.JwtPayload) => UserInfo

export type EngineContext = z.infer<ReturnType<typeof _zContext>>

export const _zContext = (...args: Parameters<typeof _zUserInfo>) => {
  const zUserInfo = _zUserInfo(...args)
  return z
    .object({accessToken: zUserInfo})
    .transform(({accessToken: userInfo}) => ({
      endUserId: userInfo.endUserId ?? undefined,
      userId: userInfo.userId ?? undefined,
      role: userInfo.role ?? undefined,
      isAdmin: userInfo.isAdmin ?? false,
      userInfo,
    }))
}

export const _zUserInfo = (options: {
  /** If undefined, will use jwtDecode */
  parseJwtToken?: (token: string) => jwt.JwtPayload
  parseJwtPayload?: ParseJwtPayload
}) => {
  const parseJwtToken =
    options.parseJwtToken ?? ((token) => jwt.decode(token, {json: true}))

  const parseJwtPayload =
    options.parseJwtPayload ??
    ((jwt) => ({
      endUserId: jwt.sub,
      userId: jwt.sub,
      role: jwt['role'],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      isAdmin: jwt['app_metadata']?.[xAdminAppMetadataKey] === true,
    }))

  // Still need to return userId... JWT decode?
  // console.log('createEngineContext', config, ctxInput)

  return z
    .string()
    .nullish()
    .transform(
      zGuard((token) => {
        const payload = token ? parseJwtToken(token) : undefined
        const userInfo = parseJwtPayload(payload ?? {})
        return __zUserInfo.parse(userInfo)
      }),
    )
}

export const makeJwtClient = zFunction(
  z.object({secretOrPublicKey: z.string()}),
  ({secretOrPublicKey}) => ({
    verify: (token: string) => {
      try {
        const data = jwt.verify(token, secretOrPublicKey)
        if (typeof data === 'string') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Unexpected jwt data',
          })
        }
        return data
      } catch (err) {
        // This dependency is not great... But don't know of a better pattern for now
        throw new TRPCError({code: 'UNAUTHORIZED', message: `${err}`})
      }
    },
    decode: (token: string) => jwt.decode(token),
    sign: (payload: jwt.JwtPayload) => jwt.sign(payload, secretOrPublicKey),
  }),
)
