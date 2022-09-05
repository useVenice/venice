import type {AnyEntityPayload, Link, SyncOperation} from './protocol'
import type {WritableDraft} from '@ledger-sync/util'
import {compact, produce, R, Rx, rxjs} from '@ledger-sync/util'

type Data = AnyEntityPayload
type OperationType = SyncOperation['type']
type Handlers<T extends Data> = Partial<{
  [k in OperationType]: (
    op: Extract<SyncOperation<T>, {type: k}>,
  ) => rxjs.ObservableInput<SyncOperation<T>> | void
}>

/** If handler returns void, we will return rxjs.EMPTY. Uses concatMap to respect input order */
export function handlersLink<T extends Data>(handlers: Handlers<T>) {
  // Order is important by default. mergeMap would result in `ready` being fired before
  // file has been written to disk as an example. Use mergeMap only if perf or a special
  // reason justifies it and order doesn't matter
  return Rx.concatMap((op: SyncOperation<T>) =>
    R.pipe(handlers[op.type], (h) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      h ? h(op as any) ?? rxjs.EMPTY : rxjs.of(op),
    ),
  )
}
export const transformLink = <T extends Data>(
  transform: (op: WritableDraft<SyncOperation<T>>) => SyncOperation<T> | void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Link<T> => Rx.map((op) => produce(op, transform as any))

export const logLink = <T extends Data>(
  opts: {prefix?: string; verbose?: boolean | number} = {},
): Link<T> => {
  let i = 0
  return Rx.tap((op) => {
    console.log(
      compact([
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

export const mergeReady = <T extends AnyEntityPayload>(
  len: number,
): Link<T> => {
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
