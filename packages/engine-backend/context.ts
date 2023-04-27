import {TRPCError} from '@trpc/server'
import type {
  AnySyncProvider,
  EndUserId,
  Link,
  LinkFactory,
  MetaService,
} from '@usevenice/cdk-core'
import {R} from '@usevenice/util'
import type {_Integration, _Pipeline} from './contextHelpers'
import {getContextHelpers} from './contextHelpers'
import type {PipelineInput, ResourceInput} from './types'
import type {JWTClient, Viewer, ViewerRole} from './viewer'
import {makeJwtClient, zViewerFromJwtPayload} from './viewer'

type Helpers = ReturnType<typeof getContextHelpers>

export interface RouterContext {
  // Viewer-dependent
  viewer: Viewer
  /** Helpers with the designated permission level */
  helpers: Helpers
  /** Impersonate a different permission level explicitly */
  as<R extends ViewerRole>(role: R, data: Omit<Viewer<R>, 'role'>): Helpers

  // Non-viewer dependent
  providerMap: Record<string, AnySyncProvider>
  jwt: JWTClient
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
}

export interface ContextFactoryOptions<
  TProviders extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
> extends Pick<RouterContext, 'apiUrl' | 'getRedirectUrl'> {
  providers: TProviders
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

export function getContextFactory<
  TProviders extends readonly AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>(config: ContextFactoryOptions<TProviders, TLinks>) {
  const {
    // getLinksForPipeline,
    apiUrl,
    getRedirectUrl,
    getMetaService,
    providers,
    jwtSecret,
  } = config
  const providerMap = R.mapToObj(providers, (p) => [p.name, p])
  const jwt = makeJwtClient({secretOrPublicKey: jwtSecret})

  const getHelpers = (viewer: Viewer) =>
    getContextHelpers({metaService: getMetaService(viewer), providerMap})

  function fromViewer(viewer: Viewer): RouterContext {
    return {
      viewer,
      as: (role, data) => getHelpers({role, ...data} as Viewer),
      helpers: getHelpers(viewer),
      // --- Non-viewer dependent
      providerMap,
      jwt,
      apiUrl,
      getRedirectUrl,
    }
  }

  /** not sure if this is needed as most codepath gets us viewer via multiple methods */
  function fromJwtToken(token?: string): RouterContext {
    if (!token) {
      return fromViewer({role: 'anon'})
    }

    try {
      const data = jwt.verifyViewer(token)
      return fromViewer(zViewerFromJwtPayload.parse(data))
    } catch (err) {
      console.warn('JwtError', err)
      throw new TRPCError({code: 'UNAUTHORIZED', message: `${err}`})
    }
  }

  return {config, fromViewer, fromJwtToken}
}