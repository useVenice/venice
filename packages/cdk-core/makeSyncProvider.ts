import type {MaybePromise} from '@usevenice/util'
import {
  castIs,
  R,
  titleCase,
  urlFromImage,
  z,
  zodToJsonSchema,
} from '@usevenice/util'

import type {EndUserId, ExtEndUserId, ExternalId} from './id.types'
import {makeId, zExternalId} from './id.types'
import type {IntegrationSchemas} from './integration.types'
import type {ZStandard} from './meta.types'
import type {
  AnyEntityPayload,
  Destination,
  ResoUpdateData,
  Source,
  StateUpdateData,
  SyncOperation,
} from './protocol'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type JSONSchema = {} // ReturnType<typeof zodToJsonSchema> | JSONSchema7Definition

export const metaForProvider = (provider: AnySyncProvider) => ({
  // ...provider,
  name: provider.name,
  displayName: provider.metadata?.displayName ?? titleCase(provider.name),
  logoUrl: provider.metadata?.logoSvg
    ? urlFromImage({type: 'svg', data: provider.metadata?.logoSvg})
    : provider.metadata?.logoUrl,
  stage: provider.metadata?.stage ?? 'alpha',
  platforms: provider.metadata?.platforms ?? ['cloud', 'local'],
  categories: provider.metadata?.categories ?? ['other'],
  supportedModes: R.compact([
    provider.sourceSync ? ('source' as const) : null,
    provider.destinationSync ? ('destination' as const) : null,
  ]),
  hasPreConnect: provider.preConnect != null,
  hasUseConnectHook: provider.useConnectHook != null,
  hasPostConnect: provider.postConnect != null,
  schemas: R.mapValues(provider.def ?? {}, (schema) =>
    schema instanceof z.ZodSchema ? zodToJsonSchema(schema) : undefined,
  ) as Record<keyof IntegrationSchemas, JSONSchema>,
})

export const zIntegrationCategory = z.enum([
  'banking',
  'accounting',
  'commerce',
  'enrichment',
  'database',
  'flat-files',
  'streaming',
  'other',
])

export const zIntegrationStage = z.enum(['hidden', 'alpha', 'beta', 'ga'])

export interface IntegrationMetadata {
  logoUrl?: string
  logoSvg?: string
  displayName?: string
  platforms?: Array<'cloud' | 'local'>
  stage?: z.infer<typeof zIntegrationStage>
  // labels?: Array<'featured' | 'banking' | 'accounting' | 'enrichment'>
  categories?: Array<z.infer<typeof zIntegrationCategory>>
}

// MARK: - Shared connect types

/** Useful for establishing the initial pipeline when creating a connection for the first time */

export type ConnectOptions = z.input<typeof zConnectOptions>
export const zConnectOptions = z.object({
  // userId: UserId,
  /** Noop if `connectionId` is specified */
  institutionExternalId: zExternalId.nullish(),
  resourceExternalId: zExternalId.nullish(),
})

export const zPostConnectOptions = zConnectOptions.extend({
  syncInBand: z.boolean().nullish(),
})

// MARK: - Client side connect types

export type OpenDialogFn = (
  Component: React.ComponentType<{close: () => void}>,
  options?: {
    dismissOnClickOutside?: boolean
    onClose?: () => void
  },
) => void

export type UseConnectHook<T extends AnyProviderDef> = (scope: {
  openDialog: OpenDialogFn
}) => (
  connectInput: T['_types']['connectInput'],
  context: ConnectOptions,
) => Promise<T['_types']['connectOutput']>

// MARK: - Server side connect types

export interface CheckResourceContext {
  webhookBaseUrl: string
}

/** Context providers get during the connection establishing phase */
export interface ConnectContext<TSettings>
  extends Omit<ConnectOptions, 'resourceExternalId' | 'envName'>,
    CheckResourceContext {
  extEndUserId: ExtEndUserId
  /** Used for OAuth based integrations, e.g. https://plaid.com/docs/link/oauth/#create-and-register-a-redirect-uri */
  redirectUrl?: string
  resource?: {
    externalId: ExternalId
    settings: TSettings
  } | null
}

// TODO: We should rename `provider` to `integration` given that they are both
// Sources AND destinations. Provider only makes sense for sources.
// An integration can have `connect[UI]`, `src[Connector]` and `dest[Connector]`
export type CheckResourceOptions = z.infer<typeof zCheckResourceOptions>
export const zCheckResourceOptions = z.object({
  /**
   * Always make a request to the provider. Perhaps should be the default?
   * Will have to refactor `checkResource` to be a bit different
   */
  skipCache: z.boolean().nullish(),
  /** Persist input into connection storage */
  import: z.boolean().nullish(),
  /**
   * Update the webhook associated with this connection to based on webhookBaseUrl
   */
  updateWebhook: z.boolean().nullish(),
  /** Fire webhook for default data updates  */
  sandboxSimulateUpdate: z.boolean().nullish(),
  /** For testing out disconnection handling */
  sandboxSimulateDisconnect: z.boolean().nullish(),
})

/** Extra props not on ResoUpdateData */
export interface ResourceUpdate<
    TEntity extends AnyEntityPayload = AnyEntityPayload,
    TSettings = unknown,
  >
  // make `ResoUpdateData.id` not prefixed so we can have better inheritance
  extends Omit<ResoUpdateData<TSettings>, 'id'> {
  // Subset of resoUpdate
  resourceExternalId: ExternalId
  // Can we inherit types used by metaLinks?
  /** If missing it means do not change the userId... */
  endUserId?: EndUserId | null

  source$?: Source<TEntity>
  triggerDefaultSync?: boolean
}

export type WebhookInput = z.infer<typeof zWebhookInput>
export const zWebhookInput = z.object({
  headers: z
    .record(z.unknown())
    .refine(castIs<import('http').IncomingHttpHeaders>()),
  query: z.record(z.unknown()),
  body: z.unknown(),
})

export interface WebhookReturnType<
  TEntity extends AnyEntityPayload,
  TSettings,
> {
  resourceUpdates: Array<ResourceUpdate<TEntity, TSettings>>
  /** HTTP Response body */
  response?: {
    body: Record<string, unknown>
  }
}

// MARK: - Provider def

type _opt<T> = T | undefined
type _infer<T> = T extends z.ZodTypeAny ? z.infer<T> : never

/** Surprisingly tricky, see. https://www.zhenghao.io/posts/ts-never */
type NeverKeys<T> = Exclude<
  {[K in keyof T]: [T[K]] extends [never] ? K : never}[keyof T],
  undefined
>

type OmitNever<T> = Omit<T, NeverKeys<T>> // & {[k in NeverKeys<T>]?: undefined}

export type AnyProviderDef = ReturnType<typeof makeSyncProviderDef>
function makeSyncProviderDef<
  TName extends string,
  ZIntConfig extends _opt<z.ZodTypeAny>,
  ZResSettings extends _opt<z.ZodTypeAny>,
  ZInsData extends _opt<z.ZodTypeAny>,
  // How do we enforce that the input type of ZWebhookInput must be a subset
  // of the input type of typeof zWebhookInput?
  // Right now things like zWebhookInput.extend({whatev: z.string()}) is allowed https://share.cleanshot.com/9PImJE
  // But that is not really going to be valid.
  ZWebhookInput extends _opt<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    z.ZodType<any, any, z.input<typeof zWebhookInput>>
  >,
  // Sync
  ZSrcState extends _opt<z.ZodTypeAny>,
  ZSrcOutEntity extends _opt<z.ZodTypeAny>,
  ZDestState extends _opt<z.ZodTypeAny>,
  ZDestInEntity extends _opt<z.ZodTypeAny>,
  // Connect
  ZPreConnInput extends _opt<z.ZodTypeAny>,
  ZConnInput extends _opt<z.ZodTypeAny>,
  ZConnOutput extends _opt<z.ZodTypeAny>,
>(schemas: {
  name: z.ZodLiteral<TName>
  integrationConfig: ZIntConfig
  resourceSettings: ZResSettings
  institutionData: ZInsData
  webhookInput: ZWebhookInput
  preConnectInput: ZPreConnInput
  connectInput: ZConnInput
  connectOutput: ZConnOutput
  /** Maybe can be derived from webhookInput | postConnOutput | inlineInput? */
  sourceState: ZSrcState
  sourceOutputEntity: ZSrcOutEntity
  destinationState: ZDestState
  destinationInputEntity: ZDestInEntity
}) {
  type Schemas = typeof schemas
  type _types = {[k in keyof Schemas]: _infer<Schemas[k]>}
  type InsOpData = Extract<
    SyncOperation<{
      id: string
      entityName: 'institution'
      entity: _types['institutionData']
    }>,
    {type: 'data'}
  >
  type resoUpdate = ResoUpdateData<
    _types['resourceSettings'],
    _types['institutionData']
  >
  type StateUpdate = StateUpdateData<
    _types['sourceState'],
    _types['destinationState']
  >
  type Op = SyncOperation<_types['sourceOutputEntity'], resoUpdate, StateUpdate>
  type Src = Source<_types['sourceOutputEntity'], resoUpdate, StateUpdate>

  return {
    ...schemas,
    _types: {} as _types,
    _resUpdateType: {} as resoUpdate,
    _stateUpdateType: {} as StateUpdate,
    _sourceType: {} as Src,
    // destination type is a function and thus causes issues...
    _opType: {} as Op,
    _insOpType: {} as InsOpData,
    _resourceUpdateType: {} as ResourceUpdate<
      _types['sourceOutputEntity'],
      _types['resourceSettings']
    >,
    _webhookReturnType: {} as WebhookReturnType<
      _types['sourceOutputEntity'],
      _types['resourceSettings']
    >,
  }
}

makeSyncProviderDef.helpers = <T extends AnyProviderDef>(def: T) => {
  type _types = T['_types']
  type InsOpData = T['_insOpType']
  type Op = T['_opType']
  type OpData = Extract<Op, {type: 'data'}>
  type OpRes = Extract<Op, {type: 'resoUpdate'}>
  type OpState = Extract<Op, {type: 'stateUpdate'}>
  return {
    ...def,
    _type: <K extends keyof _types>(_k: K, v: _types[K]) => v,
    _op: <K extends Op['type']>(
      ...args: {} extends Omit<Extract<Op, {type: K}>, 'type'>
        ? [K]
        : [K, Omit<Extract<Op, {type: K}>, 'type'>]
    ) => ({...args[1], type: args[0]} as unknown as Extract<Op, {type: K}>),
    _opRes: (id: string, rest: Omit<OpRes, 'id' | 'type'>) =>
      R.identity<Op>({
        // We don't prefix in `_opData`, should we actually prefix here?
        ...rest,
        // TODO: ok so this is a sign that we should be prefixing using a link of some kind...
        id: makeId('reso', def.name.value, id),
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
      entity: Extract<OpData['data'], {entityName: K}>['entity'] | null,
    ) =>
      R.identity<Op>({
        // TODO: Figure out why we need an `unknown` cast here
        data: {entityName, id, entity} as unknown as OpData['data'],
        type: 'data',
      }) as OpData,
    _insOpData: (
      id: ExternalId,
      insitutionData: _types['institutionData'],
    ): InsOpData => ({
      type: 'data',
      data: {
        // We don't prefix in `_opData`, should we actually prefix here?
        id: makeId('ins', def.name.value, id),
        entityName: 'institution',
        entity: insitutionData,
      },
    }),
    _webhookReturn: (
      resourceExternalId: T['_resourceUpdateType']['resourceExternalId'],
      rest: Omit<T['_resourceUpdateType'], 'resourceExternalId'>,
    ): T['_webhookReturnType'] => ({
      resourceUpdates: [{...rest, resourceExternalId}],
    }),
  }
}

makeSyncProviderDef.defaults = makeSyncProviderDef({
  name: z.literal('noop'),
  integrationConfig: undefined,
  resourceSettings: undefined,
  institutionData: undefined,
  webhookInput: undefined,
  preConnectInput: undefined,
  connectInput: undefined,
  connectOutput: undefined,
  sourceOutputEntity: undefined,
  sourceState: undefined,
  destinationState: undefined,
  destinationInputEntity: undefined,
})

// MARK: - Provider

export type AnySyncProvider = ReturnType<typeof makeSyncProvider>

/**
 * Provider definition should be universal.
 * Need to figure out pattern for platform specific code
 */
export function makeSyncProvider<
  T extends AnyProviderDef,
  // Sync
  TSrcSync extends _opt<
    (
      input: OmitNever<{
        endUser: {id: EndUserId} | null | undefined
        config: T['_types']['integrationConfig']
        settings: T['_types']['resourceSettings']
        state: T['_types']['sourceState']
      }>,
    ) => Source<T['_types']['sourceOutputEntity']>
  >,
  TDestSync extends _opt<
    (
      input: OmitNever<{
        endUser: {id: EndUserId} | null | undefined
        config: T['_types']['integrationConfig']
        settings: T['_types']['resourceSettings']
        state: T['_types']['destinationState']
      }>,
    ) => Destination<T['_types']['destinationInputEntity']>
  >,
  TMetaSync extends _opt<
    (
      input: OmitNever<{
        config: T['_types']['integrationConfig']
        // options: T['_types']['sourceState']
      }>,
    ) => Source<T['_insOpType']['data']>
  >,
  // Connect
  TMappers extends _opt<{
    institution?: (
      data: T['_types']['institutionData'],
    ) => Omit<ZStandard['institution'], 'id'>
    resource: (
      settings: T['_types']['resourceSettings'],
    ) => Omit<ZStandard['resource'], 'id'>
  }>,
  // TODO: Consider modeling after classes. Separating `static` from `instance` methods
  // by introducing a separate `instance` method that accepts config
  // and returns functions that already have access to config via the scope
  // one challenge is that it would make the logic somewhat less clear
  // as UseConnectHook would be a static method while pre/post conn are going to
  // be instance methods.
  TPreConn extends _opt<
    (
      config: T['_types']['integrationConfig'],
      context: ConnectContext<T['_types']['resourceSettings']>,
      // TODO: Turn this into an object instead
      input: T['_types']['preConnectInput'],
    ) => Promise<T['_types']['connectInput']>
  >,
  TUseConnHook extends _opt<UseConnectHook<T>>,
  TPostConn extends _opt<
    (
      connectOutput: T['_types']['connectOutput'],
      config: T['_types']['integrationConfig'],
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
  >,
  TCheckRes extends _opt<
    (
      input: OmitNever<{
        settings: T['_types']['resourceSettings']
        config: T['_types']['integrationConfig']
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
  >,
  // This probably need to also return an observable
  TRevokeRes extends _opt<
    (
      settings: T['_types']['resourceSettings'],
      config: T['_types']['integrationConfig'],
    ) => Promise<unknown>
  >,
  // MARK - Webhook
  // Need to add a input schema for each provider to verify the shape of the received
  // webhook requests...
  THandleWebhook extends _opt<
    (
      webhookInput: T['_types']['webhookInput'],
      config: T['_types']['integrationConfig'],
    ) => MaybePromise<
      WebhookReturnType<
        T['_types']['sourceOutputEntity'],
        T['_types']['resourceSettings']
      >
    >
  >,
  TExtension,
>(impl: {
  def: T
  metadata?: IntegrationMetadata
  standardMappers: TMappers

  // MARK: - Connection management
  // Consider combining these into a single function with union input to make the
  // provider interface less verbose. e.g. phase: 'will' | 'did' | 'revoke'

  /** e.g. Generating public token to use for connection */
  preConnect: TPreConn

  /**
   * React hook called client side
   * Remember to respect rule of hooks, never call conditionally and never call inside loops
   * Must be called synchronously, unconditionally and with a fixed number of invocations
   */
  useConnectHook: TUseConnHook

  /** aka `postConnect` e.g. Exchange public token for access token and persist connection */
  postConnect: TPostConn

  /** Notably may be used to update webhook */
  checkResource: TCheckRes

  /** Well, what it says... */
  revokeResource: TRevokeRes

  handleWebhook: THandleWebhook

  // MARK: - Synchronization

  /**
   * Can be either provider initiated or venice initiated
   * Venice initiated (may not explicitly complete)
   *   - Previusly iterateEntities. Filter for `ready` event to complete initial sync
   *     in case the sync is listen based rather than poll based (e.g. watchChanges)
   * Provider initiated (always completes)
   *   - handlePushData ?
   *   - handleOauthCallback ?
   */
  sourceSync: TSrcSync

  /**
   * Always venice initiated. Handles a list of operations and may also emit
   * progress events. `ready` event lets engine know that it may terminate if needed
   */
  destinationSync: TDestSync

  metaSync: TMetaSync

  /** Allow core sync to be extended, for exampke, by ledger sync */
  extension: TExtension
}) {
  return {...impl, name: impl.def.name.value as T['_types']['name']}
}

makeSyncProvider.def = makeSyncProviderDef

/**
 * Can be used as makeProviderNext({...makeProviderNext.noop, yourCode...})
 * @see https://tkdodo.eu/blog/optional-vs-undefined for inspiration
 */
makeSyncProvider.defaults = makeSyncProvider({
  def: makeSyncProvider.def.defaults,
  standardMappers: undefined,
  preConnect: undefined,
  useConnectHook: undefined,
  postConnect: undefined,
  checkResource: undefined,
  revokeResource: undefined,
  handleWebhook: undefined,
  sourceSync: undefined,
  destinationSync: undefined,
  metaSync: undefined,
  extension: undefined,
})
