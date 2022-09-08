import {castIs, makePrefixedId, z} from '@ledger-sync/util'

import {logLink} from './base-links'
import type {Destination, EnvName, Source, SyncOperation} from './protocol'
import {zEnvName} from './protocol'

export const CORE_NAME_TO_PREFIX = {
  integration: 'int',
  connection: 'conn',
  pipeline: 'pipe',
  institution: 'ins',
} as const
type Prefix = typeof CORE_NAME_TO_PREFIX[keyof typeof CORE_NAME_TO_PREFIX]

// Move to protocol?

export function makeCoreId<TPrefix extends Prefix, TPName extends string>(
  prefix: TPrefix,
  providerName: TPName,
  externalId: string,
) {
  return makePrefixedId(prefix, providerName, externalId)
}

export function zId<TPrefix extends Prefix>(prefix: TPrefix) {
  return z
    .string()
    .refine(
      (s): s is `${TPrefix}_${string}` => s.startsWith(`${prefix}_`),
      `Not a valid ${prefix} id`,
    )
}

// MARK: - Types

/** TODO: Move me to client side... */
export type UseLedgerSyncOptions = z.infer<typeof zUseLedgerSyncOptions>
export const zUseLedgerSyncOptions = z.object({
  envName: zEnvName,
  ledgerId: z.string(),
})

export interface DialogConfig {
  Component: React.ComponentType<{close: () => void}>
  options?: {onClose?: () => void}
}

/** TODO: Move me to client side... */
export interface UseConnectScope {
  openDialog: (
    Component: DialogConfig['Component'],
    options?: DialogConfig['options'],
  ) => void
}

export type UseConnectHook<T extends AnyProviderDef> = (
  scope: UseConnectScope,
) => (
  connectInput: T['_types']['connectInput'],
  context: ConnectContextInput, // ConnectContext<T, 'frontend'>,
) => Promise<T['_types']['connectOutput']>

export type ConnectContextInput = z.input<typeof zConnectContextInput>
export const zConnectContextInput = z.object({
  envName: zEnvName,
  ledgerId: z.string(),
  /** Noop if `connectionId` is specified */
  institutionId: zId('ins').nullish(),
  connectionId: zId('conn').nullish(),
})

export interface ConnectContext<TSettings> {
  ledgerId: string
  envName: EnvName
  institutionId?: string | null
  connection?: {id: string; settings: TSettings} | null
}
export interface PreConnOptions<T = unknown> {
  key: string
  label: string
  options: T
}

// type Optional<T> = {[P in keyof T]: T[P] | undefined}
export interface ConnectedSource<T extends AnyProviderDef>
  extends Partial<UseLedgerSyncOptions> {
  // Should we instead use mapStandardConnection for this?
  externalId: string
  settings: T['_types']['connectionSettings']
  source$: Source<T['_types']['sourceOutputEntity']>
}

/**
 * Should this be renamed to `UpstreamProvider` instead?
 */
export type StandardInstitution = z.infer<typeof zStandardInstitution>
export const zStandardInstitution = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().url().optional(),
  loginUrl: z.string().url().optional(),
  /** Environment specific providers */
  envName: zEnvName.optional(),
})

export type StandardConnection = z.infer<typeof zStandardConnection>
export const zStandardConnection = z.object({
  id: z.string().nullish(), // FIXME: This is not optional...
  displayName: z.string().nullish(),
  institution: zStandardInstitution.optional(),
  /**
   * This correspond to the connection status.
   * Pipeline shall have a separate syncStatus */
  status: z
    .enum([
      'healthy', // Connected and all is well
      'disconnected', // User intervention needed to reconnect
      'error', // System error, nothing user can do. This would also include revoked
      'manual', // This is a manual connection (e.g. import. So normal status does not apply)
    ])
    .nullish(), // Status unknown
  statusMessage: z.string().nullish(),
})

export type WebhookInput = z.infer<typeof zWebhookInput>
export const zWebhookInput = z.object({
  headers: z
    .record(z.unknown())
    .refine(castIs<import('http').IncomingHttpHeaders>()),
  query: z.record(z.unknown()),
  body: z.unknown(),
})

// MARK: - Provider def

type _opt<T> = T | undefined
type _infer<T> = T extends z.ZodTypeAny ? z.infer<T> : never

/** Surprisingly tricky, see. https://www.zhenghao.io/posts/ts-never */
type NeverKeys<T> = Exclude<
  {[K in keyof T]: [T[K]] extends [never] ? K : never}[keyof T],
  undefined
>

type OmitNever<T> = Omit<T, NeverKeys<T>> // & {[k in NeverKeys<T>]?: undefined}

export type AnyProviderDef = Omit<
  ReturnType<typeof makeSyncProviderDef>,
  // Including these three introduces type issues... Not entirely
  // sure how to fix them for now. Other keys seems fine somehow...
  '_type' | '_op' | '_preConnOption' | '_insOpData'
>
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
  ZSrcSyncOptions extends _opt<z.ZodTypeAny>,
  ZSrcOutEntity extends _opt<z.ZodTypeAny>,
  ZDestSyncOptions extends _opt<z.ZodTypeAny>,
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
  sourceSyncOptions: ZSrcSyncOptions
  sourceOutputEntity: ZSrcOutEntity
  destinationSyncOptions: ZDestSyncOptions
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
  type Op = SyncOperation<
    _types['sourceOutputEntity'],
    _types['connectionSettings'],
    _types['sourceSyncOptions'],
    _types['destinationSyncOptions']
  >
  type OpData = Extract<Op, {type: 'data'}>
  type OpConn = Extract<Op, {type: 'connUpdate'}>
  type OpState = Extract<Op, {type: 'stateUpdate'}>
  return {
    ...schemas,
    /** Helpers. Would be great if they could be extracted to separate namespace from schemas */
    _types: {} as _types,
    _opType: {} as Op,
    _insOpType: {} as InsOpData,
    _type: <K extends keyof _types>(_k: K, v: _types[K]) => v,
    _op: <K extends Op['type']>(
      ...args: {} extends Omit<Extract<Op, {type: K}>, 'type'>
        ? [K]
        : [K, Omit<Extract<Op, {type: K}>, 'type'>]
    ) => ({...args[1], type: args[0]} as unknown as Extract<Op, {type: K}>),
    _opConn: (id: string, rest: Omit<OpConn, 'id' | 'type'>): Op => ({
      // We don't prefix in `_opData`, should we actually prefix here?
      ...rest,
      id: makeCoreId('conn', schemas.name.value, id),
      type: 'connUpdate',
    }),
    _opState: (
      sourceSyncOptions?: OpState['sourceSyncOptions'],
      destinationSyncOptions?: OpState['destinationSyncOptions'],
    ): Op => ({
      sourceSyncOptions,
      destinationSyncOptions,
      type: 'stateUpdate',
    }),
    _opData: <K extends OpData['data']['entityName']>(
      entityName: K,
      id: string,
      entity: Extract<OpData['data'], {entityName: K}>['entity'] | null,
    ): Op => ({
      // TODO: Figure out why we need an `unknown` cast here
      data: {entityName, id, entity} as unknown as OpData['data'],
      type: 'data',
    }),
    _insOpData: (
      id: string,
      insitutionData: _types['institutionData'],
    ): InsOpData => ({
      type: 'data',
      data: {
        // We don't prefix in `_opData`, should we actually prefix here?
        id: makeCoreId('ins', schemas.name.value, id),
        entityName: 'institution',
        entity: insitutionData,
      },
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
  sourceSyncOptions: undefined,
  destinationSyncOptions: undefined,
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
        options: T['_types']['sourceSyncOptions']
      }>,
    ) => Source<T['_types']['sourceOutputEntity']>
  >,
  TDestSync extends _opt<
    (
      input: OmitNever<{
        config: T['_types']['integrationConfig']
        settings: T['_types']['connectionSettings']
        options: T['_types']['destinationSyncOptions']
      }>,
    ) => Destination<T['_types']['destinationInputEntity']>
  >,
  TMetaSync extends _opt<
    (
      input: OmitNever<{
        config: T['_types']['integrationConfig']
        // options: T['_types']['sourceSyncOptions']
      }>,
    ) => Source<T['_insOpType']['data']>
  >,
  // Connect
  TMappers extends _opt<{
    institution?: (
      data: T['_types']['institutionData'],
    ) => Omit<StandardInstitution, 'id'>
    connection: (
      settings: T['_types']['connectionSettings'],
    ) => StandardConnection
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
    ) => Promise<ConnectedSource<T>>
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
    ) => Array<ConnectedSource<T>>
    // TODO: Consider having a return value for the http response too.
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

  /** Well, what it says... */
  revokeConnection: TRevokeConn

  handleWebhook: THandleWebhook

  // MARK: - Synchronization

  /**
   * Can be either provider initiated or ledgerSync initiated
   * LedgerSync initiated (may not explicitly complete)
   *   - Previusly iterateEntities. Filter for `ready` event to complete initial sync
   *     in case the sync is listen based rather than poll based (e.g. watchChanges)
   * Provider initiated (always completes)
   *   - handlePushData ?
   *   - handleOauthCallback ?
   */
  sourceSync: TSrcSync

  /**
   * Always ledgerSync initiated. Handles a list of operations and may also emit
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
  revokeConnection: undefined,
  handleWebhook: undefined,
  sourceSync: undefined,
  destinationSync: undefined,
  metaSync: undefined,
  extension: undefined,
})

export const debugProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def: makeSyncProvider.def({
    ...makeSyncProvider.def.defaults,
    name: z.literal('debug'),
  }),
  destinationSync: () => logLink({prefix: 'debug', verbose: true}),
})
