import {TRPCError} from '@trpc/server'

import type {
  AnyIntegrationImpl,
  EndUserId,
  Id,
  LinkFactory,
  MetaService,
  NangoClient,
} from '@usevenice/cdk-core'
import {makeNangoClient} from '@usevenice/cdk-core'
import type {JWTClient, Viewer, ViewerRole} from '@usevenice/cdk-core/viewer'
import {makeJwtClient, zViewerFromJwtPayload} from '@usevenice/cdk-core/viewer'
import {R} from '@usevenice/util'

import type {Env} from '../../apps/app-config/env'
// Should we actually do this hmm
import type {_Integration} from './services'
import {makeServices as _getServices} from './services'

type Services = ReturnType<typeof _getServices>

export interface RouterContext {
  // Viewer-dependent
  viewer: Viewer
  /** Helpers with the designated permission level */
  services: Services
  /** Impersonate a different permission level explicitly */
  as<R extends ViewerRole>(role: R, data: Omit<Viewer<R>, 'role'>): Services

  // Non-viewer dependent
  providerMap: Record<string, AnyIntegrationImpl>
  jwt: JWTClient
  nango: NangoClient
  env: Env
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

  /** For vertical API calls */
  remoteResourceId: Id['reso'] | null
}

export interface ContextFactoryOptions<
  TProviders extends readonly AnyIntegrationImpl[],
  TLinks extends Record<string, LinkFactory>,
> extends Pick<RouterContext, 'apiUrl' | 'getRedirectUrl'> {
  providers: TProviders
  // Backend only
  linkMap?: TLinks

  /** Used for authentication */
  jwtSecret: string
  nangoSecretKey: string
  env: Env

  /** Used to store metadata & configurations */
  getMetaService: (viewer: Viewer) => MetaService
}

export function getContextFactory<
  TProviders extends readonly AnyIntegrationImpl[],
  TLinks extends Record<string, LinkFactory>,
>(config: ContextFactoryOptions<TProviders, TLinks>) {
  const {apiUrl, getRedirectUrl, getMetaService, providers, jwtSecret, env} =
    config
  for (const provider of providers) {
    if (typeof provider.name !== 'string') {
      console.error('Invalid provider', provider)
      throw new Error(`Invalid provider: name=${provider.name}`)
    }
  }
  const providerMap = R.mapToObj(providers, (p) => [p.name, p])
  const jwt = makeJwtClient({secretOrPublicKey: jwtSecret})

  const getServices = (viewer: Viewer) =>
    _getServices({metaService: getMetaService(viewer), providerMap})

  function fromViewer(viewer: Viewer): Omit<RouterContext, 'remoteResourceId'> {
    return {
      viewer,
      as: (role, data) => getServices({role, ...data} as Viewer),
      services: getServices(viewer),
      // --- Non-viewer dependent
      providerMap,
      jwt,
      env,
      nango: makeNangoClient({secretKey: config.nangoSecretKey}),
      apiUrl,
      getRedirectUrl,
    }
  }

  /** not sure if this is needed as most codepath gets us viewer via multiple methods */
  function fromJwtToken(token?: string) {
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
