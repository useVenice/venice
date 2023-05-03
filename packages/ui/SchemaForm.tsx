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
    formData: _formData,
    onSubmit,
    loading,
    ...props
  }: Omit<FormProps<z.infer<TSchema>>, 'schema' | 'validator' | 'onSubmit'> & {
    schema: TSchema
    hideSubmitButton?: boolean
    onSubmit?: (data: {formData: z.infer<TSchema>}) => void
    loading?: boolean
  },
  forwardedRef: React.ForwardedRef<Form<z.infer<TSchema>>>,
) {
  const jsonSchema = zodToJsonSchema(schema) as RJSFSchema

  // We cache the formState so that re-render does not cause immediate loss
  // though this may sometimes cause stale data? Need to think more about it.
  const [formData, setFormData] = React.useState<z.infer<TSchema>>(_formData)
  // console.log('[SchemaForm] jsonSchema', jsonSchema)

  return (
    <JsonSchemaForm<z.infer<TSchema>>
      disabled={loading}
      {...props}
      ref={forwardedRef}
      formData={formData}
      className={cn('schema-form', loading && 'loading', props.className)}
      schema={jsonSchema}
      validator={validator}
      uiSchema={{
        ...(hideSubmitButton && {'ui:submitButtonOptions': {norender: true}}),
        ...props.uiSchema,
      }}
      onSubmit={(data) => {
        if (!data.formData) {
          throw new Error('Invariant: formData is undefined')
        }
        setFormData(data.formData)
        onSubmit?.({formData: data.formData})
      }}
    />
  )
})

/** https://fettblog.eu/typescript-react-generic-forward-refs/ */
declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}
