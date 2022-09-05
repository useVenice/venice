import * as z from 'zod'

export {z}

export function parseIf<T>(value: unknown, typeguard: (v: unknown) => v is T) {
  return typeguard(value) ? value : undefined
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value != null
}

export type JsonLiteral = z.infer<typeof zLiteral>
export const zLiteral = z.union([z.string(), z.number(), z.boolean(), z.null()])

export type Json = JsonLiteral | {[key: string]: Json} | Json[]
export const zJson: z.ZodType<Json> = z.lazy(() =>
  z.union([zLiteral, z.array(zJson), z.record(zJson)]),
)

export type JsonObject = z.infer<typeof zJsonObject>
export const zJsonObject = z.record(zJson)

export function zGuard<T, U>(fn: (input: T) => U | Promise<U>) {
  return async (out: T, ctx: z.RefinementCtx) => {
    try {
      return await fn(out)
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.issues.forEach((issue) => ctx.addIssue({...issue, fatal: true}))
      } else {
        ctx.addIssue({code: 'custom', fatal: true, message: `${err}`})
      }
      return err as U // Due to fatal, this will never be used
    }
  }
}

export function zGuardTransform<ZType extends z.ZodTypeAny, U>(
  fn: (input: z.output<ZType>) => U | Promise<U>,
) {
  return (zType: ZType) => zType.transform(zGuard(fn))
}

export function zRefineNonNull<ZType extends z.ZodTypeAny>(zType: ZType) {
  return zType
    .superRefine((input) => !!input)
    .transform((input) => input as NonNullable<typeof input>)
}

/**
 * Useful as a casting typeguard
 * HOC because prettier doesn't understand how to format... https://share.cleanshot.com/vfED5U
 * and it is also tricky in ts to declare
 *
 */
// prettier-ignore
export const cast = <T>() => (_input: unknown) => _input as T
// prettier-ignore
export const castIs = <T>() =>(_input: unknown): _input is T => true

export const zCast = <T>(...args: Parameters<typeof z['unknown']>) =>
  z.unknown(...args).refine(castIs<T>())

export function isZodType(input: unknown): input is z.ZodTypeAny {
  const obj = input as z.ZodTypeAny
  return typeof obj === 'object' && typeof obj._def === 'object'
}

/** Not secure because we could leak secrets to logs */
export function zodInsecureDebug() {
  z.setErrorMap((_issue, ctx) => {
    // Need to get the `schema` as well.. otherwise very hard
    console.error('[zod] Data did not pass validation', {
      data: ctx.data,
      issue: _issue,
    })
    return {message: ctx.defaultError}
  })
}
