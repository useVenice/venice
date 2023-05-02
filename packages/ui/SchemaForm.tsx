import type {default as Form, FormProps, ThemeProps} from '@rjsf/core'
import {withTheme} from '@rjsf/core'
import type {RJSFSchema} from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import React from 'react'

import type {z} from '@usevenice/util'
import {zodToJsonSchema} from '@usevenice/util'

import {cn} from './utils'

const theme: ThemeProps = {widgets: {}}

/** TODO: Actually customize with our own components... */
export const JsonSchemaForm = withTheme(theme) as typeof Form

/** For use with createRef... */
export type SchemaFormElement = Form

// Consider renaming this to zodSchemaForm
export const SchemaForm = React.forwardRef(function SchemaForm<
  TSchema extends z.ZodTypeAny,
>(
  {
    schema,
    hideSubmitButton,
    ...props
  }: Omit<FormProps<z.infer<TSchema>>, 'schema' | 'validator'> & {
    schema: TSchema
    hideSubmitButton?: boolean
  },
  forwardedRef: React.ForwardedRef<Form<z.infer<TSchema>>>,
) {
  const jsonSchema = zodToJsonSchema(schema) as RJSFSchema
  console.log('[SchemaForm] jsonSchema', jsonSchema)

  return (
    <JsonSchemaForm<z.infer<TSchema>>
      {...props}
      ref={forwardedRef}
      className={cn('schema-form', props.className)}
      schema={jsonSchema}
      validator={validator}
      templates={
        hideSubmitButton
          ? {ButtonTemplates: {SubmitButton: () => null}}
          : undefined
      }
    />
  )
})

/** https://fettblog.eu/typescript-react-generic-forward-refs/ */
declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}
