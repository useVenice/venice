// codegen:start {preset: barrel, include: "./{*.{ts,tsx},*/index.{ts,tsx}}", exclude: "./**/*.{spec,test,fixture,d}.{ts,tsx}"}
export * from './PathsOf'
// codegen:end

// TODO: Move these into a proper util package

/** This will break for all the `unknown` unfortunately. But it is desired to remove `[k: string]: unknown` */
export type StrictKeyOf<T> = keyof {
  [k in keyof T as unknown extends T[k] ? never : k]: never
}
export type StrictObj<T> = Pick<
  T,
  StrictKeyOf<T> extends keyof T ? StrictKeyOf<T> : never
>

// TODO: Gotta fix this to work with PathsOf aka nested keys
// Also move this into a separate types package
export type ExtractKeyOfValueType<T, V> = Extract<
  keyof {
    [k in keyof T as T[k] extends V ? k : never]: T[k]
  },
  string
>
