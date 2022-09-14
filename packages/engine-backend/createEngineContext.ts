import * as jwt from 'jsonwebtoken'
import {TRPCError} from '@trpc/server'

import {zId} from '@ledger-sync/cdk-core'
import {z, zFunction} from '@ledger-sync/util'

import type {SyncEngineConfig} from './makeSyncEngine'

export type UserInfo = z.infer<typeof zUserInfo>
export const zUserInfo = z.object({
  ledgerId: zId('ldgr').nullish(),
  isAdmin: z.boolean().nullish(),
})

export type EngineContext = UserInfo

/** TODO: Use OpenApiMeta from https://github.com/jlalmes/trpc-openapi */
export interface EngineMeta {}

export const createEngineContext = (
  config: Pick<
    SyncEngineConfig<[], {}>,
    'jwtSecretOrPublicKey' | 'userInfoFromJwt'
  >,
  ctxInput: {accessToken?: string},
): EngineContext => {
  // Still need to return userId... JWT decode?
  // console.log('createEngineContext', config, ctxInput)
  if (!config.jwtSecretOrPublicKey) {
    return {}
  }
  if (!ctxInput.accessToken) {
    return {}
  }
  const userInfoFromJwt =
    config.userInfoFromJwt ??
    ((jwt) => ({
      ledgerId: jwt.sub,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/dot-notation
      isAdmin: jwt['user_metadata']?.['isAdmin'] === true,
    }))
  const jwt = makeJwtClient({secretOrPublicKey: config.jwtSecretOrPublicKey})

  const payload = jwt.verify(ctxInput.accessToken)
  const userInfo = userInfoFromJwt(payload)
  // console.log({payload, userInfo})

  return zUserInfo.parse(userInfo)
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
