import * as z from 'zod'
import {R} from './data-utils'

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

export const zTrimedString = z.string().transform((s) => s.trim())

export type JsonObject = z.infer<typeof zJsonObject>
export const zJsonObject = z.record(zJson)

export function zGuard<T, U>(fn: (input: T) => U | Promise<U>) {
  return (out: T, ctx: z.RefinementCtx) => {
    function catchError(err: unknown) {
      if (err instanceof z.ZodError) {
        err.issues.forEach((issue) => ctx.addIssue({...issue, fatal: true}))
      } else {
        ctx.addIssue({code: 'custom', fatal: true, message: `${err}`})
      }
      return err as U // Due to fatal, this will never be used
    }
    try {
      const ret = fn(out)
      return R.isPromise(ret) ? ret.catch(catchError) : ret
    } catch (err) {
      return catchError(err)
    }
  }
}

export function zGuardTransform<ZType extends z.ZodTypeAny, U>(
  fn: (input: z.output<ZType>) => U | Promise<U>,
) {
  return (zType: ZType) => zType.transform(zGuard(fn))
}

export function zRefineNonNull<ZType extends z.ZodTypeAny>(zType: ZType) {
  return zType.superRefine((input) => !!input).transform((input) => input)
}

/**
 * e.g. `schema.transform(cast<TOut>())
 * Useful as a casting typeguard
 * HOC because prettier doesn't understand how to format... https://share.cleanshot.com/vfED5U
 * and it is also tricky in ts to declare
 *
 */
// prettier-ignore
export const cast = <T>() => (_input: unknown) => _input as T

// prettier-ignore
/** `schema.refine(castIs<TOut>)` */
export const castIs = <T>() =>(_input: unknown): _input is T => true

/** `zCast<TOut>()` standalone */
export const zCast = <T>(...args: Parameters<typeof z['unknown']>) =>
  z.unknown(...args).refine(castIs<T>())

/** `castInput(schema)<TInput>()` */
export const castInput =
  <T extends z.ZodTypeAny>(schema: T) =>
  <TInput extends T['_input']>() =>
    schema as z.ZodType<T['_output'], z.ZodTypeDef, TInput>

export function isZodType(input: unknown): input is z.ZodTypeAny {
  const obj = input as z.ZodTypeAny
  return typeof obj === 'object' && typeof obj._def === 'object'
}

/** Not secure because we could leak secrets to logs */
export function zodInsecureDebug() {
  z.setErrorMap((_issue, ctx) => {
    // Need to get the `schema` as well.. otherwise very hard to debug
    // which part is failing because we use Zod for almost everything...
    console.error('[zod] Data did not pass validation', {
      data: ctx.data,
      issue: _issue,
    })
    return {message: ctx.defaultError}
  })
}
