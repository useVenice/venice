import * as DialogPrimitive from '@radix-ui/react-dialog'
import {Transition} from '@headlessui/react'
import {useMeasure, useUpdateEffect} from '@react-hookz/web'
import {motion, useAnimation} from 'framer-motion'
import React from 'react'
import {twMerge} from 'tailwind-merge'

export interface AnimatedDialogProps extends DialogPrimitive.DialogProps {}

export interface AnimatedDialogInstance {
  open: () => void
  close: () => void
}

// TODO: Figure out if we need both this and the other dialog
export const AnimatedDialog = React.forwardRef(function Dialog(
  {
    open: initialOpen = false,
    onOpenChange,
    children,
    ...restProps
  }: AnimatedDialogProps,
  ref: React.ForwardedRef<AnimatedDialogInstance>,
) {
  const [open, setOpen] = React.useState(initialOpen)
  useUpdateEffect(() => setOpen(initialOpen), [initialOpen])
  React.useImperativeHandle(
    ref,
    (): AnimatedDialogInstance => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [],
  )

  const controls = useAnimation()
  const [rect, contentRef] = useMeasure()
  useUpdateEffect(() => {
    if (rect?.height) {
      void controls.start({
        height: rect.height,
        transition: {
          type: 'spring',
          stiffness: 550,
          damping: 40,
          restSpeed: 10,
        },
      })
    }
  }, [controls, rect?.height])

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        onOpenChange?.(newOpen)
      }}
      {...restProps}>
      <Transition.Root show={open}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <DialogPrimitive.Overlay
            forceMount
            className="fixed inset-0 z-20 bg-black/50"
          />
        </Transition.Child>

        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <DialogPrimitive.Content
            // This breaks even because it prevents interaction even after dialog
            // has been closed already...
            // onInteractOutside={(e) => {
            //   // This is a hack for DialogPrimitive.Root modal property not working as expected
            //   if (restProps.modal) {
            //     e.preventDefault()
            //   }
            // }}
            forceMount
            className={twMerge(
              'fixed top-1/2 left-1/2 z-50 flex max-h-[95vh] w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col md:w-full',
              'overflow-hidden rounded-lg bg-venice-black',
              'ring-0 ring-primary/75 focus:outline-none focus:ring-offset-0 focus-visible:ring focus-visible:ring-offset-2',
            )}>
            <div className="shrink overflow-y-auto">
              <motion.div className="h-0 w-full" animate={controls}>
                <div ref={contentRef as React.RefObject<HTMLDivElement>}>
                  {children}
                </div>
              </motion.div>
            </div>
          </DialogPrimitive.Content>
        </Transition.Child>
      </Transition.Root>
    </DialogPrimitive.Root>
  )
})

export {DialogPrimitive}
