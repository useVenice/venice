import type {
  JsonLiteral,
  JsonObject,
  MergeUnion,
  NoInfer,
  ObjectPartialDeep,
  rxjs,
} from '@ledger-sync/util'

// Consider removing this... Cuz frankly we don't need it...
// TODO: Bad imports are not throwing issue. We should fix that
// Maybe checklibs?
import type {Id} from './id.types'
import type {EnvName} from './meta.types'

/**
 * This will be standardized over time into either
 * [Airbyte protocol](https://docs.airbyte.com/understanding-airbyte/airbyte-protocol/)
 * or the [Singer spec](https://hub.meltano.com/singer/spec) [Orig spec](https://github.com/singer-io/getting-started/blob/master/docs/SPEC.md#singer-specification)
 *
 */

/**
 * TODO: We should add a `change` type here, as `null` could also be a valid value
 * Actually, in the simplest form we should just have a [id, data] without even
 * any entity name. This can get transformed to [id, entityName, changeType, entity] as needed.
 */
export interface AnyEntityPayload {
  // typename: string
  entityName: string
  id: string
  entity: object | JsonLiteral | null // Record<string, unknown> doesn't work with normal ts interfaces...
}
type Data = AnyEntityPayload
type NullableEntity<T> = T extends Data
  ? {[k in keyof T]: k extends 'entity' ? T[k] | null : T[k]}
  : T

export type SyncOperation<
  TData extends Data = Data,
  TSettings = JsonObject,
  TSrcSyncOptions = JsonObject,
  TDestSyncOptions = JsonObject,
> =
  | {
      type: 'connUpdate'
      // TODO: Consider merging all the fields below into a single field
      id: Id['conn']
      settings?: ObjectPartialDeep<NoInfer<TSettings>>
      institutionId?: Id['ins']
      // TODO: Consider if these fields should actually exist on the operation itself
      integrationId?: Id['int']
      ledgerId?: Id['ldgr']
      envName?: EnvName
    }
  | {
      type: 'stateUpdate'
      // TODO: We should separate state from options, and perhaps make state
      // less black box also, see airbyte protocol v2 for inspiration
      // Also consider merging fields below into a single field
      sourceSyncOptions?: ObjectPartialDeep<NoInfer<TSrcSyncOptions>>
      destinationSyncOptions?: ObjectPartialDeep<NoInfer<TDestSyncOptions>>
    }
  | {type: 'data'; data: NullableEntity<TData>} // Rename entityName to `stream` and lift to top level?
  | {type: 'commit'} // Do we still need this if we have separate `stateUpdate` message?
  | {type: 'ready'}

export type AnySyncOperation = MergeUnion<SyncOperation>

export type Source<T extends Data> = rxjs.Observable<SyncOperation<T>>

/**
 * Adapted from TRPC link and Apollo Link
 * A specialized version of rxjs.OperatorFucntion. Often times stateful.
 */
export type Link<DataIn extends Data = Data, DataOut extends Data = DataIn> = (
  obs: rxjs.Observable<SyncOperation<DataIn>>,
) => rxjs.Observable<SyncOperation<DataOut>>
/**
 * Terminating link is just a link... It can still emit things like ready event
 * for the engine to listen to. The resulting event may not be the same as the input events
 */
export type Destination<T extends Data = Data> = Link<T, AnyEntityPayload>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkFactory<TArg = any> = (arg: TArg) => Link<any, any>
