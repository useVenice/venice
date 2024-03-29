import {logLink} from '@opensdks/runtime'
import type {AnyConnectorImpl} from '@usevenice/cdk'
import {nangoProxyLink} from '@usevenice/cdk'
import {R} from '@usevenice/util'
import type {_ResourceExpanded} from './dbService'
import {makeDBService} from './dbService'
import type {MetaService} from './metaService'
import {makeSyncService} from './sync-service'

export function makeServices({
  metaService,
  connectorMap,
  env,
}: {
  metaService: MetaService
  connectorMap: Record<string, AnyConnectorImpl>
  env: {NANGO_SECRET_KEY: string}
  // TODO: Fix any type
}) {
  const dbService = makeDBService({
    metaService,
    connectorMap,
  })
  function getFetchLinks(reso: _ResourceExpanded) {
    return R.compact([
      logLink(),
      reso.connectorConfig.connector.metadata?.nangoProvider &&
        nangoProxyLink({
          secretKey: env.NANGO_SECRET_KEY,
          connectionId: reso.id,
          providerConfigKey: reso.connectorConfigId,
        }),
    ])
  }
  const syncService = makeSyncService({
    metaService,
    metaLinks: dbService.metaLinks,
    getPipelineExpandedOrFail: dbService.getPipelineExpandedOrFail,
    getResourceExpandedOrFail: dbService.getResourceExpandedOrFail,
    getFetchLinks,
  })

  return {...dbService, ...syncService, getFetchLinks}
}
