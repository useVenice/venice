export function mapNullable<T, U>(fn: (x: T) => U, x: T | null | undefined) {
  return x ? fn(x) : null
}
