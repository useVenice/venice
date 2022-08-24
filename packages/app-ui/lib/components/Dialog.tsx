import {Cross1Icon} from '@radix-ui/react-icons'
import {useUpdateEffect} from '@react-hookz/web'
import * as DialogPrimitive from 'ariakit/dialog'
import React from 'react'
import {css, styled} from '../stitches.config'
import {IconButton} from './IconButton'
import {VStack} from './Stack'

export interface DialogProps
  extends Omit<React.ComponentProps<typeof StyledDialog>, 'state'> {
  visible?: boolean
  defaultVisible?: boolean
  onVisibleChange?: (newVisible: boolean) => void
}

export interface DialogInstance extends DialogPrimitive.DialogState {}

export const Dialog = React.forwardRef(function Dialog(
  {
    visible,
    defaultVisible,
    onVisibleChange,
    backdropProps: {className: backdropClassName, ...backdropProps} = {},
    children,
    ...restProps
  }: DialogProps,
  ref: React.ForwardedRef<DialogInstance>,
) {
  const dialog = DialogPrimitive.useDialogState({
    animated: true,
    visible,
    defaultVisible,
  })
  React.useImperativeHandle(ref, (): DialogInstance => dialog)
  useUpdateEffect(
    () => {
      if (!dialog.animating) {
        onVisibleChange?.(dialog.visible)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dialog.animating, dialog.visible],
  )
  return (
    <StyledDialog
      state={dialog}
      backdropProps={{
        className: backdrop({className: backdropClassName}),
        ...backdropProps,
      }}
      {...restProps}>
      <VStack
        css={{
          maxHeight: '85vh',
          maxWidth: 'min(100vw, $96)',
        }}>
        <StyledHeader>
          <DialogPrimitive.DialogDismiss as={IconButton}>
            <Cross1Icon />
          </DialogPrimitive.DialogDismiss>
        </StyledHeader>

        {children}
      </VStack>
    </StyledDialog>
  )
})

const StyledDialog = styled(DialogPrimitive.Dialog, {
  backgroundColor: '$gray1',
  borderRadius: '$md',
  boxShadow: '$2xl',
  color: '$gray12',
  fontFamily: '$body',
  fontSize: '$base',
  left: '50%',
  lineHeight: '$base',
  opacity: 0,
  position: 'fixed',
  top: '50%',
  transform: 'translate(-50%, -60%)',
  transition: '$default',
  transitionProperty: 'opacity transform',
  zIndex: '$dialog',
  '&:focus-visible': {
    outline: 'none',
  },
  '&[data-enter]': {
    opacity: 1,
    transform: 'translate(-50%, -50%)',
  },
  '&[data-leave]': {
    transform: 'translate(-50%, -40%)',
  },
})

const StyledHeader = styled('header', {
  padding: '$4',
})

const backdrop = css({
  backgroundColor: '$blackA9',
  opacity: 0,
  transition: '$default',
  transitionProperty: 'opacity',
  '&[data-enter]': {
    opacity: 1,
  },
})

export const DialogDismiss = DialogPrimitive.DialogDismiss
export const DialogHeading = DialogPrimitive.DialogHeading
