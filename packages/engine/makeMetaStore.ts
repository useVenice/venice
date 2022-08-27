import {AnySyncProvider, handlersLink, KVStore} from '@ledger-sync/core-sync'
import {cast, deepMerge, R, z} from '@ledger-sync/util'

type _infer<T> = T extends z.ZodTypeAny ? z.infer<T> : never

export interface RawIntegration<T extends AnySyncProvider> {
  // id: `conn_${T['name']}_${string}`
  // providerName: T['name']
  config: _infer<T['def']['integrationConfig']>
}

export interface RawConnection<T extends AnySyncProvider> {
  // id: `conn_${T['name']}_${string}`
  // providerName: T['name']
  integrationId?: `int_${T['name']}_${string}`
  settings: _infer<T['def']['connectionSettings']>
}

export interface RawPipeline<
  PSrc extends AnySyncProvider,
  PDest extends AnySyncProvider,
> {
  src: RawConnection<PSrc> & {
    id?: `conn_${PSrc['name']}_${string}`
    options: _infer<PSrc['def']['sourceSyncOptions']>
  }
  dest: RawConnection<PDest> & {
    id?: `conn_${PDest['name']}_${string}`
    options: _infer<PSrc['def']['destinationSyncOptions']>
  }
}

export interface RawInstitution {
  // <T extends AnySyncProvider> {
  standard?: {}
  external: unknown
}

export const isIntegration = <T extends AnySyncProvider>(
  maybe: RawConnection<T> | RawIntegration<T>,
): maybe is RawIntegration<T> => 'config' in maybe

// MARK: - Meta Store

// type MetaStore = ReturnType<typeof makeMetaStore>

export function makeMetaStore<T extends AnySyncProvider = AnySyncProvider>(
  kvStore: KVStore<Record<string, unknown>>,
) {
  // Validate connection before saving...
  // metaStore and syncHelpers appear to be a bit circular relationship...
  // So we cannot use the ParsedPipeline type. Consider improving this
  // for the future
  const postSourceLink = (_pipe: {id?: string | null}) =>
    handlersLink({
      metaUpdate: async (op) => {
        const {id, settings = {}} = op
        console.log(`[postSourceLink] patch`, id, R.keys(settings))
        await patch(id, settings)
        // console.log(`[meta] Did update connection`, id, op.data)
        return op
      },
    })

  const postDestinationLink = (pipe: {id?: string | null}) =>
    handlersLink({
      metaUpdate: async (op) => {
        const {
          id,
          settings = {},
          sourceSyncOptions = {},
          destinationSyncOptions = {},
        } = op
        console.log(`[postDestinationLink] patch`, pipe.id, {
          connectionId: id,
          pipelineId: pipe.id,
          settings: R.keys(settings),
          sourceSyncOptions: R.keys(sourceSyncOptions),
          destinationSyncOptions: R.keys(destinationSyncOptions),
        })
        await Promise.all([
          patch(id, settings),
          pipe.id &&
            patch(pipe.id, {
              src: {options: sourceSyncOptions},
              dest: {options: destinationSyncOptions},
            }),
        ])
        return op
      },
    })

  const patch =
    kvStore.patch ??
    (async (id, _patch) => {
      if (!Object.keys(_patch).length) {
        return
      }
      const data = await kvStore.get(id)
      await kvStore.set(id, deepMerge(data, _patch))
    })

  const get = <TOut>(id: string) =>
    Promise.resolve(kvStore.get(id)).then(cast<TOut>())

  const list = <TOut>() => Promise.resolve(kvStore.list()).then(cast<TOut[]>())

  return {
    // TODO: Separate into pre-destination link and post-destination link
    // Connection update should be handled in pre-destination link
    // while pipeline updates should be handled in post-destination link
    postSourceLink,
    postDestinationLink,
    get,
    getIntegration: async (id: string): Promise<RawIntegration<T> | null> => {
      const config = await get<RawIntegration<T>['config']>(id)
      return config ? {config} : null
    },
    getConnection: async (id: string): Promise<RawConnection<T> | null> => {
      const data = await get<RawConnection<T>['settings']>(id)
      return data ? {settings: data} : null
    },
    getPipeline: async (id: string): Promise<RawPipeline<T, T> | null> => {
      const data = await get<RawPipeline<T, T>>(id)
      return data // What about the `id`?
    },
    getPipelinesForConnection: async (connectionId: string) => {
      const pipelines = await list<RawPipeline<T, T>>()
      return pipelines.filter(
        (p) => p.src?.id === connectionId || p.dest?.id === connectionId,
      )
    },
    kvStore,
    // list: zFunction(() => kvStore.list()),
  }
}
