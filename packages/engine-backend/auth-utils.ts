import {TRPCError} from '@trpc/server'
import * as jwt from 'jsonwebtoken'

import {zUserId} from '@usevenice/cdk-core'
import {z, zFunction, zGuard} from '@usevenice/util'
import {xAdminUserMetadataKey} from './safeForFrontend'

export type UserInfo = z.infer<typeof __zUserInfo>
const __zUserInfo = z.object({
  userId: zUserId.nullish(), // Is this right?
  isAdmin: z.boolean().nullish(),
})

export type ParseJwtPayload = (jwtPayload: jwt.JwtPayload) => UserInfo

export type EngineContext = z.infer<ReturnType<typeof _zContext>>

export const _zContext = (...args: Parameters<typeof _zUserInfo>) => {
  const zUserInfo = _zUserInfo(...args)
  return z
    .object({accessToken: zUserInfo})
    .transform(({accessToken: userInfo}) => ({
      userId: userInfo.userId ?? undefined,
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
      userId: jwt.sub,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      isAdmin: jwt['user_metadata']?.[xAdminUserMetadataKey] === true,
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
