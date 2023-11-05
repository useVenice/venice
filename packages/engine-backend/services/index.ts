/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {TRPCError} from '@trpc/server'

import type {AnyIntegrationImpl, Id, IDS, ZRaw} from '@usevenice/cdk-core'
import {extractId, zRaw} from '@usevenice/cdk-core'
import type {ObjectPartialDeep} from '@usevenice/util'
import {deepMerge, z} from '@usevenice/util'

import {makeMetaLinks} from './makeMetaLinks'
import type {MetaService, MetaTable} from './metaService'
import {makeSyncService} from './sync-service'

export function makeServices({
  metaService,
  providerMap,
}: {
  metaService: MetaService
  providerMap: Record<string, AnyIntegrationImpl>
  // TODO: Fix any type
}) {
  const dbService = makeDBService({
    metaService,
    providerMap,
  })
  const syncService = makeSyncService({
    metaService,
    getPipelineExpandedOrFail: dbService.getPipelineExpandedOrFail,
    metaLinks: dbService.metaLinks,
  })
  return {...dbService, ...syncService}
}

export type _Integration = Awaited<
  ReturnType<ReturnType<typeof makeDBService>['getIntegrationOrFail']>
>
export type _PipelineExpanded = Awaited<
  ReturnType<ReturnType<typeof makeDBService>['getPipelineExpandedOrFail']>
>
export type _ResourceExpanded = Awaited<
  ReturnType<ReturnType<typeof makeDBService>['getResourceExpandedOrFail']>
>

export function makeDBService({
  metaService,
  providerMap,
}: {
  metaService: MetaService
  providerMap: Record<string, AnyIntegrationImpl>
}) {
  // TODO: Escalate to workspace level permission so it works for end users
  // TODO: Consider giving end users no permission at all?
  // It really does feel like we need some internal GraphQL for this...
  // Except different entities may still need to be access with different permissions...
  const getProviderOrFail = (id: Id['int'] | Id['reso']) => {
    const providerName = extractId(id)[1]
    const provider = providerMap[providerName]
    if (!provider) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Cannot find provider for ${id}`,
      })
    }
    return provider
  }

  // TODO: Replace other getOrFail with this
  // TODO: Abstract this into a wrapper around metaService
  // so it can be used by other files such as metaLinks too
  const get = async <TTable extends keyof ZRaw>(
    tableName: TTable,
    id: Id[(typeof IDS)[TTable]],
  ) => {
    const table: MetaTable = metaService.tables[tableName]
    const data = await table.get(id)
    return data ? (zRaw[tableName].parse(data) as ZRaw[TTable]) : null
  }
  const getOrFail = async <TTable extends keyof ZRaw>(
    tableName: TTable,
    id: Id[(typeof IDS)[TTable]],
  ) => {
    const data = await get(tableName, id)
    if (!data) {
      throw new TRPCError({code: 'NOT_FOUND', message: `${tableName}: ${id}`})
    }
    return data
  }
  const list = async <TTable extends keyof ZRaw>(
    tableName: TTable,
    ...args: Parameters<MetaTable['list']>
  ) => {
    const table: MetaTable = metaService.tables[tableName]
    const results = await table.list(...args)
    return results.map((r) => zRaw[tableName].parse(r) as ZRaw[TTable])
  }

  const patch = async <TTable extends keyof ZRaw>(
    tableName: TTable,
    id: Id[(typeof IDS)[TTable]],
    _patch: ObjectPartialDeep<ZRaw[TTable]>,
  ) => {
    // TODO: Validate integration.config and resource.settings
    if (Object.keys(_patch).length === 0) {
      return
    }
    let schema: z.AnyZodObject = zRaw[tableName]

    // eslint-disable-next-line unicorn/prefer-switch
    if (tableName === 'integration') {
      // The typing here isn't perfect. We want to make sure we are
      // overriding not just extending with arbitary properties
      schema = (schema as (typeof zRaw)['integration']).extend({
        // This should be an override...
        config:
          getProviderOrFail(id as Id['int']).def.integrationConfig ??
          z.object({}).nullish(),
      })
    } else if (tableName === 'resource') {
      schema = (schema as (typeof zRaw)['resource']).extend({
        // This should be an override...
        settings:
          getProviderOrFail(id as Id['reso']).def.resourceSettings ??
          z.object({}).nullish(),
      })
    } else if (tableName === 'pipeline') {
      // TODO: How do we validate if source or destination id is not provided?
      if ('sourceId' in _patch) {
        schema = (schema as (typeof zRaw)['pipeline']).extend({
          // This should be an override...
          sourceState:
            getProviderOrFail(_patch.sourceId!).def.sourceState ??
            z.object({}).nullish(),
        })
      } else if ('destinationId' in _patch) {
        schema = (schema as (typeof zRaw)['pipeline']).extend({
          // This should be an override...
          destinationState:
            getProviderOrFail(_patch.destinationId!).def.destinationState ??
            z.object({}).nullish(),
        })
      }
    }
    const table: MetaTable = metaService.tables[tableName]
    if (table.patch) {
      await table.patch(id, zRaw[tableName].deepPartial().parse(_patch))
    } else {
      const data = await table.get(id)

      // console.log(`[patch] Will merge patch and data`, {_patch, data})
      await table.set(id, zRaw[tableName].parse(deepMerge(data ?? {}, _patch)))
    }
  }

  // TODO: Implement native patchReturning in postgres?
  const patchReturning = async <TTable extends keyof ZRaw>(
    tableName: TTable,
    id: Id[(typeof IDS)[TTable]],
    _patch: ObjectPartialDeep<ZRaw[TTable]>,
  ) => {
    await patch(tableName, id, _patch)
    return getOrFail(tableName, id)
  }

  const getIntegrationInfoOrFail = (id: Id['int']) =>
    metaService.listIntegrationInfos({id}).then((ints) => {
      if (!ints[0]) {
        throw new TRPCError({code: 'NOT_FOUND'})
      }
      return ints[0]
    })

  const getIntegrationOrFail = (id: Id['int']) =>
    metaService.tables.integration.get(id).then((_int) => {
      if (!_int) {
        throw new TRPCError({code: 'NOT_FOUND'})
      }
      const int = zRaw.integration.parse(_int)
      const provider = getProviderOrFail(int.id)
      const config: {} = provider.def.integrationConfig?.parse(int.config)
      return {...int, provider, config}
    })

  const getInstitutionOrFail = (id: Id['ins']) =>
    metaService.tables.institution.get(id).then(async (ins) => {
      if (!ins) {
        throw new TRPCError({code: 'NOT_FOUND'})
      }
      // TODO: Fix the root cause and ensure we always have institution.standard here
      if (!ins.standard?.name) {
        const providerName = extractId(ins.id)[1]
        const provider = providerMap[providerName]
        ins.standard = provider?.standardMappers?.institution?.(ins.external)
        await metaLinks.patch('institution', ins.id, {standard: ins.standard})
      }
      return zRaw.institution.parse(ins)
    })
  const getResourceOrFail = (id: Id['reso']) =>
    metaService.tables.resource.get(id).then((reso) => {
      if (!reso) {
        throw new TRPCError({code: 'NOT_FOUND'})
      }
      return zRaw.resource.parse(reso)
    })
  const getPipelineOrFail = (id: Id['pipe']) =>
    metaService.tables.pipeline.get(id).then((pipe) => {
      if (!pipe) {
        throw new TRPCError({code: 'NOT_FOUND'})
      }
      return zRaw.pipeline.parse(pipe)
    })

  const getResourceExpandedOrFail = (id: Id['reso']) =>
    getResourceOrFail(id).then(async (reso) => {
      const integration = await getIntegrationOrFail(reso.integrationId)
      const settings: {} = integration.provider.def.resourceSettings?.parse(
        reso.settings,
      )
      const institution = reso.institutionId
        ? await getInstitutionOrFail(reso.institutionId)
        : undefined
      return {...reso, integration, settings, institution}
    })

  const getPipelineExpandedOrFail = (id: Id['pipe']) =>
    getPipelineOrFail(id).then(async (pipe) => {
      const [source, destination] = await Promise.all([
        getResourceExpandedOrFail(pipe.sourceId!),
        getResourceExpandedOrFail(pipe.destinationId!),
      ])
      const sourceState: {} =
        source.integration.provider.def.sourceState?.parse(pipe.sourceState)
      const destinationState: {} =
        destination.integration.provider.def.destinationState?.parse(
          pipe.destinationState,
        )
      // const links = R.pipe(
      //   rest.linkOptions ?? pipeline?.linkOptions ?? [],
      //   R.map((l) =>
      //     typeof l === 'string'
      //       ? linkMap?.[l]?.(undefined)
      //       : linkMap?.[l[0]]?.(l[1]),
      //   ),
      //   R.compact,
      // )
      return {
        ...pipe,
        source,
        destination,
        sourceState,
        destinationState,
        links: [], // TODO: Fix me
        watch: false, // TODO: Fix me
      }
    })
  // TODO: Refactor to avoid the double roundtrip
  const listIntegrations = () =>
    metaService.tables.integration
      .list({})
      .then((ints) =>
        Promise.all(ints.map((int) => getIntegrationOrFail(int.id))),
      )

  const metaLinks = makeMetaLinks(metaService)

  return {
    metaService,
    metaLinks,
    getProviderOrFail,
    getIntegrationInfoOrFail,
    getIntegrationOrFail,
    getResourceOrFail,
    getPipelineOrFail,
    getResourceExpandedOrFail,
    getPipelineExpandedOrFail,
    listIntegrations,
    // DB methods really should be moved to a separate file
    get,
    getOrFail,
    list,
    patch,
    patchReturning,
  }
}
