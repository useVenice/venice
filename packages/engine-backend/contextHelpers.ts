/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {TRPCError} from '@trpc/server'

import type {AnySyncProvider, Id, MetaService} from '@usevenice/cdk-core'
import {extractId, zRaw} from '@usevenice/cdk-core'

export function getContextHelpers({
  metaService,
  providerMap,
}: {
  metaService: MetaService
  providerMap: Record<string, AnySyncProvider>
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
    metaService.tables.institution.get(id).then((ins) => {
      if (!ins) {
        throw new TRPCError({code: 'NOT_FOUND'})
      }
      return zRaw.institution.parse(ins)
    })
  const getResourceOrFail = (id: Id['reso']) =>
    metaService.tables.resource.get(id).then(async (_reso) => {
      if (!_reso) {
        throw new TRPCError({code: 'NOT_FOUND'})
      }
      const reso = zRaw.resource.parse(_reso)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const integration = await getIntegrationOrFail(reso.integrationId!)
      const settings: {} = integration.provider.def.resourceSettings?.parse(
        reso.settings,
      )
      const institution = reso.institutionId
        ? await getInstitutionOrFail(reso.institutionId)
        : undefined
      return {...reso, integration, settings, institution}
    })

  const getPipelineOrFail = (id: Id['pipe']) =>
    metaService.tables.pipeline.get(id).then(async (_pipe) => {
      if (!_pipe) {
        throw new TRPCError({code: 'NOT_FOUND'})
      }

      const pipe = zRaw.pipeline.parse(_pipe)
      const [source, destination] = await Promise.all([
        getResourceOrFail(pipe.sourceId!),
        getResourceOrFail(pipe.destinationId!),
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

  // TODO: 1) avoid roundtrip to db 2) Bring back getDefaultPipeline somehow
  const getPipelinesForResource = (resoId: Id['reso']) =>
    metaService
      .findPipelines({resourceIds: [resoId]})
      .then((pipes) =>
        Promise.all(pipes.map((pipe) => getPipelineOrFail(pipe.id))),
      )
  return {
    getProviderOrFail,
    getIntegrationOrFail,
    getResourceOrFail,
    getPipelineOrFail,
    listIntegrations,
    getPipelinesForResource,
  }
}

export type _Integration = Awaited<
  ReturnType<ReturnType<typeof getContextHelpers>['getIntegrationOrFail']>
>
export type _Pipeline = Awaited<
  ReturnType<ReturnType<typeof getContextHelpers>['getPipelineOrFail']>
>
export type _Resource = Awaited<
  ReturnType<ReturnType<typeof getContextHelpers>['getResourceOrFail']>
>
