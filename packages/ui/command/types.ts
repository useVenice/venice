import type {z} from '@usevenice/util'

import type {IconName} from '../components/Icon'

export type _infer<T, TDefault = unknown> = T extends z.ZodTypeAny
  ? z.infer<T>
  : TDefault

export interface CommandParam {}

export interface _CommandDefinitionInput<
  TCtx = unknown,
  TParams extends z.AnyZodObject = z.AnyZodObject,
  TRet = unknown,
> {
  icon?: IconName
  shortcut?: string
  title?: string
  subtitle?: string
  /** CommandGroup.heading */
  group?: string

  params?: TParams

  execute?: (options: {params: _infer<TParams, {}>; ctx: TCtx}) => TRet
}

export interface CommandDefinitionInput<
  TCtx = unknown,
  TParams extends z.AnyZodObject = z.AnyZodObject,
> extends _CommandDefinitionInput<TCtx, TParams> {
  /** Used for overriding... */
  useCommand?: () => _CommandDefinitionInput<TCtx, TParams>
}

export type CommandDefinitionMap<TCtx = unknown> = Record<
  string,
  CommandDefinitionInput<TCtx>
>
