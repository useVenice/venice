'use client'

import type {UseMutationResult} from '@tanstack/react-query'
import {Loader2} from 'lucide-react'
import React from 'react'

import type {z} from '@usevenice/util'

import {
  Button,
  ButtonProps,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useToast,
} from './new-components'
import {SchemaForm, SchemaFormProps} from './SchemaForm'

export function SchemaSheet<T extends z.ZodTypeAny>({
  schema,
  mutation,
  initialValues,
  title,
  buttonProps,
  formProps,
}: {
  formProps?: Omit<SchemaFormProps<T>, 'onSubmit' | 'schema' | 'formData'>
  buttonProps?: ButtonProps
  schema: T
  initialValues?: Partial<z.infer<T>>
  // TODO: Fix the typing here. Schema needs to conform to mutation typing, but
  // mutation does not need to conform to schema typing here...
  mutation: UseMutationResult<any, any, z.infer<T>, any>
  title?: string
}) {
  const [open, setOpen] = React.useState(false)

  const {toast} = useToast()
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" {...buttonProps}>
          {mutation.isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {title ?? 'Open'}
        </Button>
      </SheetTrigger>
      <SheetContent
        position="right"
        size="xl"
        className="flex flex-col bg-background">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <SchemaForm
          {...formProps}
          schema={schema}
          formData={initialValues}
          onSubmit={({formData}) => {
            console.log('formData', formData)
            mutation.mutate(formData, {
              onSuccess: () => {
                setOpen(false)
                toast({title: 'Success', variant: 'success'})
              },
              onError: (err) => {
                toast({
                  title: 'Failed to save',
                  description: `${err.message}`,
                  variant: 'destructive',
                })
              },
            })
          }}
        />
        <SheetFooter>{/* Cancel here */}</SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
