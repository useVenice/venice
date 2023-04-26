/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {TRPCError} from '@trpc/server'

import type {
  AnySyncProvider,
  Id,
  LinkFactory,
  MetaService,
} from '@usevenice/cdk-core'
import {extractId, zRaw} from '@usevenice/cdk-core'
import {z} from '@usevenice/util'

import type {UserInfo} from './auth-utils'

// Four different types
// Generic Input / Input
// Generic Output / Output
// We implement all except Generic Output

export type ZInput = {
  [k in keyof typeof zInput]: z.infer<(typeof zInput)[k]>
}
export const zInput = (() => {
  const provider = z.string().brand<'provider'>()
  // zRaw also have a bunch of things such as userId, envName, etc.
  // Do we want to worry about those?
  const integration = zRaw.integration
  const institution = zRaw.institution
  const resource = zRaw.resource.omit({standard: true}).extend({
    integration: integration.optional(),
    institution: institution.optional(),
  })
  const pipeline = zRaw.pipeline.extend({
    source: resource.partial().optional(),
    destination: resource.partial().optional(),
    watch: z.boolean().optional(),
  })
  return {provider, institution, integration, resource, pipeline}
})()

type _inferInput<T> = T extends z.ZodTypeAny ? z.input<T> : never

// Would be nice to improve the typing of this... Make stuff non-optional
/** https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types */
export type IntegrationInput<T extends AnySyncProvider = AnySyncProvider> =
  T extends AnySyncProvider
    ? {
        id: Id<T['name']>['int']
        config?: Partial<_inferInput<T['def']['integrationConfig']>>
      }
    : never

// Is there a way to infer this? Or would that be too much?
export type ResourceInput<T extends AnySyncProvider = AnySyncProvider> =
  T extends AnySyncProvider
    ? {
        id: Id<T['name']>['reso']
        integrationId?: Id<T['name']>['int']
        integration?: IntegrationInput<T>
        settings?: Partial<_inferInput<T['def']['resourceSettings']>> & object
      }
    : never

export interface PipelineInput<
  PSrc extends AnySyncProvider = AnySyncProvider,
  PDest extends AnySyncProvider = AnySyncProvider,
  TLinks extends Record<string, LinkFactory> = {},
> {
  id: Id['pipe']
  source?: PSrc extends AnySyncProvider ? ResourceInput<PSrc> : never
  sourceState?: PSrc extends AnySyncProvider
    ? Partial<_inferInput<PSrc['def']['sourceState']>>
    : never
  destination?: PDest extends AnySyncProvider ? ResourceInput<PDest> : never
  destinationState?: PDest extends AnySyncProvider
    ? Partial<_inferInput<PDest['def']['destinationState']>>
    : never
  /** Used to initialize links */
  linkOptions?: Array<
    // prettier-ignore
    {
      [K in Extract<keyof TLinks, string>]: undefined extends Parameters<TLinks[K]>[0]
        ? [name: K, args: Parameters<TLinks[K]>[0]] | [name: K] | K
        : [name: K, args: Parameters<TLinks[K]>[0]]
    }[Extract<keyof TLinks, string>]
  >
  watch?: boolean
}

// Consider adding connectContextInput here...

export const zSyncOptions = z.object({
  /** Only sync resource metadata and skip pipelines */
  metaOnly: z.boolean().nullish(),
  /**
   * Remove `state` of resource and trigger a full resync
   */
  fullResync: z.boolean().nullish(),

  /**
   * Triggers provider to refresh data from its source
   * https://plaid.com/docs/api/products/transactions/#transactionsrefresh
   * This may also load historical transactions. For example,
   * Finicity treats historical transaction as premium service.
   */
  todo_upstreamRefresh: z.boolean().nullish(),

  // See coda's implmementation. Requires adding a new message to the sync protocol
  // to remove all data from a particular source_id
  todo_removeUnsyncedData: z.boolean().nullish(),
})

type AuthSubject =
  | ['resource', Pick<_Resource, 'endUserId' | 'id'> | null | undefined]
  | [
      'pipeline',
      Pick<_Pipeline, 'source' | 'destination' | 'id'> | null | undefined,
    ]

/** TODO: Fully replace this with row level security so we do not duplicate the auth logic */
export function checkAuthorization(ctx: UserInfo, ...pair: AuthSubject) {
  if (ctx.isAdmin) {
    return true
  }
  switch (pair[0]) {
    case 'resource':
      return pair[1] == null || pair[1].endUserId === ctx.endUserId
    case 'pipeline':
      return (
        pair[1] == null ||
        pair[1].source.endUserId === ctx.endUserId ||
        pair[1].destination.endUserId === ctx.endUserId
      )
  }
}

export function authorizeOrThrow(ctx: UserInfo, ...pair: AuthSubject) {
  if (!checkAuthorization(ctx, ...pair)) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: `${ctx.endUserId} does not have access to ${
        typeof pair[1] === 'string' ? pair[1] : pair[1]?.id
      }`,
    })
  }
}

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
