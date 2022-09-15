/** Useful for typechecking, among other things. */
export function identity<T>(input: T): T {
  return input
}

export function infer<T>() {
  return <U extends T>(input: U) => input
}

export interface Converter<T, U, TAlt = never, UAlt = never> {
  forward: (input: T | TAlt) => U
  reverse: (input: U | UAlt) => T
}

export interface AsyncConverter<T, U, TAlt = never, UAlt = never> {
  forward: (input: T | TAlt) => Promise<U>
  reverse: (input: U | UAlt) => Promise<T>
}

export function conv<T, U, TAlt = never, UAlt = never>(
  options: Converter<T, U, TAlt, UAlt> | (() => Converter<T, U, TAlt, UAlt>),
): Converter<T, U, TAlt, UAlt> & Converter<T, U, TAlt, UAlt>['forward'] {
  const getConverter = () =>
    typeof options === 'function' ? options() : options
  const proxy: Converter<T, U, TAlt, UAlt> = {
    forward: (input) => getConverter().forward(input),
    reverse: (input) => getConverter().reverse(input),
  }
  return Object.assign(proxy.forward, proxy)
}

export function asyncConv<T, U, TAlt = never, UAlt = never>(
  options:
    | AsyncConverter<T, U, TAlt, UAlt>
    | (() => AsyncConverter<T, U, TAlt, UAlt>),
): AsyncConverter<T, U, TAlt, UAlt> &
  AsyncConverter<T, U, TAlt, UAlt>['forward'] {
  const getConverter = () =>
    typeof options === 'function' ? options() : options
  const proxy: AsyncConverter<T, U, TAlt, UAlt> = {
    forward: (input) => getConverter().forward(input),
    reverse: (input) => getConverter().reverse(input),
  }
  return Object.assign(proxy.forward, proxy)
}
