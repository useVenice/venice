/**
 * @see https://medium.com/@gcanti/slaying-a-ui-antipattern-with-flow-5eed0cfb627b
 */
export type AsyncResult<E, D> =
  | {
      status: 'initial'
      data?: never
      error?: never
    }
  | {
      status: 'loading'
      data?: never
      error?: never
    }
  | {
      status: 'failure'
      data?: never
      error: E
    }
  | {
      status: 'success'
      data: D
      error?: never
    }

// MARK: Constructors

export const initial: AsyncResult<never, never> = {status: 'initial'}

export const loading: AsyncResult<never, never> = {status: 'loading'}

export function failure<E>(error: E): AsyncResult<E, never> {
  return {status: 'failure', error}
}

export function success<D>(data: D): AsyncResult<never, D> {
  return {status: 'success', data}
}
