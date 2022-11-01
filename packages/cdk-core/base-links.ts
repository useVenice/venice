import type {WritableDraft} from '@usevenice/util'
import {produce, R, Rx, rxjs} from '@usevenice/util'

import type {
  AnyEntityPayload,
  ConnUpdateData,
  Link,
  StateUpdateData,
  SyncOperation,
} from './protocol'

type Data = AnyEntityPayload
type OperationType = SyncOperation['type']
export type OpHandlers<
  TRet,
  T extends Data = Data,
  TConnUpdate extends object = ConnUpdateData,
  TStateUpdate extends object = StateUpdateData,
> = Partial<{
  [k in OperationType]: (
    op: Extract<SyncOperation<T, TConnUpdate, TStateUpdate>, {type: k}>,
  ) => TRet
}>

/**
 * If handler returns void, we will return rxjs.EMPTY. Uses concatMap to respect input order
 * Consider using zod for runtime typechecking here
 */
export function handlersLink<
  TData extends Data,
  TConnUpdate extends object = ConnUpdateData,
  TStateUpdate extends object = StateUpdateData,
>(
  handlers: OpHandlers<
    rxjs.ObservableInput<SyncOperation<TData>> | void,
    TData,
    TConnUpdate,
    TStateUpdate
  >,
): Link<TData> {
  // Order is important by default. mergeMap would result in `ready` being fired before
  // file has been written to disk as an example. Use mergeMap only if perf or a special
  // reason justifies it and order doesn't matter
  return Rx.concatMap((op) =>
    R.pipe(handlers[op.type], (h) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      h ? h(op as any) ?? rxjs.EMPTY : rxjs.of(op),
    ),
  )
}
export function transformLink<T extends Data>(
  transform: (op: WritableDraft<SyncOperation<T>>) => SyncOperation<T> | void,
): Link<T> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  return Rx.map((op) => produce(op, transform as any))
}

export function logLink<T extends Data>(
  opts: {prefix?: string; verbose?: boolean | number} = {},
): Link<T> {
  let i = 0
  return Rx.tap((op) => {
    console.log(
      R.compact([
        `[logLink #${i}]`,
        opts.prefix && `${opts.prefix}:`,
        `type=${op.type}`,
        op.type === 'data' && `entityId=${op.data.id}`,
      ]).join(' '),
    )
    if (opts.verbose !== undefined) {
      console.dir(op, {
        depth: typeof opts.verbose === 'number' ? opts.verbose : null,
      })
    }
    i++
  })
}

export function mergeReady<T extends AnyEntityPayload>(len: number): Link<T> {
  let i = 0
  return Rx.mergeMap((op) => {
    if (op.type === 'ready') {
      i++
      if (i < len) {
        return rxjs.EMPTY
      } else if (i > len) {
        // Should never happen, but...
        throw new Error('Duplicate ready events detected')
      } else {
        console.log(`[mergeReady] Overall ready from ${len} systems`)
      }
    }
    return rxjs.of(op)
  })
}
