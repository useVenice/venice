/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-return */
import type {
  CreateProcedureWithInputOutputParser,
  inferProcedureFromOptions,
} from '@trpc/server/dist/declarations/src/internals/procedure'
import type {
  ProcedureRecord,
  Router,
} from '@trpc/server/dist/declarations/src/router'
import type {TRPCErrorShape} from '@trpc/server/dist/declarations/src/rpc'
import type {Subscription} from '@trpc/server/dist/declarations/src/subscription'
import {z} from 'zod'

import {R} from './data-utils'
import type {PickRequiredKeys} from './type-utils'
import type {AnyZFunction, ZFunction} from './zod-function-utils'
import {isZFunction} from './zod-function-utils'

/* eslint-disable @typescript-eslint/no-explicit-any */
type _AnyZFunction = ZFunction<any, any>
export type ZFunctionMap = Record<string, _AnyZFunction | unknown>

type ProcedureRecordFromZMap<
  TInputContext,
  TContext,
  TMeta extends Record<string, any>,
  TMap extends ZFunctionMap,
> = PickRequiredKeys<{
  [k in keyof TMap]: TMap[k] extends _AnyZFunction
    ? inferProcedureFromOptions<
        TInputContext,
        CreateProcedureWithInputOutputParser<
          TContext,
          TMeta,
          TMap[k]['parameters']['_input'],
          TMap[k]['parameters']['_output'],
          TMap[k]['returnType']['_input'],
          TMap[k]['returnType']['_output']
        >
      >
    : undefined
}>

type AnyProcedureRecord<TInputContext, TContext, TParsedInput> =
  ProcedureRecord<TInputContext, TContext, any, any, TParsedInput>

export function routerFromZFunctionMap<
  TInputContext,
  TContext,
  TMeta extends Record<string, any>,
  TQueries extends AnyProcedureRecord<TInputContext, TContext, any>,
  TMutations extends AnyProcedureRecord<TInputContext, TContext, any>,
  TSubscriptions extends AnyProcedureRecord<
    TInputContext,
    TContext,
    Subscription
  >,
  TErrorShape extends TRPCErrorShape<number>,
  TMap extends ZFunctionMap,
>(
  inputRouter: Router<
    TInputContext,
    TContext,
    TMeta,
    TQueries,
    TMutations,
    TSubscriptions,
    TErrorShape
  >,
  functionMap: TMap,
): Router<
  TInputContext,
  TContext,
  TMeta,
  TQueries & ProcedureRecordFromZMap<TInputContext, TContext, TMeta, TMap>,
  TMutations & ProcedureRecordFromZMap<TInputContext, TContext, TMeta, TMap>,
  TSubscriptions,
  TErrorShape
> {
  return R.pipe(
    functionMap,
    R.toPairs,
    R.filter((pair): pair is [string, AnyZFunction] => isZFunction(pair[1])),
    R.flatMap(([name, fn]) =>
      (['query', 'mutation'] as const).map((m) => [m, name, fn] as const),
    ),
    R.reduce(
      (router, [method, name, fn]) =>
        // query and mutation have compatible inputs but typechecker doesn't know it https://share.cleanshot.com/if9Avt
        // Mutation is generally the right type, but query is easier to use https://github.com/trpc/trpc/discussions/1638
        // So we will support both by default
        router[method as 'query'](name, {
          // Better to handle pre-processing here given that router input can come from anywhere
          // Whether cli or http request and it is hard to control. However fn parameters
          // are always going to be arrays, so let's pre-process
          // Need to think about whether it makes sense to keep the logic inside cliFromRouter
          input: z.preprocess((i) => {
            const input = R.pipe(Array.isArray(i) ? i : [i], (arr) => [
              ...arr,
              ...new Array(
                Math.max(fn.parameters.items.length - arr.length, 0),
              ),
            ])
            console.log(`[${method}] preprocessed input`, input)
            return input
          }, fn.parameters),
          output: fn.returnType,
          resolve: ({input}) => fn.impl(...input),
        }),
      inputRouter,
    ),
  ) as any
}
