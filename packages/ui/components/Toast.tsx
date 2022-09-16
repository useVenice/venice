import * as ToastPrimitive from '@radix-ui/react-toast'
import React from 'react'
import {twMerge} from 'tailwind-merge'

export const ToastProvider = ToastPrimitive.Provider
export const ToastViewport = ToastPrimitive.Viewport
export const ToastTitle = ToastPrimitive.Title
export const ToastAction = ToastPrimitive.Action
export const ToastClose = ToastPrimitive.Close

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
  ...restProps
}: ToastProps) {
  return (
    <ToastPrimitive.Root
      duration={duration}
      className={twMerge(
        'fixed inset-x-4 bottom-4 z-50 w-auto rounded-lg bg-white shadow-lg md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm',
        'radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right',
        'radix-state-closed:animate-toast-hide',
        'radix-swipe-end:animate-toast-swipe-out',
        'translate-x-radix-toast-swipe-move-x',
        'radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]',
        'focus:outline-none focus-visible:ring focus-visible:ring-primary/75',
        className,
      )}
      {...restProps}>
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
    </ToastPrimitive.Root>
  )
}
