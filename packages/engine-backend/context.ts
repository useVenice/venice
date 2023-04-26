import {TRPCError} from '@trpc/server'
import type {
  AnySyncProvider,
  EndUserId,
  Link,
  LinkFactory,
  MetaService,
} from '@usevenice/cdk-core'
import {zEndUserId, zId, zUserId} from '@usevenice/cdk-core'
import {R, z, zFunction} from '@usevenice/util'
import * as jwt from 'jsonwebtoken'
import type {_Integration, _Pipeline} from './contextHelpers'
import {getContextHelpers} from './contextHelpers'
import type {PipelineInput, ResourceInput} from './types'

export const zRole = z.enum(['anon', 'end_user', 'user', 'workspace', 'system'])

export const zViewer = z.discriminatedUnion('role', [
  z.object({role: z.literal(zRole.Enum.anon)}),
  // prettier-ignore
  z.object({role: z.literal(zRole.Enum.end_user), endUserId: zEndUserId, workspaceId: zId('ws')}),
  z.object({role: z.literal(zRole.Enum.user), userId: zUserId}),
  z.object({role: z.literal(zRole.Enum.workspace), workspaceId: zId('ws')}),
  z.object({role: z.literal(zRole.Enum.system)}),
])

type Helpers = ReturnType<typeof getContextHelpers>
type ViewerRole = z.infer<typeof zRole>
export type Viewer<R extends ViewerRole = ViewerRole> = Extract<
  z.infer<typeof zViewer>,
  {role: R}
>

export interface RouterContext {
  viewer: Viewer
  /** Helpers with the designated permission level */
  current: Helpers
  /** Impersonate a different permission level explicitly */
  as<R extends ViewerRole>(role: R, data: Omit<Viewer<R>, 'role'>): Helpers
}

// MARK: - JWT

export const zViewerFromJwtPayload = z
  .object({
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
  .transform(({sub, role}) => {
    switch (role) {
      case 'authenticated':
        return {role, userId: sub}
      case 'end_user': {
        const [workspaceId, endUserId] = sub.split('/')
        return {role, endUserId, workspaceId}
      }
      case 'workspace':
        return {role, workspaceId: sub}
    }
  })
  .pipe(zViewer)

export interface ContextFactoryOptions<
  TProviders extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
> {
  providers: TProviders
  /**
   * Base url of the engine-backend router when deployed, e.g. `localhost:3000/api/usevenice`
   * This is needed for 1) server side rendering and 2) webhook handling
   */
  apiUrl: string

  /** Used for oauth based resources */
  getRedirectUrl?: (
    integration: _Integration,
    ctx: {endUserId?: EndUserId | null},
  ) => string

  // Backend only
  linkMap?: TLinks

  /** Used for authentication */
  jwtSecret: string

  /** Used to store metadata */
  getMetaService: (viewer: Viewer) => MetaService
  getLinksForPipeline?: (pipeline: _Pipeline) => Link[]

  getDefaultPipeline?: (
    connInput?: ResourceInput<TProviders[number]>,
  ) => PipelineInput<TProviders[number], TProviders[number], TLinks>
}

export function contextFactory<
  TProviders extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>({
  // getLinksForPipeline,
  // apiUrl,
  // getRedirectUrl,
  getMetaService,
  providers,
  jwtSecret,
}: ContextFactoryOptions<TProviders, TLinks>) {
  const providerMap = R.mapToObj(providers, (p) => [p.name, p])
  const jwtClient = makeJwtClient({secretOrPublicKey: jwtSecret})

  const getHelpers = (viewer: Viewer) =>
    getContextHelpers({metaService: getMetaService(viewer), providerMap})

  function fromViewer(viewer: Viewer): RouterContext {
    return {
      viewer,
      as: (role, data) => getHelpers({role, ...data} as Viewer),
      current: getHelpers(viewer),
    }
  }

  function fromJwtToken(token?: string): RouterContext {
    if (!token) {
      return fromViewer({role: 'anon'})
    }

    try {
      const data = jwtClient.verify(token)
      return fromViewer(zViewerFromJwtPayload.parse(data))
    } catch (err) {
      console.warn('JwtError', err)
      throw new TRPCError({code: 'UNAUTHORIZED', message: `${err}`})
    }
  }

  return {fromViewer, fromJwtToken}
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
