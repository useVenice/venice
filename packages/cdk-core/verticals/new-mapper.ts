/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {
  AnyProcedure,
  AnyRouter,
  inferProcedureInput,
  inferProcedureOutput,
  MaybePromise,
} from '@trpc/server'
import {TRPCError} from '@trpc/server'

import {z} from '@usevenice/util'

// FIXME: This is explicitly bypassing the package system because we have a circular
// dependency here which is not great but ....
import type {
  remoteProcedure,
  RemoteProcedureContext,
  RouterMeta,
  trpc,
} from '../../engine-backend/router/_base'

export type RouterMap<TRouter extends AnyRouter, TOpts = {}> = {
  [k in keyof TRouter as TRouter[k] extends AnyProcedure
    ? k
    : never]?: TRouter[k] extends AnyProcedure
    ? (
        opts: {input: inferProcedureInput<TRouter[k]>} & TOpts,
      ) => MaybePromise<inferProcedureOutput<TRouter[k]>>
    : never
}

export interface VerticalRouterOpts {
  trpc: typeof trpc
  remoteProcedure: typeof remoteProcedure
}

export async function proxyCallRemote(opts: {
  input: unknown
  ctx: RemoteProcedureContext
}) {
  const meta = (opts as any).meta as RouterMeta

  const {input, ctx} = opts
  const instance = ctx.remote.provider.newInstance?.({
    config: ctx.remote.config,
    settings: ctx.remote.settings,
  })
  const implementation = (
    ctx.remote.provider.verticals?.[meta.response?.vertical!] as any
  )?.[(opts as any).path] as Function
  if (typeof implementation !== 'function') {
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: `${ctx.remote.providerName} does not implement ${ctx.path}`,
    })
  }

  const res = await implementation({input, instance})

  if (meta.response?.type === 'list') {
    const mapper = (ctx.remote.provider.mappers?.accounting as any)[
      meta.response?.entity
    ] as (entity: unknown, settings: unknown) => any

    return {
      ...res,
      items: (res as PaginatedOutput<any>).items.map((item) => ({
        ...mapper(item, ctx.remote.settings),
        _original: item,
      })),
    }
  }
  return res
}
export const zPaginationParams = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
})
export type Pagination = z.infer<typeof zPaginationParams>

export type PaginatedOutput<T extends {}> = z.infer<
  ReturnType<typeof paginatedOutput<z.ZodObject<any, any, any, T>>>
>
export function paginatedOutput<ItemType extends z.AnyZodObject>(
  itemSchema: ItemType,
) {
  return z.object({
    hasNextPage: z.boolean(),
    items: z.array(itemSchema.extend({_original: z.unknown()})),
  })
}

type ExtractKeyOfValueType<T, V> = Extract<
  keyof {
    [k in keyof T as T[k] extends V ? k : never]: T[k]
  },
  string
>

interface Getter<T extends string> {
  keypath: T
}
export const get = <T extends string>(keypath: T): Getter<T> => ({keypath})

export function mapper<
  ZInputSchema extends z.ZodTypeAny,
  ZOutputSchema extends z.ZodTypeAny,
  TOut extends z.infer<ZOutputSchema> = z.infer<ZOutputSchema>,
  TIn extends z.infer<ZInputSchema> = z.infer<ZInputSchema>,
>(
  zExt: ZInputSchema,
  zCom: ZOutputSchema,
  mapping: {
    [k in keyof TOut]:
      | TOut[k] // Constant
      | Getter<ExtractKeyOfValueType<TIn, TOut[k]>>
      | ((ext: TIn) => TOut[k])
  },
) {
  return {
    inputSchema: zCom,
    outputSchema: zExt,
    mapping,
  }
}
