export function debugMe<T>(input: T) {
  console.warn('[debugMe]', JSON.stringify(input, null, 2))
  return input
}
;(global as any).debugMe = debugMe
