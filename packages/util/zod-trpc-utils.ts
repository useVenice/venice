/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as R from 'remeda'
import {z} from 'zod'

import type {AnyRouter} from '@trpc/server'
import {initTRPC} from '@trpc/server'

import type {AnyZFunction, ZFunction} from './zod-function-utils'

/* eslint-disable @typescript-eslint/no-explicit-any */
type _AnyZFunction = ZFunction<any, any>
export type ZFunctionMap = Record<string, _AnyZFunction | unknown>

export function routerFromZFunctionMap<TMap extends ZFunctionMap>(
  functionMap: TMap,
): AnyRouter {
  const trpcServer = initTRPC.create()
  return trpcServer.router(
    R.pipe(
      functionMap as Record<string, AnyZFunction>,
      // Protected against non zFunction being part of the zFunction map so we do not crash...
      R.omitBy((fn) => !fn.impl),
      R.mapValues((fn) =>
        trpcServer.procedure
          .input(preprocessArgsTuple(fn.parameters))
          .output(fn.returnType)
          .mutation(({input}) => fn.impl(...input)),
      ),
    ),
  )
}

export function preprocessArgsTuple<
  T extends z.ZodTuple<[z.ZodTypeAny, ...z.ZodTypeAny[]] | []>,
>(schema: T) {
  return z.preprocess((i) => {
    const ret = R.pipe(Array.isArray(i) ? i : [i], (arr) => [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ...arr.slice(0, schema.items.length),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ...new Array(Math.max(schema.items.length - arr.length, 0)),
    ])
    // console.log('Preprocessed', ret)
    return ret
  }, schema)
}
