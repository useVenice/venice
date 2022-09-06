import {useUpdateEffect} from '@react-hookz/web'
import * as DialogPrimitive from 'ariakit/dialog'
import {X} from 'phosphor-react'
import React from 'react'
import {twMerge} from 'tailwind-merge'

export interface DialogProps
  extends Omit<React.ComponentProps<typeof DialogPrimitive.Dialog>, 'state'> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (newOpen: boolean) => void
}

export interface DialogInstance extends DialogPrimitive.DialogState {}

export const Dialog = React.forwardRef(function Dialog(
  {
    open,
    defaultOpen,
    onOpenChange,
    backdropProps: {className: backdropClassName, ...backdropProps} = {},
    children,
    ...restProps
  }: DialogProps,
  ref: React.ForwardedRef<DialogInstance>,
) {
  const dialog = DialogPrimitive.useDialogState({
    open,
    defaultOpen,
  })
  React.useImperativeHandle(ref, (): DialogInstance => dialog)
  useUpdateEffect(
    () => {
      if (!dialog.animating) {
        onOpenChange?.(dialog.open)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dialog.animating, dialog.open],
  )
  return (
    <DialogPrimitive.Dialog
      backdropProps={{
        className: twMerge('bg-black/10', backdropClassName),
        ...backdropProps,
      }}
      state={dialog}
      {...restProps}>
      <div className="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-full max-w-[min(100vw,30rem)] -translate-y-1/2 -translate-x-1/2 flex-col space-y-4 overflow-y-auto rounded border bg-white p-4">
        <header>
          <DialogPrimitive.DialogDismiss className="btn btn-ghost btn-sm btn-circle">
            <X />
          </DialogPrimitive.DialogDismiss>
        </header>

        {children}
      </div>
    </DialogPrimitive.Dialog>
  )
})
