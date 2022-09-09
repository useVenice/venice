import type {
  AnyEntityPayload,
  AnySyncProvider,
  ConnectContext,
  Destination,
  Id,
  LinkFactory,
  MetaService,
  Source,
} from '@ledger-sync/cdk-core'
import {makeId} from '@ledger-sync/cdk-core'
import {extractId} from '@ledger-sync/cdk-core'
import {zRaw} from '@ledger-sync/cdk-core'
import {zConnectContextInput} from '@ledger-sync/cdk-core'
import {
  castInput,
  deepMerge,
  identity,
  mapDeep,
  R,
  z,
  zCast,
  zGuard,
} from '@ledger-sync/util'

import type {SyncEngineConfig} from './makeSyncEngine'

// Four different types
// Generic Input / Input
// Generic Output / Output
// We implement all except Generic Output

export const zInput = (() => {
  const provider = z.string().brand<'provider'>()
  // zRaw also have a bunch of things such as ledgerId, envName, etc.
  // Do we want to worry about those?
  const integration = zRaw.integration
  const connection = zRaw.connection.omit({standard: true}).extend({
    integration: integration.optional(),
    // Should never be actually passed in...
    _source$: zCast<Source<AnyEntityPayload>>().optional(),
    _destination$$: zCast<Destination>().optional(),
  })
  const pipeline = zRaw.pipeline.extend({
    source: connection.optional(),
    destination: connection.optional(),
    watch: z.boolean().optional(),
  })
  return {provider, integration, connection, pipeline}
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
export type ConnectionInput<T extends AnySyncProvider = AnySyncProvider> =
  T extends AnySyncProvider
    ? {
        id: Id<T['name']>['conn']
        integrationId?: Id<T['name']>['int']
        integration?: IntegrationInput<T>
        settings?: Partial<_inferInput<T['def']['connectionSettings']>>
        // Runtype only types... Really a hack
        _source$?: Source<T['def']['_types']['sourceOutputEntity']>
        _destination$$?: Destination<
          T['def']['_types']['destinationInputEntity']
        >
      }
    : never

export interface PipelineInput<
  PSrc extends AnySyncProvider = AnySyncProvider,
  PDest extends AnySyncProvider = AnySyncProvider,
  TLinks extends Record<string, LinkFactory> = {},
> {
  id: Id['pipe']
  source?: PSrc extends AnySyncProvider ? ConnectionInput<PSrc> : never
  sourceOptions?: PSrc extends AnySyncProvider
    ? Partial<_inferInput<PSrc['def']['sourceSyncOptions']>>
    : never
  destination?: PDest extends AnySyncProvider ? ConnectionInput<PDest> : never
  destinationOptions?: PDest extends AnySyncProvider
    ? Partial<_inferInput<PDest['def']['destinationSyncOptions']>>
    : never
  links?: Array<
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

export type ParsedConn = z.infer<ReturnType<typeof makeSyncParsers>['zConn']>
export type ParsedInt = z.infer<ReturnType<typeof makeSyncParsers>['zInt']>
export type ParsedPipeline = z.infer<
  ReturnType<typeof makeSyncParsers>['zPipeline']
>

export function makeSyncParsers<
  TProviders extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>({
  providers,
  linkMap,
  defaultPipeline,
  getDefaultConfig,
  metaService: m, // Destructure can cause dependencies to be loaded...
}: Pick<
  SyncEngineConfig<TProviders, TLinks>,
  'providers' | 'linkMap' | 'defaultPipeline'
> & {
  getDefaultConfig: (
    name: TProviders[number]['name'],
    integrationId?: Id<TProviders[number]['name']>['int'],
  ) => TProviders[number]['def']['_types']['integrationConfig']
  metaService: MetaService
}) {
  const providerMap = R.mapToObj(providers, (p) => [p.name, p])

  const zProvider = zInput.provider.transform(
    zGuard((input) => {
      const provider =
        providerMap[input] ?? providerMap[extractId(input as never)[1]]
      if (!provider) {
        throw new Error(`${input} is not a valid provider name`)
      }
      return provider
    }),
  )

  const zInt = castInput(zInput.integration)<
    IntegrationInput<TProviders[number]>
  >().transform(
    zGuard(async ({id, ...input}) => {
      const integration = await m.tables.integration.get(id)
      const provider = zProvider.parse(id, {path: ['id']})
      const _config = deepMerge(
        getDefaultConfig(provider.name, id),
        integration?.config,
        input.config,
      )
      const config = provider.def.integrationConfig?.parse(_config, {
        path: ['config'],
      })
      return {...integration, id, provider, config}
    }),
  )

  const zConn = castInput(zInput.connection)<
    ConnectionInput<TProviders[number]>
  >().transform(
    zGuard(async ({id, _source$, _destination$$, ...input}) => {
      const conn = await m.tables.connection.get(id)
      const integration = await zInt.parseAsync(
        identity<z.infer<typeof zInput['integration']>>({
          id:
            conn?.integrationId ??
            input.integrationId ??
            makeId('int', extractId(id)[1], ''),
          config: input.integration?.config,
        }),
      )
      const settings = integration.provider.def.connectionSettings?.parse(
        deepMerge(conn?.settings, input.settings),
        {path: ['settings']},
      )
      return {...conn, id, integration, settings, _source$, _destination$$}
    }),
  )

  const zPipeline = z
    .preprocess(
      (arg) =>
        typeof arg === 'object'
          ? deepMerge(defaultPipeline, arg)
          : arg ?? defaultPipeline,
      castInput(zInput.pipeline)<
        PipelineInput<TProviders[number], TProviders[number], TLinks>
      >(),
    )
    .transform(
      zGuard(async ({id, ...input}) => {
        const pipeline = await m.tables.pipeline.get(id)
        const [source, destination] = await Promise.all([
          zConn.parseAsync(
            deepMerge({id: input.sourceId ?? pipeline?.sourceId}, input.source),
            {path: ['source']},
          ),
          zConn.parseAsync(
            deepMerge(
              {id: input.destinationId ?? pipeline?.destinationId},
              input.destination,
            ),
            {path: ['destination']},
          ),
        ])
        // Validation happens inside for now
        const links = R.pipe(
          input.links ?? pipeline?.links ?? [],
          R.map((l) =>
            typeof l === 'string'
              ? linkMap?.[l]?.(undefined)
              : linkMap?.[l[0]]?.(l[1]),
          ),
          R.compact,
        )
        const sourceOptions =
          source.integration.provider.def.sourceSyncOptions?.parse(
            deepMerge(pipeline?.sourceOptions, input.sourceOptions),
            {path: ['sourceOptions']},
          )

        const destinationOptions =
          destination.integration.provider.def.destinationSyncOptions?.parse(
            deepMerge(pipeline?.destinationOptions, input.destinationOptions),
            {path: ['destinationOptions']},
          )
        return {
          ...pipeline,
          id,
          source,
          destination,
          links,
          sourceOptions,
          destinationOptions,
          watch: input.watch, // Should this be on pipeline too?
        }
      }),
    )
    .refine((pipe) => {
      console.dir(
        mapDeep(pipe, (v, k) =>
          k === 'provider'
            ? (v as AnySyncProvider).name
            : `${k}`.toLowerCase().includes('secret')
            ? '[redacted]'
            : v,
        ),
        {depth: null},
      )
      return true
    })

  const zConnectContext = zConnectContextInput.transform(
    zGuard(async ({connectionId, ...rest}) => {
      const rawConn = connectionId
        ? await m.tables.connection.get(connectionId)
        : undefined
      console.log('rawConn', rawConn)
      // Should we throw here if connection not found?
      const connection = rawConn
        ? await zConn.parseAsync({...rawConn, id: connectionId})
        : null

      // We don't have a getInsitution here... so just wiat for now
      // We should probably at least get the external id working though
      const ctx: ConnectContext<any> = {
        ...rest,
        // TODO: Fix the typing here...
        connection: {settings: {}, ...connection, id: connectionId!},
      }
      return ctx
    }),
  )

  return {zProvider, zInt, zConn, zPipeline, zConnectContext}
}
