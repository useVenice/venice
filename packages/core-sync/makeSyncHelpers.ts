import {deepMerge, mapDeep, R, z, zGuard} from '@ledger-sync/util'
import {
  Destination,
  LinkFactory,
  Source,
  zDestination,
  zSource,
} from './link-types'
import type {SyncCoreConfig} from './makeCoreSync'
import {makeMemoryKVStore, makeMetaStore} from './makeMetaStore'
import {AnySyncProvider} from './makeSyncProvider'

type _inferInput<T> = T extends z.ZodTypeAny ? z.input<T> : never

export type ConnId<TName extends string = string> = `conn_${TName}_${string}`
export type IntId<TName extends string = string> = `int_${TName}_${string}`
export type PipeId = `pipe_${string}`

// Would be nice to improve the typing of this... Make stuff non-optional
/** https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types */
export type IntegrationInput<T extends AnySyncProvider> =
  T extends AnySyncProvider
    ? {
        id?: IntId<T['name']>
        provider?: T['name']
        config?: Partial<_inferInput<T['def']['integrationConfig']>>
      }
    : never

// Is there a way to infer this? Or would that be too much?
export type ConnectionInput<T extends AnySyncProvider> =
  T extends AnySyncProvider
    ? Omit<IntegrationInput<T>, 'id'> & {
        id?: ConnId<T['name']>
        integrationId?: IntId<T['name']>
        settings?: Partial<_inferInput<T['def']['connectionSettings']>>
        _source$?: Source<T['def']['_types']['sourceOutputEntity']>
        _destination$$?: Destination<
          T['def']['_types']['destinationInputEntity']
        >
      }
    : never

export interface PipelineInput<
  PSrc extends AnySyncProvider,
  PDest extends AnySyncProvider,
  TLinks extends Record<string, LinkFactory>,
> {
  id?: PipeId
  src?: PSrc extends AnySyncProvider
    ? ConnectionInput<PSrc> & {
        options?: Partial<_inferInput<PSrc['def']['sourceSyncOptions']>>
      }
    : never
  dest?: PDest extends AnySyncProvider
    ? ConnectionInput<PDest> & {
        options?: Partial<_inferInput<PSrc['def']['destinationSyncOptions']>>
      }
    : never
  links?: Array<
    {
      [K in keyof TLinks]: undefined extends Parameters<TLinks[K]>[0]
        ? [name: K, args: Parameters<TLinks[K]>[0]] | [name: K] | K
        : [name: K, args: Parameters<TLinks[K]>[0]]
    }[keyof TLinks]
  >
  watch?: boolean
}

export type ParsedConn = z.infer<
  ReturnType<typeof makeSyncCoreHelpers>['zConn']
>
export type ParsedInt = z.infer<ReturnType<typeof makeSyncCoreHelpers>['zInt']>
export type ParsedPipeline = z.infer<
  ReturnType<typeof makeSyncCoreHelpers>['zPipeline']
>

export function makeSyncCoreHelpers<
  TProviders extends AnySyncProvider[],
  TLinks extends Record<string, LinkFactory>,
>({
  kvStore,
  providers,
  linkMap,
  defaultIntegrations,
  defaultPipeline,
}: Pick<
  SyncCoreConfig<TProviders, TLinks>,
  | 'providers'
  | 'linkMap'
  | 'kvStore'
  | 'defaultIntegrations'
  | 'defaultPipeline'
>) {
  const providerMap = R.mapToObj(providers, (p) => [p.name, p])

  const metaStore = makeMetaStore(kvStore ?? makeMemoryKVStore())

  const getDefaultConfig = (name: TProviders[number]['name'], id?: string) =>
    Array.isArray(defaultIntegrations)
      ? defaultIntegrations.find(
          (i) => (id && i.id === id) || i.provider === name,
        )?.config
      : defaultIntegrations?.[name]

  // TODO: Validate default integrations / destination at startup time

  const zProvider = z.preprocess(
    (arg) =>
      typeof arg === 'string'
        ? /^(int|conn)_(.+)_.+$/.exec(arg)?.[2] ?? arg
        : arg,
    z
      .enum(Object.keys(providerMap) as [TProviders[number]['name']])
      .transform((name) => providerMap[name] as AnySyncProvider),
  )

  const zInt = z
    .object({
      id: z.string().optional(),
      provider: z.string().optional(),
      config: z.record(z.unknown()).optional(),
    })
    .transform(
      zGuard(async ({id, ...input}) => {
        const int = id ? await metaStore.getIntegration(id) : undefined
        const provider = zProvider.parse(id ?? input.provider, {
          path: id ? ['id'] : ['provider'],
        })
        const _config = deepMerge(
          getDefaultConfig(provider.name, id),
          int?.config,
          input.config,
        )
        const config = provider.def.integrationConfig?.parse(_config, {
          path: ['config'],
        })
        return {...int, id: id as IntId<string>, provider, config}
      }),
    )

  const zConn = zInt
    .innerType()
    .extend({
      integrationId: z.string().optional(),
      settings: z.record(z.unknown()).optional(),
      _source$: zSource.optional(),
      _destination$$: zDestination.optional(),
    })
    .transform(
      zGuard(async ({id, _source$, _destination$$, ...input}) => {
        const conn = id ? await metaStore.getConnection(id) : undefined
        // if (id && !conn && !input.settings) {
        //   // not 100% correct, because provider could require no conn
        // }
        const {id: integrationId, ...int} = await zInt.parseAsync({
          id: conn?.integrationId ?? input.integrationId,
          provider: id ?? input.provider,
          config: input.config,
        })
        // Id always rules in case integrationId contains a diff provider than connId
        // Honestly we should probably throw an error if the providers are mismatching
        const provider = id ? zProvider.parse(id) : int.provider

        const settings = provider.def.connectionSettings?.parse(
          deepMerge(conn?.settings, input.settings),
          {path: ['settings']},
        )
        return {
          ...conn,
          id: id as ConnId<string>,
          provider,
          integrationId,
          config: int.config,
          settings,
          _source$,
          _destination$$,
        }
      }),
    )

  const zPipeline = z
    .preprocess(
      (arg) =>
        typeof arg === 'object'
          ? deepMerge(defaultPipeline, arg)
          : arg ?? defaultPipeline,
      z.object({
        id: z.string().nullish(),
        src: zConn.innerType().extend({
          options: z.record(z.unknown()).optional(),
        }),
        // Add default please
        dest: zConn.innerType().extend({
          options: z.record(z.unknown()).optional(),
        }),
        links: z
          .array(z.union([z.string(), z.tuple([z.string(), z.unknown()])]))
          .nullish(),
        watch: z.boolean().optional(),
      }),
    )
    .transform(
      zGuard(
        async ({
          id,
          src: {options: srcOptions, ..._src},
          dest: {options: destOptions, ..._dest},
          links: rawLinks,
          ...rest
        }) => {
          const pipeline = id ? await metaStore.getPipeline(id) : undefined
          const [srcConn, destConn] = await Promise.all([
            zConn.parseAsync(deepMerge(pipeline?.src as typeof _src, _src), {
              path: ['src'],
            }),
            zConn.parseAsync(deepMerge(pipeline?.dest as typeof _dest, _dest), {
              path: ['dest'],
            }),
          ])
          // Validation happens inside for now
          const links = R.pipe(
            rawLinks ?? [],
            R.map((l) =>
              typeof l === 'string'
                ? linkMap?.[l]?.(undefined)
                : linkMap?.[l[0]]?.(l[1]),
            ),
            R.compact,
          )
          const src = {
            ...srcConn,
            options: srcConn.provider.def.sourceSyncOptions?.parse(
              deepMerge(pipeline?.src?.options, srcOptions),
              {path: ['src', 'options']},
            ),
          }
          const dest = {
            ...destConn,
            options: destConn.provider.def.destinationSyncOptions?.parse(
              deepMerge(pipeline?.dest?.options, destOptions),
              {path: ['dest', 'options']},
            ),
          }
          return {...rest, id, src, links, dest}
        },
      ),
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

  return {
    zProvider,
    zInt: zInt as unknown as z.ZodType<
      z.output<typeof zInt>,
      z.ZodTypeDef,
      IntegrationInput<TProviders[number]>
    >,
    zConn: zConn as unknown as z.ZodType<
      z.output<typeof zConn>,
      z.ZodTypeDef,
      ConnectionInput<TProviders[number]>
    >,
    zPipeline: zPipeline as unknown as z.ZodType<
      z.output<typeof zPipeline>,
      z.ZodTypeDef,
      PipelineInput<TProviders[number], TProviders[number], TLinks>
    >,
    metaStore,
  }
}
