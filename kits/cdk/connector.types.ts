import type {MaybePromise, PathsOf} from '@usevenice/util'
import {R} from '@usevenice/util'
import type {z} from '@usevenice/zod'
import type {
  CheckResourceContext,
  CheckResourceOptions,
  ConnectContext,
  ConnectOptions,
  ConnectorMetadata,
  OpenDialogFn,
  ResourceUpdate,
  WebhookReturnType,
  zPassthroughInput,
} from './connector-meta.types'
import type {EndUserId, Id} from './id.types'
import {makeId} from './id.types'
import type {ZStandard} from './models'
import type {
  Destination,
  EntityPayload,
  ResoUpdateData,
  Source,
  StateUpdateData,
  SyncOperation,
} from './protocol'
import type {
  AccountingMethods,
  InvestmentMethods,
  PtaMethods,
  ZAccounting,
  ZInvestment,
  ZPta,
} from './verticals'

export interface Verticals<
  TDef extends ConnectorSchemas = ConnectorSchemas,
  TInstance = unknown,
> {
  accounting: {
    models: ZAccounting
    methods: AccountingMethods<TDef, TInstance>
  }
  investment: {
    models: ZInvestment
    methods: InvestmentMethods<TDef, TInstance>
  }
  /** plain text accounting */
  pta: {
    models: ZPta
    methods: PtaMethods<TDef, TInstance>
  }
}

/**
 * Equivalent to to airbyte's low code connector spec,
 *  plus the SPEC message in airbyte protocol spec
 */

export interface ConnectorSchemas {
  name: z.ZodLiteral<string>
  connectorConfig?: z.ZodTypeAny
  resourceSettings?: z.ZodTypeAny
  integrationData?: z.ZodTypeAny
  webhookInput?: z.ZodTypeAny
  preConnectInput?: z.ZodTypeAny
  connectInput?: z.ZodTypeAny
  /** aka postConnectInput... Should we rename? */
  connectOutput?: z.ZodTypeAny
  /** Maybe can be derived from webhookInput | postConnOutput | inlineInput? */
  sourceState?: z.ZodTypeAny
  sourceOutputEntity?: z.ZodTypeAny

  destinationState?: z.ZodTypeAny
  destinationInputEntity?: z.ZodTypeAny

  // Unfortunately we can't use AnyZodObject because it causes compile failure
  // app-config/backendConfig.ts somehow
  verticals?: {
    [v in keyof Verticals]?: {
      [k in keyof Verticals[v]['models']]?: z.ZodTypeAny
    }
  }
}

export type AnyConnectorHelpers = ConnHelpers

export type EntityMapper<
  T extends {remote: unknown; settings: unknown} = {
    remote: unknown
    settings: unknown
  },
  TUnified = unknown,
> = (remote: T['remote'], settings: T['settings']) => TUnified

export type ConnHelpers<TSchemas extends ConnectorSchemas = ConnectorSchemas> =
  ReturnType<typeof connHelpers<TSchemas>>

export interface ConnectorDef<
  TSchemas extends ConnectorSchemas = ConnectorSchemas,
  T extends ConnHelpers<TSchemas> = ConnHelpers<TSchemas>,
> {
  name: TSchemas['name']['_def']['value']
  schemas: TSchemas
  metadata?: ConnectorMetadata

  standardMappers?: {
    integration?: (
      data: T['_types']['integrationData'],
    ) => Omit<ZStandard['integration'], 'id'>
    resource?: (
      settings: T['_types']['resourceSettings'],
    ) => Omit<ZStandard['resource'], 'id'>
    /** TODO: Currently unused. We shoud migrate this to the pta vertical probably */
    entity?:
      | Partial<{
          // Simpler
          [k in T['_types']['sourceOutputEntity']['entityName']]: (
            entity: Extract<T['_types']['sourceOutputEntity'], {entityName: k}>,
            settings: T['_types']['resourceSettings'],
          ) => EntityPayload | null
        }>
      // More powerful
      | ((
          entity: T['_types']['sourceOutputEntity'],
          settings: T['_types']['resourceSettings'],
        ) => EntityPayload | null)
  }

  streams?: {
    $defaults: {
      /** Only singular primary key supported for the moment */
      primaryKey: PathsOf<T['_remoteEntity']>
      /** Used for incremental sync. Should only be string entities */
      cursorField?: PathsOf<T['_remoteEntity']>
    }
  } & {
    [v in keyof T['_verticals']]: v extends keyof Verticals
      ? {
          [k in keyof T['_verticals'][v]]: k extends keyof Verticals[v]['models']
            ? EntityMapper<
                {
                  remote: T['_verticals'][v][k]
                  settings: T['_types']['resourceSettings']
                },
                Verticals[v]['models'][k]
              >
            : never
        }
      : never
  }
}

export interface ConnectorClient<
  TDef extends ConnectorSchemas = ConnectorSchemas,
  T extends ConnHelpers<TDef> = ConnHelpers<TDef>,
> {
  useConnectHook?: (scope: {
    // userId: DeprecatedUserId | undefined
    openDialog: OpenDialogFn
  }) => (
    connectInput: T['_types']['connectInput'],
    context: ConnectOptions & {
      // TODO: Does this belong here?
      connectorConfigId: Id['ccfg']
    },
  ) => Promise<T['_types']['connectOutput']>
}

export interface ConnectorServer<
  TDef extends ConnectorSchemas,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TInstance = any,
  T extends ConnHelpers<TDef> = ConnHelpers<TDef>,
> {
  // MARK: - Connect

  preConnect?: (
    config: T['_types']['connectorConfig'],
    context: ConnectContext<T['_types']['resourceSettings']>,
    // TODO: Turn this into an object instead
    input: T['_types']['preConnectInput'],
  ) => Promise<T['_types']['connectInput']>

  postConnect?: (
    connectOutput: T['_types']['connectOutput'],
    config: T['_types']['connectorConfig'],
    context: ConnectContext<T['_types']['resourceSettings']>,
  ) => MaybePromise<
    Omit<
      ResourceUpdate<
        T['_types']['sourceOutputEntity'],
        T['_types']['resourceSettings']
      >,
      'endUserId'
    >
  >

  checkResource?: (
    input: OmitNever<{
      settings: T['_types']['resourceSettings']
      config: T['_types']['connectorConfig']
      options: CheckResourceOptions
      context: CheckResourceContext
    }>,
  ) => MaybePromise<
    Omit<
      ResourceUpdate<
        T['_types']['sourceOutputEntity'],
        T['_types']['resourceSettings']
      >,
      'endUserId'
    >
  >

  // This probably need to also return an observable
  revokeResource?: (
    settings: T['_types']['resourceSettings'],
    config: T['_types']['connectorConfig'],
  ) => Promise<unknown>

  // MARK: - Sync

  sourceSync?: (
    input: OmitNever<{
      endUser: {id: EndUserId} | null | undefined
      config: T['_types']['connectorConfig']
      settings: T['_types']['resourceSettings']
      /* Enabled streams */
      streams: Record<string, boolean | null>
      state: T['_types']['sourceState']
    }>,
  ) => Source<T['_types']['sourceOutputEntity']>

  destinationSync?: (
    input: OmitNever<{
      endUser: {id: EndUserId} | null | undefined
      config: T['_types']['connectorConfig']
      settings: T['_types']['resourceSettings']
      state: T['_types']['destinationState']
    }>,
  ) => Destination<T['_types']['destinationInputEntity']>

  metaSync?: (
    input: OmitNever<{
      config: T['_types']['connectorConfig']
      // options: T['_types']['sourceState']
    }>,
  ) => Source<T['_intOpType']['data']>

  // MARK - Webhook
  // Need to add a input schema for each provider to verify the shape of the received
  // webhook requests...
  handleWebhook?: (
    webhookInput: T['_types']['webhookInput'],
    config: T['_types']['connectorConfig'],
  ) => MaybePromise<
    WebhookReturnType<
      T['_types']['sourceOutputEntity'],
      T['_types']['resourceSettings']
    >
  >

  /**
   * Work around typescript not having contextual typing support for classes that implement interfaces
   * We recommend against using classes (which might be more convenient) due to the lack
   * of contextual typing for interfaces. @see https://github.com/microsoft/TypeScript/issues/1373
   */
  newInstance?: (opts: {
    config: T['_types']['connectorConfig']
    settings: T['_types']['resourceSettings']
    onSettingsChange: (
      newSettings: T['_types']['resourceSettings'],
    ) => MaybePromise<void>
  }) => TInstance

  passthrough?: (
    instance: TInstance,
    input: z.infer<typeof zPassthroughInput>,
  ) => unknown

  verticals?: {
    [v in keyof T['_verticals']]: v extends keyof Verticals
      ? Verticals<TDef, TInstance>[v]['methods']
      : never
  }
}

export interface ConnectorImpl<TSchemas extends ConnectorSchemas>
  extends ConnectorDef<TSchemas>,
    ConnectorServer<TSchemas>,
    ConnectorClient<TSchemas> {
  // helpers: IntHelpers<TSchemas>
}

export type AnyConnectorImpl = ConnectorImpl<ConnectorSchemas>

// MARK: - Runtime helpers

/** TODO: Helpers should receive the whole Def as input so we can do the re-mapping at the source layer */

export function connHelpers<TSchemas extends ConnectorSchemas>(
  schemas: TSchemas,
) {
  type _types = {
    [k in keyof TSchemas as k extends 'verticals' ? never : k]: _infer<
      TSchemas[k]
    >
  }

  type TSVerticals = NonNullable<TSchemas['verticals']>
  type _verticals = {
    [v in keyof TSVerticals]: {
      [k in keyof TSVerticals[v]]: _infer<TSVerticals[v][k]>
    }
  }

  type _remoteEntity = {
    [v in keyof _verticals]: _verticals[v][keyof _verticals[v]]
  }[keyof _verticals]

  type IntOpData = Extract<
    SyncOperation<{
      id: string
      entityName: 'integration'
      entity: _types['integrationData']
    }>,
    {type: 'data'}
  >
  type resoUpdate = ResoUpdateData<
    _types['resourceSettings'],
    _types['integrationData']
  >
  type stateUpdate = StateUpdateData<
    _types['sourceState'],
    _types['destinationState']
  >
  type Src = Source<_types['sourceOutputEntity'], resoUpdate, stateUpdate>

  type Op = SyncOperation<_types['sourceOutputEntity'], resoUpdate, stateUpdate>
  type InputOp = SyncOperation<
    _types['destinationInputEntity'],
    resoUpdate,
    stateUpdate
  >

  type OpData = Extract<Op, {type: 'data'}>
  type OpRes = Extract<Op, {type: 'resoUpdate'}>
  type OpState = Extract<Op, {type: 'stateUpdate'}>
  type _resourceUpdateType = ResourceUpdate<
    _types['sourceOutputEntity'],
    _types['resourceSettings']
  >
  type _webhookReturnType = WebhookReturnType<
    _types['sourceOutputEntity'],
    _types['resourceSettings']
  >
  return {
    ...schemas,
    _types: {} as _types,
    _verticals: {} as _verticals,
    _remoteEntity: {} as _remoteEntity,
    _resUpdateType: {} as resoUpdate,
    _stateUpdateType: {} as stateUpdate,
    _opType: {} as Op,
    _intOpType: {} as IntOpData,
    _sourceType: {} as Src,
    _inputOpType: {} as InputOp,
    _resourceUpdateType: {} as _resourceUpdateType,
    _webhookReturnType: {} as _webhookReturnType,

    // Fns
    _type: <K extends keyof _types>(_k: K, v: _types[K]) => v,
    _op: <K extends Op['type']>(
      ...args: {} extends Omit<Extract<Op, {type: K}>, 'type'>
        ? [K]
        : [K, Omit<Extract<Op, {type: K}>, 'type'>]
    ) => ({...args[1], type: args[0]}) as unknown as Extract<Op, {type: K}>,
    _opRes: (id: string, rest: Omit<OpRes, 'id' | 'type'>) =>
      R.identity<Op>({
        // We don't prefix in `_opData`, should we actually prefix here?
        ...rest,
        // TODO: ok so this is a sign that we should be prefixing using a link of some kind...
        id: makeId('reso', schemas.name.value, id),
        type: 'resoUpdate',
      }) as OpRes,
    _opState: (
      sourceState?: OpState['sourceState'],
      destinationState?: OpState['destinationState'],
    ) =>
      R.identity<Op>({
        sourceState,
        destinationState,
        type: 'stateUpdate',
      }) as OpState,
    _opData: <K extends OpData['data']['entityName']>(
      entityName: K,
      id: string,
      entity: string extends OpData['data']['entityName']
        ? Record<string, unknown> | null
        : Extract<OpData['data'], {entityName: K}>['entity'] | null,
    ) =>
      ({
        // TODO: Figure out why we need an `unknown` cast here
        data: {entityName, id, entity} as unknown as OpData['data'],
        type: 'data',
      }) satisfies OpData,
    _intOpData: (
      id: ExternalId,
      integrationData: _types['integrationData'],
    ): IntOpData => ({
      type: 'data',
      data: {
        // We don't prefix in `_opData`, should we actually prefix here?
        id: makeId('int', schemas.name.value, id),
        entityName: 'integration',
        entity: integrationData,
      },
    }),
    _webhookReturn: (
      resourceExternalId: _resourceUpdateType['resourceExternalId'],
      rest: Omit<_resourceUpdateType, 'resourceExternalId'>,
    ): _webhookReturnType => ({
      resourceUpdates: [{...rest, resourceExternalId}],
    }),
  }
}

// MARK: - Generic Helpers, perhaps move to separate file?

type _infer<T> = T extends z.ZodTypeAny ? z.infer<T> : never
type OmitNever<T> = Omit<T, NeverKeys<T>>
/** Surprisingly tricky, see. https://www.zhenghao.io/posts/ts-never */
type NeverKeys<T> = Exclude<
  {[K in keyof T]: [T[K]] extends [never] ? K : never}[keyof T],
  undefined
>
