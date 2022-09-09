import type {
  AnyEntityPayload,
  AnySyncProvider,
  ConnectContext,
  Destination,
  Id,
  LinkFactory,
  MetaService,
  PipeId,
  Source,
} from '@ledger-sync/cdk-core'
import {zRaw} from '@ledger-sync/cdk-core'
import {zId} from '@ledger-sync/cdk-core'
import {zConnectContextInput} from '@ledger-sync/cdk-core'
import type {JsonObject} from '@ledger-sync/util'
import {deepMerge, mapDeep, R, z, zCast, zGuard} from '@ledger-sync/util'

import type {SyncEngineConfig} from './makeSyncEngine'

export const zInput = (() => {
  const integration = zRaw.integration.partial({id: true})
  const connection = zRaw.connection.partial({id: true}).extend({
    integration: integration.optional(),
  })
  const pipeline = zRaw.pipeline.partial({id: true}).extend({
    source: connection,
    destination: connection,
    watch: z.boolean().optional(),
  })
  return {integration, connection, pipeline}
})()

type _inferInput<T> = T extends z.ZodTypeAny ? z.input<T> : never

// Would be nice to improve the typing of this... Make stuff non-optional
/** https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types */
export type IntegrationInput<T extends AnySyncProvider = AnySyncProvider> =
  T extends AnySyncProvider
    ? {
        id?: Id<T['name']>['int']
        provider?: T['name']
        config?: Partial<_inferInput<T['def']['integrationConfig']>>
      }
    : never

// Is there a way to infer this? Or would that be too much?
export type ConnectionInput<T extends AnySyncProvider = AnySyncProvider> =
  T extends AnySyncProvider
    ? Omit<IntegrationInput<T>, 'id'> & {
        id?: Id<T['name']>['conn']
        integrationId?: Id<T['name']>['int']
        settings?: Partial<_inferInput<T['def']['connectionSettings']>>
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
    integrationId?: string,
  ) => TProviders[number]['def']['_types']['integrationConfig']
  metaService: MetaService
}) {
  const providerMap = R.mapToObj(providers, (p) => [p.name, p])

  const zProvider = z.preprocess(
    (arg) =>
      // Use splitId here...
      typeof arg === 'string' ? /^(int|conn)_(.+)$/.exec(arg)?.[2] ?? arg : arg,
    z
      .enum(Object.keys(providerMap) as [TProviders[number]['name']])
      .transform((name) => providerMap[name]!),
  )

  const zInt = z
    .object({
      id: zId('int').optional(),
      provider: z.string().optional(),
      config: z.record(z.unknown()).optional(),
    })
    .transform(
      zGuard(async ({id, ...input}) => {
        const int = id ? await m.tables.integration.get(id) : undefined
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
        return {...int, id: id!, provider, config}
      }),
    )

  const zConn = z
    .object({
      id: zId('conn').optional(),
      provider: z.string().optional(),
      config: z.record(z.unknown()).optional(),
      integrationId: zId('int').optional(),
      settings: z.record(z.unknown()).optional(),
      _source$: zCast<Source<AnyEntityPayload>>().optional(),
      _destination$$: zCast<Destination>().optional(),
    })
    .transform(
      zGuard(async ({id, _source$, _destination$$, ...input}) => {
        const conn = id ? await m.tables.connection.get(id) : undefined
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
          deepMerge(conn?.settings, input.settings as JsonObject),
          {path: ['settings']},
        )
        return {
          ...conn,
          id,
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
        id: zId('pipe').nullish(),
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
          const pipeline = id ? await m.tables.pipeline.get(id) : undefined
          const [srcConn, destConn] = await Promise.all([
            zConn.parseAsync(deepMerge({id: pipeline?.sourceId}, _src), {
              path: ['src'],
            }),
            zConn.parseAsync(deepMerge({id: pipeline?.destinationId}, _dest), {
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
              deepMerge(pipeline?.sourceOptions, srcOptions as JsonObject),
              {path: ['src', 'options']},
            ),
          }
          const dest = {
            ...destConn,
            options: destConn.provider.def.destinationSyncOptions?.parse(
              deepMerge(
                pipeline?.destinationOptions,
                destOptions as JsonObject,
              ),
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
    zConnectContext,
  }
}
