export function debugMe<T>(input: T) {
  console.warn('[debugMe]', JSON.stringify(input, null, 2))
  return input
}
;(globalThis as any).debugMe = debugMe

declare global {
  interface Window {
    debugMe: typeof debugMe
  }
}
