import * as jwt from 'jsonwebtoken'
import {TRPCError} from '@trpc/server'

import {z, zFunction} from '@usevenice/util'

import type {EndUserId, Id, UserId} from './id.types'
import {zEndUserId, zId, zUserId} from './id.types'

export const zRole = z.enum(['anon', 'end_user', 'user', 'workspace', 'system'])

export const zViewer = z.discriminatedUnion('role', [
  z.object({role: z.literal(zRole.Enum.anon)}),
  // prettier-ignore
  z.object({role: z.literal(zRole.Enum.end_user), endUserId: zEndUserId, workspaceId: zId('ws')}),
  // prettier-ignore
  z.object({role: z.literal(zRole.Enum.user), userId: zUserId, workspaceId: zId('ws').nullish()}),
  z.object({role: z.literal(zRole.Enum.workspace), workspaceId: zId('ws')}),
  z.object({role: z.literal(zRole.Enum.system)}),
])

export type ViewerRole = z.infer<typeof zRole>
export type Viewer<R extends ViewerRole = ViewerRole> = Extract<
  z.infer<typeof zViewer>,
  {role: R}
>

export function hasRole<R extends ViewerRole>(
  viewer: Viewer,
  roles: R[],
): viewer is Viewer<R> {
  return roles.includes(viewer.role as R)
}

// MARK: - JWT

export const zJwtPayload = z.object({
  /** Different meaning in different contexts */
  sub: z.string(),
  /**
   * Jwt role is different from viewer role because supabase uses authenticated
   * by default and it's a bit too much work right now to switch
   * futher we never want to permit system role for now for security, and anon role has no token
   */
  role: z.enum(['authenticated', 'end_user', 'workspace']),
  /** Enforce that all jwts are timed. The actual validity check is done by jwtClient */
  exp: z.number(),
})

export const zViewerFromJwtPayload = zJwtPayload
  .nullish()
  .transform((payload): Viewer => {
    // console.log('zViewerFromJwtPayload', payload)
    switch (payload?.role) {
      case undefined:
        return {role: 'anon'}
      case 'authenticated':
        return {role: 'user', userId: payload.sub as UserId}
      case 'end_user': {
        const [workspaceId, endUserId] = payload.sub.split('/') as [
          Id['ws'],
          EndUserId,
        ]
        return {role: payload.role, endUserId, workspaceId}
      }
      case 'workspace':
        return {role: payload.role, workspaceId: payload.sub as Id['ws']}
    }
  })
  .pipe(zViewer)
  // Not ideal we have to explictly type, but oh well
  .refine((_): _ is Viewer<'anon' | 'end_user' | 'user' | 'workspace'> => true)

export const zViewerFromUnverifiedJwtToken = z
  .string()
  .nullish()
  .transform((token) => (token ? jwt.decode(token, {json: true}) : token))
  .pipe(zViewerFromJwtPayload)

// MARK: - JWT Client, maybe doesn't actually belong in here? Among
// other things would allow us to not have to import @trpc/server on the frontend

export function jwtDecode(token: string) {
  return jwt.decode(token, {json: true})
}

export const makeJwtClient = zFunction(
  z.object({secretOrPublicKey: z.string()}),
  ({secretOrPublicKey}) => ({
    verifyViewer: (token?: string | null): Viewer => {
      if (!token) {
        return {role: 'anon'}
      }
      try {
        const data = jwt.verify(token, secretOrPublicKey)
        if (typeof data === 'string') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'JWT payload must be an object, not a string.',
          })
        }
        return zViewerFromJwtPayload.parse(data)
      } catch (err) {
        // This dependency is not great... But don't know of a better pattern for now
        throw new TRPCError({code: 'UNAUTHORIZED', message: `${err}`})
      }
    },
    signViewer: (
      viewer: Viewer<'end_user' | 'user' | 'workspace'>,
      {validityInSeconds = 3600}: {validityInSeconds?: number} = {},
    ) => {
      const payload = {
        exp: Math.floor(Date.now() / 1000) + validityInSeconds,
        ...(viewer.role === 'end_user' && {
          role: 'end_user',
          sub: `${viewer.workspaceId}/${viewer.endUserId}`,
        }),
        ...(viewer.role === 'workspace' && {
          role: 'workspace',
          sub: viewer.workspaceId,
        }),
        ...(viewer.role === 'user' && {
          role: 'authenticated',
          sub: viewer.userId,
        }),
        // Partial is a lie, it should not happen
      } satisfies Partial<z.input<typeof zViewerFromJwtPayload>>

      return jwt.sign(payload, secretOrPublicKey)
    },
  }),
)

export type JWTClient = ReturnType<typeof makeJwtClient>
