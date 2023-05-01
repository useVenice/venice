import type {default as Form, ThemeProps} from '@rjsf/core'
import {withTheme} from '@rjsf/core'
import type {RJSFSchema} from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import React from 'react'

import type {z} from '@usevenice/util'
import {zodToJsonSchema} from '@usevenice/util'

import {cn} from './utils'

const theme: ThemeProps = {widgets: {}}

/** TODO: Actually customize with our own components... */
export const JsonSchemaForm = withTheme(theme)

/** For use with createRef... */
export type SchemaFormElement = Form

// Consider renaming this to zodSchemaForm
export const SchemaForm = React.forwardRef<
  SchemaFormElement,
  Omit<
    React.ComponentPropsWithoutRef<typeof JsonSchemaForm>,
    'schema' | 'validator'
  > & {
    schema: z.ZodTypeAny
    hideSubmitButton?: boolean
  }
>(function SchemaForm({schema, hideSubmitButton, ...props}, forwardedRef) {
  const jsonSchema = zodToJsonSchema(schema) as RJSFSchema
  console.log('[SchemaForm] jsonSchema', jsonSchema)

  return (
    <JsonSchemaForm
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
