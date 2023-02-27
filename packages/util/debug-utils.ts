export function debugMe<T>(input: T) {
  console.warn('[debugMe]', JSON.stringify(input, null, 2))
  return input
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
;(globalThis as any).debugMe = debugMe

declare global {
  interface Window {
    debugMe: typeof debugMe
  }
}

export {default as invariant} from 'tiny-invariant'
