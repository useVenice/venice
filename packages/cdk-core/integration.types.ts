import type {MaybePromise, z} from '@usevenice/util'
import type {Id} from './id.types'
import type {
  CheckResourceContext,
  CheckResourceOptions,
  ConnectContext,
  ConnectOptions,
  OpenDialogFn,
  ResourceUpdate,
  WebhookReturnType,
} from './makeSyncProvider'
import type {
  Destination,
  ResoUpdateData,
  Source,
  StateUpdateData,
  SyncOperation,
} from './protocol'

import {R} from '@usevenice/util'
import {makeId} from './id.types'
import type {ZStandard} from './meta.types'

/** Maybe this should be renamed to `schemas` */
export interface IntegrationDef {
  name: z.ZodLiteral<string>
  integrationConfig?: z.ZodTypeAny
  resourceSettings?: z.ZodTypeAny
  institutionData?: z.ZodTypeAny
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
}

export type ExtendDef<TDef extends IntegrationDef> = ReturnType<
  typeof defHelpers<TDef>
>
export interface IntegrationImpl<
  TDef extends IntegrationDef,
  T extends ExtendDef<TDef> = ExtendDef<TDef>,
> {
  [k: string]: unknown
  def: TDef
  name: TDef['name']['_def']['value']

  standardMappers?: {
    institution?: (
      data: T['_types']['institutionData'],
    ) => Omit<ZStandard['institution'], 'id'>
    resource: (
      settings: T['_types']['resourceSettings'],
    ) => Omit<ZStandard['resource'], 'id'>
  }
  extension?: {
    // TODO: Should this be wrapped into the core? Does cdk-ledger even make sense?
    sourceMapEntity?:
      | Partial<{
          // Simpler
          [k in T['_types']['sourceOutputEntity']['entityName']]: (
            entity: Extract<T['_types']['sourceOutputEntity'], {entityName: k}>,
            settings: T['_types']['resourceSettings'],
          ) => import('../cdk-ledger').EntityPayload | null
        }>
      // More powerful
      | ((
          entity: T['_types']['sourceOutputEntity'],
          settings: T['_types']['resourceSettings'],
        ) => import('../cdk-ledger').EntityPayload | null)
  }

  // MARK: - Connect

  preConnect?: (
    config: T['_types']['integrationConfig'],
    context: ConnectContext<T['_types']['resourceSettings']>,
    // TODO: Turn this into an object instead
    input: T['_types']['preConnectInput'],
  ) => Promise<T['_types']['connectInput']>

  useConnectHook?: (scope: {
    userId: UserId | undefined
    openDialog: OpenDialogFn
  }) => (
    connectInput: T['_types']['connectInput'],
    context: ConnectOptions,
  ) => Promise<T['_types']['connectOutput']>

  postConnect?: (
    connectOutput: T['_types']['connectOutput'],
    config: T['_types']['integrationConfig'],
    context: ConnectContext<T['_types']['resourceSettings']>,
  ) => MaybePromise<
    Omit<
      ResourceUpdate<
        T['_types']['sourceOutputEntity'],
        T['_types']['resourceSettings']
      >,
      'creatorId'
    >
  >

  checkResource?: (
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
      'creatorId'
    >
  >

  // This probably need to also return an observable
  revokeResource?: (
    settings: T['_types']['resourceSettings'],
    config: T['_types']['integrationConfig'],
  ) => Promise<unknown>

  // MARK: - Sync

  sourceSync?: (
    input: OmitNever<{
      id: Id['reso']
      config: T['_types']['integrationConfig']
      settings: T['_types']['resourceSettings']
      state: T['_types']['sourceState']
    }>,
  ) => Source<T['_types']['sourceOutputEntity']>

  destinationSync?: (
    input: OmitNever<{
      id: Id['reso']
      config: T['_types']['integrationConfig']
      settings: T['_types']['resourceSettings']
      state: T['_types']['destinationState']
    }>,
  ) => Destination<T['_types']['destinationInputEntity']>

  metaSync?: (
    input: OmitNever<{
      config: T['_types']['integrationConfig']
      // options: T['_types']['sourceState']
    }>,
  ) => Source<T['_insOpType']['data']>

  // MARK - Webhook
  // Need to add a input schema for each provider to verify the shape of the received
  // webhook requests...
  handleWebhook?: (
    webhookInput: T['_types']['webhookInput'],
    config: T['_types']['integrationConfig'],
  ) => MaybePromise<
    WebhookReturnType<
      T['_types']['sourceOutputEntity'],
      T['_types']['resourceSettings']
    >
  >
}

// MARK: - Runtime helpers

export function defHelpers<TDef extends IntegrationDef>(def: TDef) {
  type _types = {[k in keyof TDef]: _infer<TDef[k]>}
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
    ...def,
    _types: {} as _types,
    _resUpdateType: {} as resoUpdate,
    _stateUpdateType: {} as stateUpdate,
    _opType: {} as Op,
    _insOpType: {} as InsOpData,
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
      resourceExternalId: _resourceUpdateType['resourceExternalId'],
      rest: Omit<_resourceUpdateType, 'resourceExternalId'>,
    ): _webhookReturnType => ({
      resourceUpdates: [{...rest, resourceExternalId}],
    }),
  }
}

// MARK: - Generic Helpers, perhaps move to separate file?ß

type _infer<T> = T extends z.ZodTypeAny ? z.infer<T> : never
type OmitNever<T> = Omit<T, NeverKeys<T>>
/** Surprisingly tricky, see. https://www.zhenghao.io/posts/ts-never */
type NeverKeys<T> = Exclude<
  {[K in keyof T]: [T[K]] extends [never] ? K : never}[keyof T],
  undefined
>
