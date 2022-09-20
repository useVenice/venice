import * as ToastPrimitive from '@radix-ui/react-toast'
import {useControllableState} from '@radix-ui/react-use-controllable-state'
import {
  useMeasure,
  useMountEffect,
  useUnmountEffect,
  useUpdateEffect,
} from '@react-hookz/web'
import {motion} from 'framer-motion'
import {useAtom} from 'jotai'
import {atomWithReducer} from 'jotai/utils'
import {nanoid} from 'nanoid'
import React from 'react'
import {twMerge} from 'tailwind-merge'

export const ToastProvider = ToastPrimitive.Provider
export const ToastViewport = ToastPrimitive.Viewport
export const ToastTitle = ToastPrimitive.Title
export const ToastAction = ToastPrimitive.Action
export const ToastClose = ToastPrimitive.Close

interface Toast {
  key: string
  index: number
  height?: number
}

type ToastsAtomAction =
  | {
      type: 'add'
      key: string
    }
  | {
      type: 'setHeight'
      key: string
      height: number
    }
  | {
      type: 'delete'
      key: string
    }

const toastsAtom = atomWithReducer<Toast[], ToastsAtomAction>(
  [],
  (prev, action) => {
    switch (action?.type) {
      case 'add':
        return [...prev, {key: action.key, index: prev.length}]
      case 'setHeight':
        const ret: Toast[] = []
        for (const t of prev) {
          ret.push({
            ...t,
            ...(t.key === action.key && {
              height: action.height,
            }),
          })
        }
        return ret
      case 'delete': {
        const ret: Toast[] = []
        for (const t of prev) {
          if (t.key === action.key) {
            continue
          }
          ret.push({...t, index: ret.length})
        }
        return ret
      }
    }
    return prev
  },
)

export interface ToastProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
    'title'
  > {
  title?: React.ReactNode
  description: React.ReactNode
  actions?: React.ReactNode
  duration?: number
}

export function Toast({
  className,
  title,
  description,
  actions,
  duration = 4000,
  open: openProp,
  defaultOpen: defaultOpenProp,
  onOpenChange,
  ...restProps
}: ToastProps) {
  const [open = true, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpenProp,
    onChange: onOpenChange,
  })
  const [toasts, dispatch] = useAtom(toastsAtom)
  const [key] = React.useState(() => nanoid())
  const [rect, ref] = useMeasure<HTMLLIElement>()
  const offset = React.useMemo(() => {
    let ret = 0
    const index =
      toasts.find((t) => t.key === key)?.index ?? Number.POSITIVE_INFINITY
    for (const t of toasts) {
      if (t.index < index) {
        ret += (t.height ?? 0) + TOAST_GAP
      }
    }
    return ret
  }, [key, toasts])
  useMountEffect(() => dispatch({type: 'add', key}))
  useUpdateEffect(
    () => {
      if (rect) {
        dispatch({type: 'setHeight', key, height: rect.height})
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rect],
  )
  useUpdateEffect(
    () => {
      if (!open) {
        setTimeout(
          () => dispatch({type: 'delete', key}),
          SWIPE_END_ANIMATION_DURATION_MS,
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open],
  )
  useUnmountEffect(() => dispatch({type: 'delete', key}))
  return (
    <ToastPrimitive.Root
      asChild
      ref={ref}
      duration={duration}
      className={twMerge(
        'fixed inset-x-4 bottom-4 z-[100] w-auto rounded-lg bg-white shadow-lg md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm',
        'radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right',
        'radix-state-closed:animate-toast-hide',
        'radix-swipe-end:animate-toast-swipe-out',
        'translate-x-radix-toast-swipe-move-x',
        'radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]',
        'focus:outline-none focus-visible:ring focus-visible:ring-primary/75',
        className,
      )}
      open={open}
      onOpenChange={setOpen}
      {...restProps}>
      <motion.div style={{top: offset + 16}} transition={{type: 'spring'}}>
        <div className="flex">
          <div className="flex w-0 flex-1 items-center py-4 pl-5">
            <div className="flex w-full flex-col space-y-1">
              {!!title && (
                <ToastPrimitive.Title className="text-sm font-medium text-gray-900">
                  {title}
                </ToastPrimitive.Title>
              )}

              {!!description && (
                <ToastPrimitive.Description className="text-sm text-gray-700">
                  {description}
                </ToastPrimitive.Description>
              )}
            </div>
          </div>

          {actions && (
            <div className="flex">
              <div className="flex flex-col space-y-1 px-3 py-2">{actions}</div>
            </div>
          )}
        </div>
      </motion.div>
    </ToastPrimitive.Root>
  )
}

const TOAST_GAP = 16
const SWIPE_END_ANIMATION_DURATION_MS = 100
