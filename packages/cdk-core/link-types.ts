import {
  identity,
  JsonLiteral,
  JsonObject,
  MergeUnion,
  NoInfer,
  ObjectPartialDeep,
  Rx,
  rxjs,
  toCompletion,
  zCast
} from '@ledger-sync/util'

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
  | {type: 'init'}
  // aka meta? Or should metaUpdate be `data` also?
  | {
      type: 'metaUpdate'
      /**
       * Should be specific that this is the `connectionId`
       * How do we persist settings / options updates if no ids are part of the input?
       * Or should that just be not supported?
       */
      id: string
      settings?: ObjectPartialDeep<NoInfer<TSettings>>
      /** This may be either the sourceOptions or destinationOptions */
      sourceSyncOptions?: ObjectPartialDeep<NoInfer<TSrcSyncOptions>>
      destinationSyncOptions?: ObjectPartialDeep<NoInfer<TDestSyncOptions>>
    }
  | {type: 'data'; data: NullableEntity<TData>}
  | {type: 'commit'}
  | {type: 'ready'}
  | {type: 'close'}

export type AnySyncOperation = MergeUnion<SyncOperation>

export type Source<T extends Data> = rxjs.Observable<SyncOperation<T>>
export const zSource = zCast<Source<AnyEntityPayload>>() // Make me better...

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
export const zDestination = zCast<Destination>() // Make me better...

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkFactory<TArg = any> = (arg: TArg) => Link<any, any>

export async function sync<T extends Data = Data>(input: {
  source: Source<T>
  links: Array<Link<T, T>> | undefined
  destination: Destination<T>
  watch: boolean | undefined
}) {
  const start = Date.now()
  let count = 0
  let ready = false
  await toCompletion(
    // Raw Source, may come from fs, firestore or postgres
    input.source
      // Plugins
      .pipe(...((input.links ?? []) as [Link<T>, Link<T>]))
      // Destination
      .pipe(input.destination)
      // Progress & flow controlß
      .pipe(!input.watch ? Rx.takeWhile((e) => e.type !== 'ready') : identity),
    (e) => {
      count++
      if (ready) {
        console.warn(`#${count}: Event received after ready`, e)
      }
      if (!e) {
        console.log(`#${count}: Bad event`, e)
      } else if (e.type === 'ready') {
        console.log(`#${count}: Ready in ${Date.now() - start}ms`)
        ready = true
      } else if (e.type === 'data') {
        console.log(`#${count}: ${e.data.id} exists=${e.data.entity != null}`)
      } else {
        console.log(`#${count}: Received ${e.type} ${Date.now() - start}ms`)
      }
    },
  )
  console.log(`Sync complete, should exit unless we have open handles`)
}
