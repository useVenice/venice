/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {
  AnyProcedure,
  AnyRouter,
  inferProcedureInput,
  inferProcedureOutput,
  MaybePromise,
} from '@trpc/server'
import {TRPCError} from '@trpc/server'
import type {PathsOf} from 'packages/util'
import {R} from 'packages/util'
import {z} from '@usevenice/zod'
// FIXME: This is explicitly bypassing the package system because we have a circular
// dependency here which is not great but ....
import type {
  remoteProcedure,
  RemoteProcedureContext,
  trpc,
} from '../../packages/engine-backend/router/_base'

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

export async function proxyListRemoteRedux({
  input,
  ctx,
  meta: {entityName, vertical},
}: {
  input: unknown
  ctx: RemoteProcedureContext
  meta: {vertical: string; entityName: string}
}) {
  const instance = ctx.remote.connector.newInstance?.({
    config: ctx.remote.config,
    settings: ctx.remote.settings,
    onSettingsChange: (settings) =>
      ctx.services.metaLinks.patch('resource', ctx.remote.id, {settings}),
  })
  const implementation = (
    ctx.remote.connector.verticals?.[vertical as never] as any
  )?.list as Function
  if (typeof implementation !== 'function') {
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: `${ctx.remote.connectorName} does not implement ${ctx.path}`,
    })
  }

  const res: PaginatedOutput<any> = await implementation(
    instance,
    entityName,
    input,
  )

  const mapper = (ctx.remote.connector.streams?.[vertical as never] as any)[
    entityName
  ] as (entity: unknown, settings: unknown) => any

  return {
    ...res,
    items: res.items.map((item) => ({
      ...mapper(item, ctx.remote.settings),
      _original: item,
    })),
  }
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

export const literal = <T>(literal: T) => ({literal})

export function mapper<
  ZInputSchema extends z.ZodTypeAny,
  ZOutputSchema extends z.ZodTypeAny,
  TOut extends z.infer<ZOutputSchema> = z.infer<ZOutputSchema>,
  TIn extends z.infer<ZInputSchema> = z.infer<ZInputSchema>,
>(
  zExt: ZInputSchema,
  zCom: ZOutputSchema,
  mapping: {
    [k in keyof TOut]:  // | ExtractKeyOfValueType<TIn, TOut[k]> // | Getter<ExtractKeyOfValueType<TIn, TOut[k]>> // | TOut[k] // Constant
      | PathsOf<TIn> // Getter for the keypaths
      | ReturnType<typeof literal<TOut[k]>> // literal value
      | ((ext: TIn) => TOut[k]) // Function that can do whatever
  },
) {
  return {
    _in: undefined as TIn,
    _out: undefined as TOut,
    inputSchema: zCom,
    outputSchema: zExt,
    mapping,
  }
}

export function applyMapper<T extends ReturnType<typeof mapper>>(
  mapper: T,
  input: T['_in'],
): T['_out'] {
  // This can probably be extracted into its own function without needint TIn and TOut even
  return R.mapValues(mapper.mapping, (m, key) => {
    if (typeof m === 'function') {
      return m(input)
    } else if (typeof m === 'object' && 'literal' in m) {
      return m.literal
    } else if (typeof m === 'string') {
      return getValueAtKeyPath(input, m)
    }
    throw new Error(`Invalid mapping ${m as unknown} at ${key as string}`)
  })
}

/**
 * https://dev.to/pffigueiredo/typescript-utility-keyof-nested-object-2pa3
 * We could probbaly use R.pathOr... but it is too well-typed for our needs 🤣
 */
function getValueAtKeyPath(object: unknown, path: string) {
  const keys = path.split('.')
  let result = object
  for (const key of keys) {
    if (typeof result !== 'object') {
      throw new TypeError(
        `Cannot get value at keypath ${path} from non-object ${object}`,
      )
    }
    result = (result as Record<string, unknown>)[key]
  }
  return result
}

// MARK: - Deprecated

// TODO: Gotta fix this to work with PathsOf aka nested keys
// Also move this into a separate types package
export type ExtractKeyOfValueType<T, V> = Extract<
  keyof {
    [k in keyof T as T[k] extends V ? k : never]: T[k]
  },
  string
>
