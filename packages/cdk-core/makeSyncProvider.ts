import type {MaybePromise} from '@usevenice/util'
import {identity} from '@usevenice/util'
import {castIs, z} from '@usevenice/util'

import {logLink} from './base-links'
import type {ExternalId, Id} from './id.types'
import {makeId, zExternalId} from './id.types'
import type {EnvName, ZStandard} from './meta.types'
import {zEnvName} from './meta.types'
import type {
  AnyEntityPayload,
  ConnUpdateData,
  Destination,
  Source,
  StateUpdateData,
  SyncOperation,
} from './protocol'

// MARK: - Shared connect types

export type ConnectOptions = z.input<typeof zConnectOptions>
export const zConnectOptions = z.object({
  // ledgerId: zId('ldgr'),
  envName: zEnvName,
  /** Noop if `connectionId` is specified */
  institutionExternalId: zExternalId.nullish(),
  connectionExternalId: zExternalId.nullish(),
})

// MARK: - Client side connect types

export type UseConnectHook<T extends AnyProviderDef> = (scope: {
  ledgerId: Id['ldgr'] | undefined
  openDialog: (
    Component: React.ComponentType<{close: () => void}>,
    options?: {onClose?: () => void},
  ) => void
}) => (
  connectInput: T['_types']['connectInput'],
  context: ConnectOptions,
) => Promise<T['_types']['connectOutput']>

// MARK: - Server side connect types

export interface CheckConnectionContext {
  webhookBaseUrl: string
}

/** Context providers get during the connection establishing phase */
export interface ConnectContext<TSettings>
  extends Omit<ConnectOptions, 'connectionExternalId'>,
    CheckConnectionContext {
  ledgerId: Id['ldgr']
  /** Used for OAuth based integrations, e.g. https://plaid.com/docs/link/oauth/#create-and-register-a-redirect-uri */
  redirectUrl?: string
  connection?: {
    externalId: ExternalId
    settings: TSettings
  } | null
}

export type CheckConnectionOptions = z.infer<typeof zCheckConnectionOptions>
export const zCheckConnectionOptions = z.object({
  /**
   * Update the webhook associated with this connection to based on webhookBaseUrl
   */
  updateWebhook: z.boolean().nullish(),
  /** Fire webhook for default data updates  */
  sandboxSimulateUpdate: z.boolean().nullish(),
  /** For testing out disconnection handling */
  sandboxSimulateDisconnect: z.boolean().nullish(),
})

export interface ConnectionUpdate<TEntity extends AnyEntityPayload, TSettings>
  // make `ConnUpdateData.id` not prefixed so we can have better inheritance
  extends Omit<ConnUpdateData<TSettings>, 'id'> {
  // Subset of connUpdate
  connectionExternalId: ExternalId
  // Can we inherit types used by metaLinks?
  ledgerId?: Id['ldgr']
  envName?: EnvName

  // Extra props not on ConnUpdateData
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
  connectionUpdates: Array<ConnectionUpdate<TEntity, TSettings>>
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
  ZConnSettings extends _opt<z.ZodTypeAny>,
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
  connectionSettings: ZConnSettings
  institutionData: ZInsData
  webhookInput: ZWebhookInput

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
  type ConnUpdate = ConnUpdateData<
    _types['connectionSettings'],
    _types['institutionData']
  >
  type StateUpdate = StateUpdateData<
    _types['sourceState'],
    _types['destinationState']
  >
  type Op = SyncOperation<_types['sourceOutputEntity'], ConnUpdate, StateUpdate>
  type Src = Source<_types['sourceOutputEntity'], ConnUpdate, StateUpdate>

  return {
    ...schemas,
    _types: {} as _types,
    _connUpdateType: {} as ConnUpdate,
    _stateUpdateType: {} as StateUpdate,
    _sourceType: {} as Src,
    // destination type is a function and thus causes issues...
    _opType: {} as Op,
    _insOpType: {} as InsOpData,
    _connectionUpdateType: {} as ConnectionUpdate<
      _types['sourceOutputEntity'],
      _types['connectionSettings']
    >,
    _webhookReturnType: {} as WebhookReturnType<
      _types['sourceOutputEntity'],
      _types['connectionSettings']
    >,
  }
}

makeSyncProviderDef.helpers = <T extends AnyProviderDef>(def: T) => {
  type _types = T['_types']
  type InsOpData = T['_insOpType']
  type Op = T['_opType']
  type OpData = Extract<Op, {type: 'data'}>
  type OpConn = Extract<Op, {type: 'connUpdate'}>
  type OpState = Extract<Op, {type: 'stateUpdate'}>
  return {
    ...def,
    _type: <K extends keyof _types>(_k: K, v: _types[K]) => v,
    _op: <K extends Op['type']>(
      ...args: {} extends Omit<Extract<Op, {type: K}>, 'type'>
        ? [K]
        : [K, Omit<Extract<Op, {type: K}>, 'type'>]
    ) => ({...args[1], type: args[0]} as unknown as Extract<Op, {type: K}>),
    _opConn: (id: string, rest: Omit<OpConn, 'id' | 'type'>) =>
      identity<Op>({
        // We don't prefix in `_opData`, should we actually prefix here?
        ...rest,
        // TODO: ok so this is a sign that we should be prefixing using a link of some kind...
        id: makeId('conn', def.name.value, id),
        type: 'connUpdate',
      }) as OpConn,
    _opState: (
      sourceState?: OpState['sourceState'],
      destinationState?: OpState['destinationState'],
    ) =>
      identity<Op>({
        sourceState,
        destinationState,
        type: 'stateUpdate',
      }) as OpState,
    _opData: <K extends OpData['data']['entityName']>(
      entityName: K,
      id: string,
      entity: Extract<OpData['data'], {entityName: K}>['entity'] | null,
    ) =>
      identity<Op>({
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
      connectionExternalId: T['_connectionUpdateType']['connectionExternalId'],
      rest: Omit<T['_connectionUpdateType'], 'connectionExternalId'>,
    ): T['_webhookReturnType'] => ({
      connectionUpdates: [{...rest, connectionExternalId}],
    }),
  }
}

makeSyncProviderDef.defaults = makeSyncProviderDef({
  name: z.literal('noop'),
  integrationConfig: undefined,
  connectionSettings: undefined,
  institutionData: undefined,
  webhookInput: undefined,
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
        config: T['_types']['integrationConfig']
        settings: T['_types']['connectionSettings']
        state: T['_types']['sourceState']
      }>,
    ) => Source<T['_types']['sourceOutputEntity']>
  >,
  TDestSync extends _opt<
    (
      input: OmitNever<{
        config: T['_types']['integrationConfig']
        settings: T['_types']['connectionSettings']
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
    connection: (
      settings: T['_types']['connectionSettings'],
    ) => Omit<ZStandard['connection'], 'id'>
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
      context: ConnectContext<T['_types']['connectionSettings']>,
    ) => Promise<T['_types']['connectInput']>
  >,
  TUseConnHook extends _opt<UseConnectHook<T>>,
  TPostConn extends _opt<
    (
      connectOutput: T['_types']['connectOutput'],
      config: T['_types']['integrationConfig'],
      context: ConnectContext<T['_types']['connectionSettings']>,
    ) => MaybePromise<
      Omit<
        ConnectionUpdate<
          T['_types']['sourceOutputEntity'],
          T['_types']['connectionSettings']
        >,
        'ledgerId'
      >
    >
  >,
  TCheckConn extends _opt<
    (
      input: OmitNever<{
        settings: T['_types']['connectionSettings']
        config: T['_types']['integrationConfig']
        options: CheckConnectionOptions
        context: CheckConnectionContext
      }>,
    ) => MaybePromise<
      Omit<
        ConnectionUpdate<
          T['_types']['sourceOutputEntity'],
          T['_types']['connectionSettings']
        >,
        'ledgerId'
      >
    >
  >,
  // This probably need to also return an observable
  TRevokeConn extends _opt<
    (
      settings: T['_types']['connectionSettings'],
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
        T['_types']['connectionSettings']
      >
    >
  >,
  TExtension,
>(impl: {
  def: T
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
  checkConnection: TCheckConn

  /** Well, what it says... */
  revokeConnection: TRevokeConn

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
  checkConnection: undefined,
  revokeConnection: undefined,
  handleWebhook: undefined,
  sourceSync: undefined,
  destinationSync: undefined,
  metaSync: undefined,
  extension: undefined,
})
